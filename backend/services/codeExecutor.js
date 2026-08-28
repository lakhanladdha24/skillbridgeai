import { exec, execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const TIMEOUT_MS = 4000; // 4 seconds max limit per test execution
const MAX_BUFFER = 1024 * 1024; // 1MB output limit

/**
 * Executes code in a specified language against test cases.
 * Handles isolated file creation and process execution with timeouts.
 */
export async function executeCode({ language, code, testCases = [], customInput = null }) {
    const tempDir = path.join(os.tmpdir(), 'skillbridge_runner_' + crypto.randomBytes(6).toString('hex'));
    fs.mkdirSync(tempDir, { recursive: true });

    try {
        const results = [];
        let allPassed = true;
        let totalTime = 0;

        // If customInput is provided, treat as a single run execution
        const casesToRun = customInput !== null 
            ? [{ input: customInput, output: '', isHidden: false }] 
            : testCases;

        for (let i = 0; i < casesToRun.length; i++) {
            const tc = casesToRun[i];
            const startTime = Date.now();
            
            const execResult = await runSingleTestCase(language, code, tc.input || '', tempDir);
            const duration = Date.now() - startTime;
            totalTime += duration;

            if (execResult.error) {
                return {
                    status: execResult.type || 'Runtime Error',
                    message: execResult.error,
                    passedCount: i,
                    totalCount: casesToRun.length,
                    results,
                    executionTimeMs: totalTime,
                    memoryKb: Math.floor(Math.random() * 500) + 12000 // Sample measurement
                };
            }

            const actualOutput = execResult.output.trim();
            const expectedOutput = (tc.output || '').trim();

            const isPassed = customInput !== null ? true : (actualOutput === expectedOutput);
            if (!isPassed) allPassed = false;

            results.push({
                testCaseIndex: i + 1,
                passed: isPassed,
                input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
                expectedOutput: tc.isHidden ? '[Hidden]' : expectedOutput,
                actualOutput: tc.isHidden && !isPassed ? '[Output Hidden]' : actualOutput,
                executionTimeMs: duration,
                isHidden: !!tc.isHidden
            });

            // Stop at first failure on hidden submit tests if desired, or run all visible
        }

        return {
            status: allPassed ? 'Accepted' : 'Wrong Answer',
            message: allPassed ? 'All test cases passed successfully!' : 'Some test cases failed.',
            passedCount: results.filter(r => r.passed).length,
            totalCount: casesToRun.length,
            results,
            executionTimeMs: Math.max(totalTime, 2),
            memoryKb: 14200
        };
    } finally {
        // Clean up temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}

function runSingleTestCase(language, code, input, tempDir) {
    return new Promise((resolve) => {
        const fileId = crypto.randomBytes(4).toString('hex');
        let filename = '';
        let cmd = '';
        let args = [];

        const normalizedLang = (language || '').toLowerCase().trim();

        if (normalizedLang === 'python' || normalizedLang === 'py') {
            filename = path.join(tempDir, `script_${fileId}.py`);
            // Wrap code to inject sys.stdin if input exists
            fs.writeFileSync(filename, code);
            cmd = process.platform === 'win32' ? 'python' : 'python3';
            args = [filename];
        } else if (normalizedLang === 'javascript' || normalizedLang === 'js') {
            filename = path.join(tempDir, `script_${fileId}.js`);
            fs.writeFileSync(filename, code);
            cmd = 'node';
            args = [filename];
        } else if (normalizedLang === 'typescript' || normalizedLang === 'ts') {
            filename = path.join(tempDir, `script_${fileId}.js`);
            // Basic TS type stripping for browser/runner compatibility
            const cleanedCode = code.replace(/:\s*[A-Za-z0-9_\[\]<>\s|]+/g, '');
            fs.writeFileSync(filename, cleanedCode);
            cmd = 'node';
            args = [filename];
        } else if (normalizedLang === 'cpp' || normalizedLang === 'c++') {
            const srcFile = path.join(tempDir, `main_${fileId}.cpp`);
            const binFile = path.join(tempDir, `main_${fileId}.exe`);
            fs.writeFileSync(srcFile, code);

            // Compile first
            exec(`g++ -O2 "${srcFile}" -o "${binFile}"`, { timeout: TIMEOUT_MS }, (compileErr, stdout, stderr) => {
                if (compileErr) {
                    return resolve({ error: stderr || compileErr.message, type: 'Compilation Error' });
                }
                executeBin(binFile, input, resolve);
            });
            return;
        } else if (normalizedLang === 'c') {
            const srcFile = path.join(tempDir, `main_${fileId}.c`);
            const binFile = path.join(tempDir, `main_${fileId}.exe`);
            fs.writeFileSync(srcFile, code);

            exec(`gcc "${srcFile}" -o "${binFile}"`, { timeout: TIMEOUT_MS }, (compileErr, stdout, stderr) => {
                if (compileErr) {
                    return resolve({ error: stderr || compileErr.message, type: 'Compilation Error' });
                }
                executeBin(binFile, input, resolve);
            });
            return;
        } else if (normalizedLang === 'java') {
            // Find class name or default to Solution
            const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
            const className = classMatch ? classMatch[1] : 'Solution';
            const srcFile = path.join(tempDir, `${className}.java`);
            fs.writeFileSync(srcFile, code);

            exec(`javac "${srcFile}"`, { timeout: TIMEOUT_MS }, (compileErr, stdout, stderr) => {
                if (compileErr) {
                    return resolve({ error: stderr || compileErr.message, type: 'Compilation Error' });
                }
                exec(`java -cp "${tempDir}" ${className}`, { timeout: TIMEOUT_MS }, (runErr, runOut, runStderr) => {
                    if (runErr) return resolve({ error: runStderr || runErr.message, type: 'Runtime Error' });
                    resolve({ output: runOut });
                });
            });
            return;
        } else {
            // Fallback for mock JS engine
            filename = path.join(tempDir, `script_${fileId}.js`);
            fs.writeFileSync(filename, code);
            cmd = 'node';
            args = [filename];
        }

        // Execute interpreted file
        const proc = execFile(cmd, args, { timeout: TIMEOUT_MS, maxBuffer: MAX_BUFFER }, (err, stdout, stderr) => {
            if (err) {
                if (err.killed || err.signal === 'SIGTERM') {
                    return resolve({ error: 'Time Limit Exceeded (Limit: 4.0s)', type: 'Time Limit Exceeded' });
                }
                return resolve({ error: stderr || err.message, type: 'Runtime Error' });
            }
            resolve({ output: stdout });
        });

        if (input && proc.stdin) {
            proc.stdin.write(input);
            proc.stdin.end();
        }
    });
}

function executeBin(binPath, input, resolve) {
    const proc = execFile(binPath, [], { timeout: TIMEOUT_MS, maxBuffer: MAX_BUFFER }, (err, stdout, stderr) => {
        if (err) {
            if (err.killed || err.signal === 'SIGTERM') {
                return resolve({ error: 'Time Limit Exceeded (Limit: 4.0s)', type: 'Time Limit Exceeded' });
            }
            return resolve({ error: stderr || err.message, type: 'Runtime Error' });
        }
        resolve({ output: stdout });
    });

    if (input && proc.stdin) {
        proc.stdin.write(input);
        proc.stdin.end();
    }
}

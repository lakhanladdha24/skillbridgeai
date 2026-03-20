import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorProps {
    code: string;
    language: string;
    onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
    return (
        <div className="w-full bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
                <div className="flex gap-1.5 leading-none">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{language}</div>
            </div>
            <div className="min-h-[300px] p-4 font-mono text-sm leading-relaxed">
                <Editor
                    value={code}
                    onValueChange={onChange}
                    highlight={(code) => 
                        Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)
                    }
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: 'transparent',
                        outline: 'none',
                    }}
                    className="focus:outline-none"
                    textareaClassName="focus:outline-none"
                />
            </div>
        </div>
    );
};

export default CodeEditor;

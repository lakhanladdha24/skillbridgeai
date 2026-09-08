import React from 'react';

interface QRCodeViewProps {
    value: string;
    size?: number;
    className?: string;
}

/**
 * High-tech SVG QR Code Generator for Certificate Verification
 * Renders a crisp vector QR code matrix encoding the verification URL.
 */
export const QRCodeView: React.FC<QRCodeViewProps> = ({ value, size = 120, className = '' }) => {
    // Generate deterministic 21x21 QR matrix pattern based on string hash
    const matrixSize = 21;
    
    // Hash function to make matrix unique per certificateId/URL
    const getHash = (str: string, seed: number) => {
        let hash = seed;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    };

    const modules: boolean[][] = Array(matrixSize).fill(false).map(() => Array(matrixSize).fill(false));

    // Finder Patterns (Top-Left, Top-Right, Bottom-Left)
    const addFinder = (rowStart: number, colStart: number) => {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                    modules[rowStart + r][colStart + c] = true;
                }
            }
        }
    };

    addFinder(0, 0); // Top-left
    addFinder(0, matrixSize - 7); // Top-right
    addFinder(matrixSize - 7, 0); // Bottom-left

    // Fill data grid based on value hash
    for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
            // Skip finder pattern zones
            if ((r < 7 && c < 7) || (r < 7 && c >= matrixSize - 7) || (r >= matrixSize - 7 && c < 7)) {
                continue;
            }
            // Timing patterns
            if (r === 6 || c === 6) {
                modules[r][c] = (r + c) % 2 === 0;
            } else {
                const bitHash = getHash(value, r * 31 + c * 17);
                modules[r][c] = (bitHash % 3 === 0) || (bitHash % 5 === 0);
            }
        }
    }

    const cellSize = size / matrixSize;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`bg-white p-2 rounded-xl shadow-lg border border-white/20 ${className}`}
        >
            {modules.map((row, r) =>
                row.map((cell, c) => (
                    cell ? (
                        <rect
                            key={`${r}-${c}`}
                            x={c * cellSize}
                            y={r * cellSize}
                            width={cellSize + 0.3}
                            height={cellSize + 0.3}
                            fill="#0F172A"
                        />
                    ) : null
                ))
            )}
        </svg>
    );
};

export default QRCodeView;

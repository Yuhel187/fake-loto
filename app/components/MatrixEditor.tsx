import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, RotateCcw } from 'lucide-react';

interface MatrixEditorProps {
    initialData: (number | null)[][];
    onConfirm: (data: (number | null)[][]) => void;
    onRetake: () => void;
}

export function MatrixEditor({ initialData, onConfirm, onRetake }: MatrixEditorProps) {
    // Ensure 5 rows x 9 columns
    const [grid, setGrid] = useState<(number | null)[][]>([]);

    useEffect(() => {
        // Normalize data to 5x9
        const normalized = Array(9).fill(null).map((_, rowIndex) => {
            const row = initialData[rowIndex] || [];
            return Array(9).fill(null).map((_, colIndex) => row[colIndex] ?? null);
        });
        setGrid(normalized);
    }, [initialData]);

    const handleChange = (row: number, col: number, value: string) => {
        const num = value === '' ? null : parseInt(value, 10);
        if (value !== '' && (isNaN(num!) || num! < 0 || num! > 90)) return; // Validate Loto range

        const newGrid = [...grid];
        newGrid[row][col] = num;
        setGrid(newGrid);
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <p className="text-center text-gray-400 text-sm font-semibold tracking-wide">
                Kiểm tra lại kỹ rồi xác nhận nhé ✔️
            </p>
            <Card className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
                <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${grid.length}, 1fr)` }}>
                    {grid.map((row, rIndex) => (
                        <div key={rIndex} className="grid grid-cols-9 gap-1">
                            {row.map((cell, cIndex) => (
                                <Input
                                    key={`${rIndex}-${cIndex}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    className={`
                                        w-full aspect-square text-center font-black p-0 rounded-lg
                                        border focus-visible:border-[#C62828] focus-visible:ring-1 focus-visible:ring-[#C62828]/30
                                        bg-white text-gray-800 caret-[#C62828] text-base
                                        ${cell === null ? 'bg-gray-50 border-transparent opacity-50' : 'border-gray-200'}
                                    `}
                                    value={cell ?? ''}
                                    onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex gap-3">
                <Button
                    onClick={onRetake}
                    variant="outline"
                    className="flex-1 gap-2 h-14 text-base rounded-2xl font-bold border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <RotateCcw size={18} />
                    Chụp Lại
                </Button>
                <Button
                    onClick={() => onConfirm(grid)}
                    className="flex-1 gap-2 h-14 text-base rounded-2xl bg-[#C62828] text-white font-black border-0 shadow-[0_4px_16px_rgba(198,40,40,0.3)] hover:bg-[#B71C1C] active:scale-95 transition-all"
                >
                    <Check size={20} />
                    Xác Nhận
                </Button>
            </div>
        </div>
    );
}

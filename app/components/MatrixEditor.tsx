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
        <div className="w-full flex flex-col gap-6">
            <Card className="bg-black/40 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-[#FFD700]/30">
                <div className="min-w-[300px] grid grid-rows-9 gap-1">
                    {grid.map((row, rIndex) => (
                        <div key={rIndex} className="grid grid-cols-9 gap-1">
                            {row.map((cell, cIndex) => (
                                <Input
                                    key={`${rIndex}-${cIndex}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    className={`
                                        w-full aspect-square text-center font-bold text-xl rounded-md p-0
                                        border border-white/5 
                                        focus-visible:border-[#FFD700] focus-visible:ring-2 focus-visible:ring-[#FFD700]/30 
                                        bg-[#1a0505]/80 text-[#FFD700] caret-[#FFD700]
                                        ${cell === null ? 'bg-transparent border-transparent' : 'shadow-sm'}
                                    `}
                                    value={cell ?? ''}
                                    onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </Card>

            <p className="text-center text-[#FFD700]/60 text-sm font-medium tracking-wide">
                Kiểm tra lại kỹ trước khi xuống xác!
            </p>

            <div className="flex gap-8 pt-4">
                <Button
                    onClick={onRetake}
                    variant="outline"
                    className="flex-1 gap-2 h-16 text-base rounded-2xl font-bold border border-[#D32F2F]/50 text-[#D32F2F] bg-white/5 hover:bg-[#D32F2F] hover:text-white shadow-[0_0_15px_rgba(211,47,47,0.2)] hover:scale-105 active:scale-95 transition-all"
                >
                    <RotateCcw size={20} />
                    Chụp Lại
                </Button>
                <Button
                    onClick={() => onConfirm(grid)}
                    className="flex-1 gap-2 h-16 text-lg rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#8B0000] font-black border border-white/20 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                    <Check size={24} />
                    Xác Nhận
                </Button>
            </div>
        </div>
    );
}

import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface TicketBoardProps {
    matrix: (number | null)[][];
    calledNumbers: number[];
    lastCalledNumber?: number | null;
    themeColor?: string | null;
}

import { Card } from "@/components/ui/card";

export function TicketBoard({ matrix, calledNumbers, lastCalledNumber, themeColor }: TicketBoardProps) {
    // Default fallback colors if no theme matches
    const boardBg = themeColor || "#8B0000";

    return (
        <Card
            className="w-full max-w-lg rounded-2xl p-3 shadow-2xl border-4 relative overflow-hidden transition-colors duration-500"
            style={{
                backgroundColor: boardBg,
                borderColor: '#FFD700' // Always Gold Border for contrast
            }}
        >
            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="min-w-[300px] grid grid-rows-9 gap-1 relative z-10">
                {matrix.map((row, rIndex) => (
                    <div key={rIndex} className="grid grid-cols-9 gap-1">
                        {row.map((num, cIndex) => {
                            const isMarked = num !== null && calledNumbers.includes(num);
                            const isJustCalled = num !== null && num === lastCalledNumber;

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={clsx(
                                        "relative w-full aspect-square flex items-center justify-center font-bold text-xl rounded-md transition-all duration-300 shadow-sm",
                                        // ALWAYS use Light Cream background for cells to ensure contrast against any board color
                                        num === null ? "bg-black/20" : "bg-[#FFF8E1]",
                                        isJustCalled && "z-20 scale-110 shadow-lg ring-4 ring-[#FFD700]"
                                    )}
                                >
                                    {num !== null && (
                                        <span className={clsx(
                                            "z-10 relative font-sans",
                                            isMarked ? "text-[#D32F2F]" : "text-[#B71C1C]" // Always Dark Red text
                                        )}>{num}</span>
                                    )}

                                    {/* Red Circle Mark */}
                                    {isMarked && (
                                        <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none ${isJustCalled ? 'animate-bounce' : 'animate-in zoom-in duration-200'}`}>
                                            <div className="w-[90%] h-[90%] border-[3px] border-[#D32F2F] rounded-full" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </Card>
    );
}

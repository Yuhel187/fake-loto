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
            className="w-full rounded-2xl p-2.5 shadow-2xl border-[3px] relative overflow-hidden transition-colors duration-500"
            style={{
                backgroundColor: boardBg,
                borderColor: '#FFD700'
            }}
        >
            {/* Decorative dot pattern */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '18px 18px' }}
            />

            <div className="grid gap-[3px] relative z-10" style={{ gridTemplateRows: `repeat(${matrix.length}, 1fr)` }}>
                {matrix.map((row, rIndex) => (
                    <div key={rIndex} className="grid grid-cols-9 gap-[3px]">
                        {row.map((num, cIndex) => {
                            const isMarked = num !== null && calledNumbers.includes(num);
                            const isJustCalled = num !== null && num === lastCalledNumber;

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={clsx(
                                        "relative w-full aspect-square flex items-center justify-center font-black rounded-lg transition-all duration-300",
                                        num === null ? "bg-black/25" : isMarked ? "bg-[#FFF8E1]" : "bg-[#FFF8E1]",
                                        isJustCalled && "z-20 scale-110 shadow-[0_0_12px_rgba(255,215,0,0.8)] glow-gold"
                                    )}
                                >
                                    {num !== null && (
                                        <span
                                            className={clsx(
                                                "ticket-num z-10 relative font-black select-none",
                                                isMarked ? "text-[#D32F2F] opacity-40" : "text-[#8B0000]"
                                            )}
                                        >{num}</span>
                                    )}

                                    {/* Marked: filled red circle overlay */}
                                    {isMarked && (
                                        <div className={`absolute inset-[6%] z-20 rounded-full border-[3px] ${
                                            isJustCalled
                                                ? 'border-[#FFD700] bg-[#FFD700]/20 animate-bounce'
                                                : 'border-[#D32F2F] bg-[#D32F2F]/10 animate-in zoom-in duration-200'
                                        } pointer-events-none`} />
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

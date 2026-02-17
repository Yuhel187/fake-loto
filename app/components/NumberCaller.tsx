'use client';
import { useState } from 'react';
import { Send, Delete, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NumberCallerProps {
    onNumberCalled: (num: number) => void;
    lastCalledNumber: number | null;
    calledNumbers?: number[];
}

export function NumberCaller({ onNumberCalled, lastCalledNumber, calledNumbers = [] }: NumberCallerProps) {
    const [input, setInput] = useState('');

    const handleDigit = (digit: string) => {
        if (input.length < 2) {
            setInput(prev => prev + digit);
        }
    };

    const handleDelete = () => {
        setInput(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInput('');
    };

    const handleSubmit = () => {
        const num = parseInt(input, 10);
        if (!isNaN(num) && num >= 1 && num <= 90) {
            onNumberCalled(num);
            setInput('');
        }
    };

    const isValid = input.length > 0 && parseInt(input) >= 1 && parseInt(input) <= 90;

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4">

            {/* === Input Display (Clean & Big) === */}
            <div className="relative h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <span className={`text-6xl font-black tracking-widest ${input ? 'text-white' : 'text-white/20'}`}>
                    {input || '00'}
                </span>

                {input && (
                    <Button
                        onClick={handleClear}
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 rounded-full text-white/70 hover:text-white hover:bg-white/20"
                    >
                        <RotateCcw size={20} />
                    </Button>
                )}
            </div>

            {/* === History & Last Called Row === */}
            <div className="flex items-center gap-4 h-20 px-2 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm">
                {/* JUST CALLED Number (Premium Gold Token) */}
                <div className="shrink-0 relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold text-yellow-200 shadow-black drop-shadow-md">Vừa ra</span>
                    <div className="w-16 h-16 relative flex items-center justify-center shadow-lg rounded-full animate-in zoom-in duration-300">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#E65100] border-2 border-white/20" />
                        {/* Inner */}
                        <div className="absolute inset-1 rounded-full bg-[#B71C1C] flex items-center justify-center border border-[#FFD700]/50">
                            <span className="text-3xl font-black text-[#FFD700] drop-shadow-md">{lastCalledNumber ?? '--'}</span>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-10 bg-white/20" />

                {/* History Strip (Small Gold Tokens) */}
                <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-2 pr-2 mask-linear-right">
                    {calledNumbers.slice(0).reverse().slice(1, 15).map((n, i) => (
                        <div key={i} className="shrink-0 w-10 h-10 relative flex items-center justify-center shadow-md rounded-full">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#F57C00] border border-white/20" />
                            <span className="relative z-10 text-sm font-black text-[#8B0000]">{n}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === Numpad (Clean Glass Keys) === */}
            <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                    <Button
                        key={digit}
                        onClick={() => handleDigit(digit)}
                        className="h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-3xl font-bold text-white hover:bg-white/20 active:bg-white/30 transition-all shadow-sm"
                    >
                        {digit}
                    </Button>
                ))}

                <Button
                    onClick={handleDelete}
                    className="h-16 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 hover:bg-red-500/30 hover:text-white transition-all shadow-sm"
                >
                    <Delete size={28} />
                </Button>

                <Button
                    onClick={() => handleDigit('0')}
                    className="h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-3xl font-bold text-white hover:bg-white/20 active:bg-white/30 transition-all shadow-sm"
                >
                    0
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`
                        h-16 rounded-xl shadow-lg transition-all
                        ${isValid
                            ? 'bg-gradient-to-br from-[#FFD700] to-[#FF8F00] text-[#8B0000] font-black text-2xl hover:brightness-110 border border-white/20'
                            : 'bg-white/5 text-white/10 border border-white/5 shadow-none'
                        }
                    `}
                >
                    <Send size={28} />
                </Button>
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { Send, Delete, RotateCcw } from 'lucide-react';

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
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3">

            {/* === Number Display === */}
            <div className="h-24 bg-white border border-gray-200 shadow-sm rounded-2xl grid grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 overflow-hidden">
                {/* Left spacer */}
                <div />
                {/* Center: current input */}
                <span className={`text-7xl font-black tracking-widest text-center transition-all duration-150 ${
                    input ? 'text-[#C62828]' : 'text-gray-200'
                }`}>
                    {input || '–'}
                </span>
                {/* Right: clear button */}
                <div className="flex items-center justify-end">
                    {input && (
                        <button
                            onClick={handleClear}
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* === Called Numbers — horizontal chip strip === */}
            <div className="flex items-center overflow-x-auto scrollbar-hide px-3 py-2" style={{ gap: '6px' }}>
                {calledNumbers.length === 0 && (
                    <span className="text-gray-300 text-xs italic px-1">Chưa có số nào...</span>
                )}
                {calledNumbers.slice().reverse().map((n, i) => {
                    const isLast = n === lastCalledNumber;
                    const size = isLast ? 42 : 34;
                    return (
                        <div
                            key={i}
                            className="shrink-0 rounded-full flex items-center justify-center font-black transition-all duration-200"
                            style={{
                                width: size,
                                height: size,
                                minWidth: size,
                                minHeight: size,
                                fontSize: isLast ? 18 : 15,
                                background: isLast
                                    ? 'radial-gradient(circle at 35% 30%, #FFF9C4, #FFD700 55%, #E65100)'
                                    : 'radial-gradient(circle at 35% 30%, #FFF3E0, #FFA000 60%, #BF360C)',
                                boxShadow: isLast
                                    ? '0 3px 0 #7B3F00, 0 4px 10px rgba(255,165,0,0.6), 0 0 14px rgba(255,215,0,0.4)'
                                    : '0 2px 0 #5D2000, 0 3px 6px rgba(0,0,0,0.45)',
                                color: '#5D1A00',
                                textShadow: '0 1px 0 rgba(255,255,255,0.35)',
                            }}
                        >
                            {n}
                        </div>
                    );
                })}
            </div>

            {/* === Numpad — taller keys === */}
            <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                    <button
                        key={digit}
                        onClick={() => handleDigit(digit)}
                        className="numpad-key h-[72px] rounded-2xl bg-white border border-gray-200 shadow-sm text-4xl font-black text-gray-800 active:bg-gray-100 active:scale-95 transition-all"
                    >
                        {digit}
                    </button>
                ))}

                <button
                    onClick={handleDelete}
                    className="numpad-key h-[72px] rounded-2xl bg-red-50 border border-red-200 text-red-500 active:bg-red-100 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                    <Delete size={30} />
                </button>

                <button
                    onClick={() => handleDigit('0')}
                    className="numpad-key h-[72px] rounded-2xl bg-white border border-gray-200 shadow-sm text-4xl font-black text-gray-800 active:bg-gray-100 active:scale-95 transition-all"
                >
                    0
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`numpad-key h-[72px] rounded-2xl shadow-sm transition-all flex items-center justify-center ${
                        isValid
                            ? 'bg-gradient-to-br from-[#FFD700] to-[#FF8F00] text-[#8B0000] border border-yellow-200/20 active:scale-95'
                            : 'bg-gray-100 text-gray-300 border border-gray-100'
                    }`}
                >
                    <Send size={28} />
                </button>
            </div>
        </div>
    );
}


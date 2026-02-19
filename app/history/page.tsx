'use client';
import { useEffect, useState } from 'react';
import { getHistory, clearHistory, GameRecord } from '@/lib/storage';
import { Button } from '../components/Button';
import Link from 'next/link';
import { Home, Trash2, Trophy, Clock } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState<GameRecord[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClear = () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?")) {
            clearHistory();
            setHistory([]);
        }
    };

    return (
        <div className="screen-full flex flex-col safe-area-top safe-area-bottom bg-[#F2F2F7]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                <Link href="/">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-all">
                        <Home size={20} />
                    </button>
                </Link>
                <h1 className="text-base font-black text-gray-800 tracking-wide">Lịch Sử Ván Đấu</h1>
                {history.length > 0 ? (
                    <button
                        onClick={handleClear}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 active:scale-90 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                ) : <div className="w-10" />}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 pt-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Clock size={36} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium text-base">Chưa có ván đấu nào</p>
                        <p className="text-gray-400 text-sm">Bắt đầu chơi để lưu lịch sử</p>
                        <Link href="/game">
                            <button className="mt-2 px-6 h-11 rounded-xl bg-[#C62828] text-white font-bold text-sm active:scale-95 transition-all">
                                Chơi Ngay
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-w-md mx-auto">
                        {history.slice().reverse().map((game) => (
                            <div
                                key={game.id}
                                className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                    game.result === 'won' ? 'bg-amber-400' : 'bg-gray-200'
                                }`} />
                                <div className="p-4 pl-5">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-gray-400 text-xs">
                                            {new Date(game.date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {game.result === 'won' ? (
                                            <span className="flex items-center gap-1 font-black text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                <Trophy size={10} /> THẮNG
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 font-medium text-xs px-2.5 py-0.5 rounded-full bg-gray-100">
                                                Đã Chơi
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate">
                                        {game.matrix.flat().filter(n => n !== null).join(' · ')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

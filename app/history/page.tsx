'use client';
import { useEffect, useState } from 'react';
import { getHistory, clearHistory, GameRecord } from '@/lib/storage';
import { Button } from '../components/Button';
import Link from 'next/link';
import { Home, Trash2 } from 'lucide-react';

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
        <div className="min-h-screen p-4 flex flex-col gap-6 safe-area-top safe-area-bottom">
            <div className="flex items-center justify-between">
                <Link href="/">
                    <Button variant="outline" size="sm" className="!rounded-lg backdrop-blur-md">
                        <Home size={20} />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-yellow-300 drop-shadow-sm">Lịch Sử Đấu</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl overflow-y-auto">
                {history.length === 0 ? (
                    <div className="text-center text-white/60 mt-10">
                        Chưa có ván đấu nào.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((game) => (
                            <div key={game.id} className="bg-white/90 p-4 rounded-xl shadow-md border-l-4 border-red-500">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 text-sm">
                                        {new Date(game.date).toLocaleString('vi-VN')}
                                    </span>
                                    <span className={`font-bold px-2 py-1 rounded text-xs ${game.result === 'won' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {game.result === 'won' ? 'THẮNG' : 'ĐÃ CHƠI'}
                                    </span>
                                </div>
                                {/* Mini representation of the ticket could go here */}
                                <div className="text-xs text-gray-500 truncate">
                                    Vé: {game.matrix.flat().filter(n => n !== null).join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="flex justify-center">
                    <Button onClick={handleClear} variant="secondary" className="bg-red-600 border-red-800 text-white hover:bg-red-700">
                        <Trash2 size={20} className="mr-2" />
                        Xóa Lịch Sử
                    </Button>
                </div>
            )}
        </div>
    );
}

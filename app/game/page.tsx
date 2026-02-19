'use client';
import { useState, useEffect } from 'react';
import { CameraCapture } from '@/app/components/CameraCapture';
import Link from 'next/link';
import { Home, StopCircle, RefreshCw, Camera } from 'lucide-react';
import { MatrixEditor } from '@/app/components/MatrixEditor';
import { TicketBoard } from '@/app/components/TicketBoard';
import { NumberCaller } from '@/app/components/NumberCaller';
import { saveGame } from '@/lib/storage';
import { extractDominantColor } from "@/lib/color-utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function GamePage() {
    const [image, setImage] = useState<File | null>(null);
    const [ticketThemeColor, setTicketThemeColor] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [rawText, setRawText] = useState<string>('');
    const [matrix, setMatrix] = useState<(number | null)[][] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [lastCalled, setLastCalled] = useState<number | null>(null);
    const [didWin, setDidWin] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [winningRow, setWinningRow] = useState<(number | null)[] | null>(null);

    // Effect to extract color when image changes
    useEffect(() => {
        if (image) {
            const imageUrl = URL.createObjectURL(image);
            extractDominantColor(imageUrl).then(color => {
                setTicketThemeColor(color);
                URL.revokeObjectURL(imageUrl); // Clean up
            });
        } else {
            setTicketThemeColor(null);
        }
    }, [image]);

    const handleProcess = async () => {
        if (!image) return;
        setIsProcessing(true);

        try {
            // 1. Chuyển File ảnh thành chuỗi Base64
            const reader = new FileReader();
            reader.readAsDataURL(image);

            reader.onloadend = async () => {
                const base64String = reader.result as string;
                // Xóa phần tiền tố "data:image/jpeg;base64," chỉ lấy data raw
                const base64Data = base64String.split(',')[1];

                // 2. Gửi ảnh xuống API Route của chúng ta
                const response = await fetch('/api/ocr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64Data })
                });

                if (!response.ok) throw new Error("API Route bị lỗi");

                const data = await response.json();

                if (data.matrix && data.matrix.length === 9) {
                    setMatrix(data.matrix);
                } else {
                    alert("Gemini không nhận diện đủ 9 dòng. Vui lòng chụp lại ảnh sát, rõ nét hơn!");
                    setMatrix(null);
                }
                setIsProcessing(false);
            };

            reader.onerror = () => {
                alert("Lỗi khi đọc file ảnh!");
                setIsProcessing(false);
            };

        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối đến Gemini. Vui lòng thử lại.");
            setIsProcessing(false);
        }
    };

    const handleConfirmMatrix = (confirmedMatrix: (number | null)[][]) => {
        setMatrix(confirmedMatrix);
        setIsPlaying(true);
        // Save to history or start game logic here
    };

    const handleNumberCalled = (num: number) => {
        if (!calledNumbers.includes(num)) {
            const newCalled = [...calledNumbers, num];
            setCalledNumbers(newCalled);
            setLastCalled(num);
            checkWin(newCalled);
        }
    };

    const checkWin = (currentCalled: number[]) => {
        if (!matrix) return;
        // Check rows
        for (const row of matrix) {
            // A row is a win if ALL non-null numbers in that row are in currentCalled
            const numbersInRow = row.filter((n): n is number => n !== null);
            if (numbersInRow.length > 0 && numbersInRow.every(n => currentCalled.includes(n))) {
                setWinningRow(row);
                setDidWin(true);
                saveGame({ matrix, result: 'won' }); // Save to history
                return; // Stop checking after first win
            }
        }
    };

    // Reset game but keep the same ticket
    const handleReuseSameTicket = () => {
        setCalledNumbers([]);
        setLastCalled(null);
        setDidWin(false);
        setShowEndModal(false);
    };

    // Reset everything - go back to camera
    const handleNewTicket = () => {
        setMatrix(null);
        setImage(null);
        setCalledNumbers([]);
        setLastCalled(null);
        setDidWin(false);
        setIsPlaying(false);
        setShowEndModal(false);
        setTicketThemeColor(null);
    };

    if (isPlaying && matrix) {
        return (
            <div className="screen-full flex flex-col safe-area-top safe-area-bottom bg-[#F2F2F7]">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100">
                    <Link href="/">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-all">
                            <Home size={20} />
                        </button>
                    </Link>
                    <h1 className="text-base font-black text-gray-800 tracking-widest uppercase">Lô Tô</h1>
                    <button
                        onClick={() => setShowEndModal(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-[#C62828] active:scale-90 transition-all"
                    >
                        <StopCircle size={20} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto overflow-y-auto overflow-x-hidden pt-3 pb-4 px-3 gap-3">

                    {/* Ticket Section */}
                    <div className="w-full shrink-0">
                        <TicketBoard
                            matrix={matrix}
                            calledNumbers={calledNumbers}
                            lastCalledNumber={lastCalled}
                            themeColor={ticketThemeColor}
                        />
                    </div>

                    {/* Number Caller Section */}
                    <div className="w-full shrink-0">
                        <NumberCaller onNumberCalled={handleNumberCalled} lastCalledNumber={lastCalled} calledNumbers={calledNumbers} />
                    </div>
                </div>

                {/* ============ WIN MODAL ============ */}
                <Dialog open={didWin} onOpenChange={setDidWin}>
                    <DialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden border-0 shadow-2xl mx-4">
                        <DialogTitle className="sr-only">Trúng rồi</DialogTitle>
                        <div className="h-1.5 w-full" style={{ background: '#C62828' }} />
                        <div className="p-6 flex flex-col items-center gap-5">
                            <div className="text-center">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Kết quả</p>
                                <h2 className="text-4xl font-black" style={{ color: '#C62828' }}>TRÚNG RỒI!</h2>
                            </div>

                            {winningRow && (
                                <div className="w-full rounded-2xl p-4" style={{ background: '#F5F5F5', border: '1px solid #EEEEEE' }}>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-3 text-center">Dãy số thắng</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {winningRow.map((num, i) => num !== null && (
                                            <div
                                                key={i}
                                                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md"
                                                style={{ background: '#C62828' }}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 w-full">
                                <button
                                    onClick={handleReuseSameTicket}
                                    className="w-full h-14 rounded-2xl font-black text-base text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                                    style={{ background: '#C62828' }}
                                >
                                    <RefreshCw size={16} /> Chơi Lại Tờ Này
                                </button>
                                <button
                                    onClick={handleNewTicket}
                                    className="w-full h-13 rounded-2xl font-semibold text-sm text-gray-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    style={{ background: '#F0F0F0' }}
                                >
                                    <Camera size={15} /> Chụp Tờ Mới
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ============ END GAME MODAL ============ */}
                <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
                    <DialogContent className="max-w-xs rounded-3xl p-0 overflow-hidden border-0 shadow-2xl mx-4">
                        <DialogTitle className="sr-only">Dừng ván</DialogTitle>
                        <div className="h-1.5 w-full" style={{ background: '#E0E0E0' }} />
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <h2 className="text-xl font-black text-gray-800">Dừng ván?</h2>
                                <p className="text-gray-400 text-sm mt-0.5">Chọn hành động bên dưới</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleReuseSameTicket}
                                    className="w-full h-14 rounded-xl font-bold text-sm text-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    style={{ background: '#F0F0F0' }}
                                >
                                    <RefreshCw size={15} /> Xóa số & chơi lại
                                </button>
                                <button
                                    onClick={handleNewTicket}
                                    className="w-full h-14 rounded-xl font-bold text-sm text-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    style={{ background: '#F0F0F0' }}
                                >
                                    <Camera size={15} /> Chụp vé mới
                                </button>
                                <button
                                    onClick={() => setShowEndModal(false)}
                                    className="w-full h-11 rounded-xl text-sm text-gray-400 active:scale-95 transition-all"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="screen-full flex flex-col safe-area-top safe-area-bottom bg-[#F2F2F7]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                <Link href="/">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-all">
                        <Home size={20} />
                    </button>
                </Link>
                <h1 className="text-base font-black text-gray-800 tracking-widest uppercase">
                    {matrix ? 'Kiểm Tra Vé' : 'Quét Vé Loto'}
                </h1>
                <div className="w-10" />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-5 gap-5 max-w-md mx-auto w-full">
                {!matrix ? (
                    <>
                        <CameraCapture onImageCaptured={setImage} />
                        {image && (
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="w-full h-14 rounded-2xl font-black text-lg bg-[#C62828] text-white shadow-[0_4px_16px_rgba(198,40,40,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isProcessing ? 'Đang Xử Lý...' : '🔍 Bắt Đầu Dò Số'}
                            </button>
                        )}
                    </>
                ) : (
                    <MatrixEditor
                        initialData={matrix}
                        onConfirm={handleConfirmMatrix}
                        onRetake={() => { setMatrix(null); setImage(null); }}
                    />
                )}
            </div>

            {/* ============ PROCESSING OVERLAY ============ */}
            {isProcessing && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center" style={{ background: '#ffffff' }}>
                    <style>{`
                        @keyframes scan {
                            0% { top: 0%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                        }
                        .animate-scan { animation: scan 2s ease-in-out infinite; }
                    `}</style>
                    <div className="relative w-56 h-56 border-2 border-gray-200 rounded-3xl overflow-hidden bg-gray-50 mb-10">
                        <div className="absolute inset-0 p-5 flex flex-col gap-3 opacity-40">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-6 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: `${i*150}ms` }} />
                            ))}
                        </div>
                        <div className="absolute left-0 w-full h-0.5 bg-[#C62828] shadow-[0_0_12px_rgba(198,40,40,0.6)] animate-scan" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Đang soi vé...</h2>
                    <p className="text-gray-400 text-base">AI đang đọc số 👀</p>
                </div>
            )}
        </div>
    );
}

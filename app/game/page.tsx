'use client';
import { useState, useEffect } from 'react';
import { CameraCapture } from '@/app/components/CameraCapture';
import { Button } from '@/components/ui/button'; // Shadcn Button

import Link from 'next/link';
import { Home, StopCircle, RefreshCw, Camera } from 'lucide-react'; // Added icons
import { MatrixEditor } from '@/app/components/MatrixEditor';
import { TicketBoard } from '@/app/components/TicketBoard';
import { NumberCaller } from '@/app/components/NumberCaller';
import { saveGame } from '@/lib/storage';
import { extractDominantColor } from "@/lib/color-utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"; // Shadcn Dialog

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
            <div
                className="min-h-screen flex flex-col safe-area-top safe-area-bottom relative overflow-hidden"
                style={{
                    // Premium Tet Gradient: Deep Red to Warm Orange/Gold
                    background: 'linear-gradient(135deg, #8B0000 0%, #B71C1C 50%, #E65100 100%)'
                }}
            >
                {/* Background Pattern - Subtle Circles */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#FFD700 2px, transparent 2px)', backgroundSize: '30px 30px' }}
                />

                {/* Header - Clean Premium Style */}
                <div className="flex items-center justify-between px-4 py-3 shrink-0 z-10 bg-black/10 backdrop-blur-sm border-b border-white/10">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full text-white/90 hover:bg-white/10 hover:text-white">
                            <Home size={24} />
                        </Button>
                    </Link>

                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-black text-[#FFD700] drop-shadow-md tracking-widest leading-none">
                            LÔ TÔ
                        </h1>
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Xuân Ất Tỵ</span>
                    </div>

                    <Button
                        onClick={() => setShowEndModal(true)}
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/90 hover:bg-red-600/20 hover:text-white"
                    >
                        <StopCircle size={24} />
                    </Button>
                </div>

                {/* Main Content Area - Centered Ticket + Controls */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto z-10 overflow-y-auto overflow-x-hidden pb-4 gap-4">

                    {/* Ticket Section */}
                    <div className="px-3 w-full shrink-0">
                        <div className="transform scale-[1.0] origin-center transition-transform duration-500">
                            <TicketBoard
                                matrix={matrix}
                                calledNumbers={calledNumbers}
                                lastCalledNumber={lastCalled}
                                themeColor={ticketThemeColor}
                            />
                        </div>
                    </div>

                    {/* Number Caller Section */}
                    <div className="w-full px-3 shrink-0">
                        <NumberCaller onNumberCalled={handleNumberCalled} lastCalledNumber={lastCalled} calledNumbers={calledNumbers} />
                    </div>
                </div>

                {/* ============ WIN MODAL (Shadcn Dialog) ============ */}
                <Dialog open={didWin} onOpenChange={setDidWin} >
                    <DialogContent className="border-4 border-[#FFD700] bg-gradient-to-br from-[#D32F2F] to-[#8B0000] text-center max-w-sm rounded-[32px] p-0 overflow-hidden shadow-2xl">
                        <div className="p-6 relative">
                            {/* Decorative Rays */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(255,215,0,0.1)_70%)] animate-pulse pointer-events-none" />

                            <div className="text-6xl mb-2 drop-shadow-xl animate-bounce">🎉</div>

                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black text-[#FFD700] uppercase tracking-wide mb-1 drop-shadow-sm text-center">
                                    KINH RỒI!
                                </DialogTitle>
                                <DialogDescription className="text-yellow-100/90 text-sm font-medium mb-6 uppercase tracking-widest text-center">
                                    Chúc mừng bạn đã thắng!
                                </DialogDescription>
                            </DialogHeader>

                            {/* Winning Row Display */}
                            {winningRow && (
                                <div className="mb-0 p-4 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <p className="text-white/60 text-xs uppercase font-bold mb-3">Dãy số trúng thưởng</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {winningRow.map((num, i) => num !== null && (
                                            <div key={i} className="relative w-12 h-12 flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-full border-4 border-[#FFD700] bg-white text-[#B71C1C] shadow-[0_0_15px_#FFD700]" />
                                                <span className="relative z-10 text-xl font-black text-[#B71C1C]">{num}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex flex-col gap-2 p-4 bg-black/20">
                            <Button
                                onClick={handleReuseSameTicket}
                                className="w-full py-6 rounded-2xl font-black text-base bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#8B0000] shadow-[0_0_20px_rgba(255,215,0,0.4)] border border-white/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" /> Chơi Lại Tờ Này
                            </Button>
                            <Button
                                onClick={handleNewTicket}
                                variant="outline"
                                className="w-full py-6 rounded-2xl font-bold text-base bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                            >
                                <Camera className="mr-2 h-5 w-5" /> Chụp Tờ Mới
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ============ END GAME MODAL (Shadcn Dialog) ============ */}
                <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
                    <DialogContent className="bg-[#FFF8E1] border-4 border-[#D32F2F] text-center max-w-xs rounded-[32px] p-6 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#B71C1C] uppercase text-center">Kết Thúc?</DialogTitle>
                            <DialogDescription className="text-[#B71C1C]/60 text-sm font-medium text-center">
                                Bạn có chắc muốn dừng ván này?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3 mt-4">
                            <Button
                                onClick={handleReuseSameTicket}
                                className="w-full py-6 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold shadow-[0_0_15px_rgba(211,47,47,0.4)] border border-white/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" /> Xóa Số & Chơi Lại
                            </Button>
                            <Button
                                onClick={handleNewTicket}
                                variant="outline"
                                className="w-full py-6 rounded-2xl border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white font-bold active:scale-95 transition-all"
                            >
                                <Camera className="mr-2 h-4 w-4" /> Chụp Vé Mới
                            </Button>
                            <Button
                                onClick={() => setShowEndModal(false)}
                                variant="ghost"
                                className="w-full rounded-2xl text-[#B71C1C]/50 hover:text-[#B71C1C]"
                            >
                                Hủy Bỏ
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col gap-6 safe-area-top safe-area-bottom">
            <div className="flex items-center justify-between">
                <Link href="/">
                    <Button variant="outline" size="icon" className="rounded-lg backdrop-blur-md">
                        <Home size={20} />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-yellow-300 drop-shadow-sm">
                    {matrix ? "Kiểm Tra Vé" : "Quét Vé Loto"}
                </h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-[#FFD700]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto relative">
                {/* Glow locations */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-[#FFD700]/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#D32F2F]/20 blur-[50px] rounded-full pointer-events-none" />

                {!matrix ? (
                    <>
                        <CameraCapture onImageCaptured={setImage} />
                        {image && (
                            <div className="mt-12 w-full flex justify-center">
                                <Button
                                    onClick={handleProcess}
                                    className="w-64 h-16 rounded-2xl font-black text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#8B0000] shadow-[0_0_20px_rgba(255,215,0,0.4)] border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Đang Xử Lý...' : 'Bắt Đầu Dò'}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <MatrixEditor
                        initialData={matrix}
                        onConfirm={handleConfirmMatrix}
                        onRetake={() => { setMatrix(null); setImage(null); }}
                    />
                )}

                {/* Debug Output */}
                {rawText && (
                    <div className="mt-4 p-4 bg-black/50 rounded-lg text-white font-mono text-xs w-full break-all">
                        <h3 className="text-yellow-400 font-bold mb-2">Kết quả OCR thô:</h3>
                        {rawText}
                    </div>
                )}
            </div>

            {/* ============ PROCESSING OVERLAY ============ */}
            {isProcessing && (
                <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center p-6 text-center"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, #B71C1C 0%, #5D0000 100%)'
                    }}
                >
                    <style>
                        {`
                        @keyframes scan {
                            0% { top: 0%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                        }
                        .animate-scan {
                            animation: scan 2s ease-in-out infinite;
                        }
                        `}
                    </style>

                    {/* Scanning Animation Container */}
                    <div className="relative w-64 h-64 border-4 border-[#FFD700]/30 rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(255,215,0,0.3)] bg-black/20 mb-10 backdrop-blur-sm">

                        {/* Fake Content for Effect */}
                        <div className="absolute inset-x-0 top-0 h-full p-6 flex flex-col gap-4 opacity-30">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 bg-white/20 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                            ))}
                        </div>

                        {/* Scan Line */}
                        <div className="absolute left-0 w-full h-1 bg-[#FFD700] shadow-[0_0_20px_#FFD700,0_0_40px_#FFD700] animate-scan" />
                    </div>

                    <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-3 animate-pulse drop-shadow-lg">
                        Đang Soi Vé...
                    </h2>
                    <p className="text-[#FFD700] text-xl font-medium tracking-wide">AI đang căng mắt đọc số 👀</p>
                    <p className="text-white/40 text-sm mt-12 animate-bounce">Vui lòng đợi một xíu...</p>
                </div>
            )}
        </div>
    );
}

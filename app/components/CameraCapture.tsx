import { ChangeEvent, useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface CameraCaptureProps {
    onImageCaptured: (file: File) => void;
}

export function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onImageCaptured(file);
        }
    };

    const triggerCamera = () => {
        fileInputRef.current?.click();
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <input
                type="file"
                accept="image/*"
                capture="environment" // Prefer rear camera on mobile
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {!preview ? (
                <div
                    className="w-full aspect-video border-2 border-dashed border-[#FFD700] rounded-2xl flex flex-col items-center justify-center gap-4 bg-[#B71C1C]/10 cursor-pointer active:bg-[#B71C1C]/20 transition-all shadow-[0_0_20px_rgba(183,28,28,0.1)]"
                    onClick={triggerCamera}
                >
                    <div className="bg-gradient-to-br from-[#FFD700] to-[#FF8F00] p-5 rounded-full shadow-lg animate-pulse">
                        <Camera className="w-8 h-8 text-[#8B0000]" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-[#FFD700] font-bold text-lg">
                            Chụp Ảnh Vé
                        </p>
                        <p className="text-yellow-200/60 text-sm">
                            Chụp rõ nét để AI đọc chính xác nhé
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#FFD700] shadow-2xl">
                    <Image
                        src={preview}
                        alt="Ticket Preview"
                        fill
                        className="object-contain bg-black/80"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 bg-red-600/80 backdrop-blur text-white p-2.5 rounded-full shadow-lg active:scale-90 transition-all border border-white/20 z-10"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="flex gap-4 w-full justify-center">
                <Button
                    onClick={triggerCamera}
                    className="w-64 h-16 rounded-2xl font-black text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#8B0000] shadow-[0_0_20px_rgba(255,215,0,0.4)] border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Camera size={24} />
                    {preview ? 'Chụp Lại' : 'Mở Camera'}
                </Button>
            </div>
        </div>
    );
}

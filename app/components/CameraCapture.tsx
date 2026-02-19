import { ChangeEvent, useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
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
        <div className="w-full flex flex-col items-center gap-5">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Preview or Placeholder */}
            {!preview ? (
                <button
                    className="w-full aspect-[3/4] max-h-[55vh] border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-5 bg-white cursor-pointer active:bg-gray-50 transition-all"
                    onClick={triggerCamera}
                >
                    <div className="bg-[#C62828] w-20 h-20 rounded-[24px] flex items-center justify-center shadow-[0_6px_20px_rgba(198,40,40,0.3)]">
                        <Camera className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center space-y-1.5 px-6">
                        <p className="text-gray-800 font-black text-xl tracking-wide">Chụp Ảnh Vé Loto</p>
                        <p className="text-gray-400 text-sm leading-snug">
                            Giữ vé thẳng · Đủ ánh sáng · Rõ nét<br/>để AI đọc số chính xác
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 px-4 py-2 rounded-full">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-gray-500 text-xs font-semibold">Hoặc chọn từ thư viện ảnh</span>
                    </div>
                </button>
            ) : (
                <div className="relative w-full aspect-[3/4] max-h-[55vh] rounded-3xl overflow-hidden border-2 border-gray-200 shadow-md">
                    <Image
                        src={preview}
                        alt="Ticket Preview"
                        fill
                        className="object-contain bg-gray-50"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 bg-white/80 text-gray-700 p-2.5 rounded-full shadow-md active:scale-90 transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/90 text-xs font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        Nhấn ✕ để chụp lại
                    </span>
                </div>
            )}

            {/* Action button */}
            <button
                onClick={triggerCamera}
                className="w-full h-14 rounded-2xl font-black text-lg bg-[#C62828] text-white shadow-[0_4px_16px_rgba(198,40,40,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
                <Camera size={22} />
                {preview ? 'Chụp Lại' : 'Mở Camera'}
            </button>
        </div>
    );
}

import Link from "next/link";
import { Button } from "./components/Button";
import { Camera, History, Ticket } from "lucide-react";

export default function Home() {
  return (
    <main className="screen-full flex flex-col items-center justify-center p-5 safe-area-top safe-area-bottom bg-[#F2F2F7]">
      <div className="flex flex-col items-center gap-7 w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C62828] rounded-[28px] shadow-[0_8px_24px_rgba(198,40,40,0.3)] mb-4">
            <Ticket size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-[#C62828] tracking-widest leading-none">
            LÔ TÔ
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1 tracking-wider">Dò vé tự động</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Link href="/game" className="w-full">
            <button className="w-full h-14 rounded-2xl bg-[#C62828] text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(198,40,40,0.35)] active:scale-95 transition-all">
              <Camera size={24} />
              Quét Vé & Chơi
            </button>
          </Link>

          <Link href="/history" className="w-full">
            <button className="w-full h-14 rounded-2xl bg-white text-[#C62828] font-bold text-lg flex items-center justify-center gap-3 border border-gray-200 shadow-sm active:scale-95 transition-all">
              <History size={24} />
              Lịch Sử Ván Đấu
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

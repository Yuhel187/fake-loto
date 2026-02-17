import Link from "next/link";
import { Button } from "./components/Button";
import { Camera, History, Ticket } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🌸</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-pulse">🏮</div>
        <div className="absolute top-1/3 right-5 text-4xl">💰</div>
        <div className="absolute bottom-1/3 left-5 text-5xl">🧧</div>
      </div>

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-md">
            LÔ TÔ TẾT
          </h1>
          <p className="text-white text-lg opacity-90">Xuân 2026 - Phát Tài Phát Lộc</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Link href="/game" className="w-full">
            <Button variant="primary" size="lg" className="w-full gap-3">
              <Ticket size={28} />
              Chơi Mới
            </Button>
          </Link>

          <Link href="/history" className="w-full">
            <Button variant="secondary" size="lg" className="w-full gap-3">
              <History size={28} />
              Lịch Sử
            </Button>
          </Link>
        </div>

        <div className="text-white/60 text-sm absolute bottom-4">
          Chúc Mừng Năm Mới
        </div>
      </div>
    </main>
  );
}

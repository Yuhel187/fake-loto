'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, MessageCircle, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getChatWidgetConfig, saveChatWidgetConfig, ChatWidgetConfig } from '@/lib/storage';

const DEFAULT_SCRIPT_URL = 'http://localhost:3000/lava-widget.js';

export default function SettingsPage() {
    const [scriptUrl, setScriptUrl] = useState('');
    const [siteKey, setSiteKey] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const config = getChatWidgetConfig();
        setScriptUrl(config.scriptUrl);
        setSiteKey(config.siteKey);
        setEnabled(config.enabled);
    }, []);

    const handleSave = () => {
        const config: ChatWidgetConfig = { scriptUrl: scriptUrl.trim(), siteKey: siteKey.trim(), enabled };
        saveChatWidgetConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Reload so the widget script is (un)mounted with the new config.
        window.location.reload();
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
                <h1 className="text-base font-black text-gray-800 tracking-wide">Chat Widget</h1>
                <div className="w-10" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <div className="flex flex-col items-center gap-2 py-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#C62828]/10 flex items-center justify-center">
                            <MessageCircle size={26} className="text-[#C62828]" />
                        </div>
                        <p className="text-gray-400 text-sm text-center">
                            Nhập thông tin widget chat (script &amp; site key) để nhúng vào ứng dụng.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wide">
                                Script URL
                            </label>
                            <Input
                                value={scriptUrl}
                                onChange={(e) => setScriptUrl(e.target.value)}
                                placeholder={DEFAULT_SCRIPT_URL}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wide">
                                Site Key
                            </label>
                            <Input
                                value={siteKey}
                                onChange={(e) => setSiteKey(e.target.value)}
                                placeholder="wf_site_live_xxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>

                        <label className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                            <span className="text-sm font-medium text-gray-700">Bật widget chat</span>
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                className="w-5 h-5 accent-[#C62828]"
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full h-12 rounded-2xl bg-[#C62828] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(198,40,40,0.35)] active:scale-95 transition-all"
                    >
                        <Save size={18} />
                        {saved ? 'Đã lưu!' : 'Lưu cài đặt'}
                    </button>

                    <p className="text-xs text-gray-400 text-center leading-relaxed px-2">
                        Tương đương với đoạn mã:<br />
                        <code className="text-[11px] break-all">
                            &lt;script src=&quot;{scriptUrl || DEFAULT_SCRIPT_URL}&quot; async&gt;&lt;/script&gt;<br />
                            &lt;lava-chat-widget site-key=&quot;{siteKey || '...'}&quot;&gt;&lt;/lava-chat-widget&gt;
                        </code>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getChatWidgetConfig, ChatWidgetConfig } from '@/lib/storage';

// Reads the widget config saved on the Settings page and injects the chat widget script + tag.
export default function ChatWidget() {
    const [config, setConfig] = useState<ChatWidgetConfig | null>(null);

    useEffect(() => {
        setConfig(getChatWidgetConfig());
    }, []);

    if (!config?.enabled || !config.scriptUrl || !config.siteKey) return null;

    return (
        <>
            <Script src={config.scriptUrl} strategy="afterInteractive" async />
            <lava-chat-widget site-key={config.siteKey} />
        </>
    );
}

export interface GameRecord {
    id: string;
    date: string;
    matrix: (number | null)[][];
    result: 'won' | 'abandoned';
}

const STORAGE_KEY = 'loto_history';

export function saveGame(record: Omit<GameRecord, 'id' | 'date'>) {
    try {
        const history = getHistory();
        const newRecord: GameRecord = {
            ...record,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newRecord, ...history]));
    } catch (error) {
        console.error("Failed to save history", error);
    }
}

export function getHistory(): GameRecord[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
}

export interface ChatWidgetConfig {
    scriptUrl: string;
    siteKey: string;
    enabled: boolean;
}

const CHAT_WIDGET_KEY = 'chat_widget_config';

const DEFAULT_CHAT_WIDGET_CONFIG: ChatWidgetConfig = {
    scriptUrl: '',
    siteKey: '',
    enabled: false,
};

export function getChatWidgetConfig(): ChatWidgetConfig {
    if (typeof window === 'undefined') return DEFAULT_CHAT_WIDGET_CONFIG;
    try {
        const raw = localStorage.getItem(CHAT_WIDGET_KEY);
        return raw ? { ...DEFAULT_CHAT_WIDGET_CONFIG, ...JSON.parse(raw) } : DEFAULT_CHAT_WIDGET_CONFIG;
    } catch {
        return DEFAULT_CHAT_WIDGET_CONFIG;
    }
}

export function saveChatWidgetConfig(config: ChatWidgetConfig) {
    try {
        localStorage.setItem(CHAT_WIDGET_KEY, JSON.stringify(config));
    } catch (error) {
        console.error("Failed to save chat widget config", error);
    }
}

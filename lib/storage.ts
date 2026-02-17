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

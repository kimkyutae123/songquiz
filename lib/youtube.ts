import { ListenMode } from '@/types';

export const LISTEN_MODE_DURATION: Record<ListenMode, number | null> = {
    '5sec': 5,
    '30sec': 30,
    'full': null,
};

export const shuffleArray = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};
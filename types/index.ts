// 장르 타입
export type Genre = 'kpop' | 'pop' | 'jpop' | 'random';

// 듣기 시간 타입
export type ListenMode = '5sec' | '30sec' | 'full';

// 노래 수 타입
export type SongCount = 10 | 30 | 50;

// 테마 타입
export type Theme = 'bright' | 'neon' | 'cafe';

// 게임 설정 타입
export interface GameSettings {
    genre: Genre;
    listenMode: ListenMode;
    songCount: SongCount;
    theme: Theme;
}

// 노래 타입 (게임에서 사용)
export interface Song {
    id: string;
    title: string;
    artist: string;
    youtubeId: string;
    genre: Genre;
}

// Firebase에 저장되는 노래 타입
export interface FirebaseSong {
    id: string;
    title: string;
    artist: string;
    youtubeId: string;
    genre: Genre;
    createdAt: number;
    startTime: number;  // 시작 시간 (초)
    answers: string[];  // 추가 정답 목록

}

// 게임 상태 타입
export interface GameState {
    currentIndex: number;
    score: number;
    songs: Song[];
    isAnswered: boolean;
    isBlurred: boolean;
}

// 결과 타입
export interface GameResult {
    playerName: string;
    score: number;
    totalSongs: number;
    settings: GameSettings;
}





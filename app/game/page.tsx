'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Song, GameState, Genre, ListenMode, FirebaseSong } from '@/types';
import { LISTEN_MODE_DURATION, shuffleArray } from '@/lib/youtube';
import { getSongsByGenre } from '@/lib/firebase';

function GamePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const genre = searchParams.get('genre') as Genre;
    const listenMode = searchParams.get('listenMode') as ListenMode;
    const songCount = searchParams.get('songCount');

    const [iframeKey, setIframeKey] = useState(0);
    const [gameState, setGameState] = useState<GameState>({
        currentIndex: 0,
        score: 0,
        songs: [],
        isAnswered: false,
        isBlurred: true,
    });

    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const loadSongs = async () => {
            console.log('Firebase 프로젝트 ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
            console.log('장르:', genre, '카운트:', songCount);
            const count = Number(songCount);
            const allSongs = await getSongsByGenre(genre);
            console.log('가져온 노래 수:', allSongs.length);
            const shuffled = shuffleArray(allSongs);
            const songs = shuffled.slice(0, count);
            setGameState(prev => ({ ...prev, songs }));
            setIsLoading(false);
        };
        loadSongs();
    }, []);

    const currentSong: Song | undefined = gameState.songs[gameState.currentIndex];
    const duration = LISTEN_MODE_DURATION[listenMode];
    const startTime = (currentSong as FirebaseSong)?.startTime ?? 0;

    const iframeSrc = useMemo(() => {
        if (!currentSong) return null;
        const endTime = duration !== null ? `&end=${startTime + duration}` : '';
        return `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&controls=1&start=${startTime}${endTime}`;
    }, [iframeKey, currentSong?.youtubeId]);

    const handleSubmit = () => {
        if (!currentSong || gameState.isAnswered) return;

        const userAnswer = answer.trim().toLowerCase();
        if (userAnswer === '') return;

        const correctAnswer = currentSong.title.trim().toLowerCase();
        const extraAnswers = ((currentSong as FirebaseSong).answers ?? [])
            .map(a => a.toLowerCase());

        const allAnswers = [correctAnswer, ...extraAnswers];
        const correct = allAnswers.some(ans => ans === userAnswer);

        setIsPlaying(false);
        setIsCorrect(correct);
        setGameState(prev => ({
            ...prev,
            isAnswered: true,
            isBlurred: !correct,
            score: correct ? prev.score + 100 : prev.score,
        }));

        if (correct) {
            setTimeout(() => {
                setIsPlaying(true);
                setIframeKey(prev => prev + 1);
            }, 500);
        }
    };

    const handleNext = () => {
        const isLastSong = gameState.currentIndex === gameState.songs.length - 1;

        if (isLastSong) {
            router.push(`/result?score=${gameState.score}&total=${gameState.songs.length}`);
            return;
        }

        setGameState(prev => ({
            ...prev,
            currentIndex: prev.currentIndex + 1,
            isAnswered: false,
            isBlurred: true,
        }));
        setAnswer('');
        setIsCorrect(null);
        setIsPlaying(true);

        setTimeout(() => {
            setIframeKey(prev => prev + 1);
        }, 100);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center">
                <p className="text-2xl font-bold text-pink-400 animate-pulse">🎵 노래 불러오는 중...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-xl flex justify-between items-center mb-6">
                <span className="font-bold text-gray-600">
                    {gameState.currentIndex + 1} / {gameState.songs.length}
                </span>
                <span className="font-black text-pink-500 text-xl">
                    🏆 {gameState.score}점
                </span>
            </div>

            <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl mb-6">
                <div className={`transition-all duration-700 ${gameState.isBlurred ? 'blur-2xl scale-110' : 'blur-0'}`}>
                    {isPlaying && iframeSrc ? (
                        <iframe
                            key={iframeKey}
                            width="100%"
                            height="315"
                            src={iframeSrc}
                            allow="autoplay"
                        />
                    ) : (
                        <div className="w-full h-[315px] bg-black flex items-center justify-center">
                            <p className="text-white text-lg font-bold">⏸ 재생 종료</p>
                        </div>
                    )}
                </div>

                {gameState.isBlurred && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white text-2xl font-black drop-shadow-lg">🎵 이 노래는?</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-xl">
                {!gameState.isAnswered ? (
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="노래 제목을 입력하세요"
                            className="flex-1 border-2 border-pink-200 rounded-xl px-4 py-3 outline-none focus:border-pink-400 transition-all"
                        />
                        <button
                            onClick={handleSubmit}
                            className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                        >
                            확인
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className={`text-2xl font-black ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                            {isCorrect ? '🎉 정답!' : '😢 오답!'}
                        </p>
                        <p className="text-gray-500">
                            정답: <span className="font-bold text-gray-700">{currentSong?.artist} - {currentSong?.title}</span>
                        </p>
                        <button
                            onClick={handleNext}
                            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-black rounded-xl transition-all"
                        >
                            {gameState.currentIndex === gameState.songs.length - 1 ? '결과 보기 🏆' : '다음 노래 ➡️'}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function GamePageWrapper() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center">
                <p className="text-2xl font-bold text-pink-400 animate-pulse">🎵 로딩 중...</p>
            </main>
        }>
            <GamePage />
        </Suspense>
    );
}
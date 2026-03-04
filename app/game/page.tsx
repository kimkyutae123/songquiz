'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Song, GameState, Genre, ListenMode, FirebaseSong } from '@/types';
import { LISTEN_MODE_DURATION, shuffleArray } from '@/lib/youtube';
import { getSongsByGenre } from '@/lib/firebase';

export default function GamePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const genre = searchParams.get('genre') as Genre;
    const listenMode = searchParams.get('listenMode') as ListenMode;
    const songCount = searchParams.get('songCount');

    const timerRef = useRef<NodeJS.Timeout | null>(null);
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
            const count = Number(songCount);
            const allSongs = await getSongsByGenre(genre);
            const shuffled = shuffleArray(allSongs);
            const songs = shuffled.slice(0, count);
            setGameState(prev => ({ ...prev, songs }));
            setIsLoading(false);
        };
        loadSongs();
    }, []);

    // 노래 바뀔 때 타이머 설정
    useEffect(() => {
        if (isLoading || gameState.songs.length === 0) return;
        if (gameState.isAnswered) return;

        const duration = LISTEN_MODE_DURATION[listenMode];


        if (duration !== null) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsPlaying(false);
            }, duration * 1000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [gameState.currentIndex, isLoading]);

    const currentSong: Song | undefined = gameState.songs[gameState.currentIndex];
    const duration = LISTEN_MODE_DURATION[listenMode];
    const startTime = (currentSong as FirebaseSong)?.startTime ?? 0;

    // iframe src 생성
    const getIframeSrc = (playing: boolean) => {
        if (!currentSong) return '';
        if (!playing) return '';  // 재생 멈추면 빈 src
        return `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&controls=0&start=${startTime}`;
    };

    const handleSubmit = () => {
        if (!currentSong || gameState.isAnswered) return;

        const userAnswer = answer.trim().toLowerCase();
        if (userAnswer === '') return;

        const correctAnswer = currentSong.title.trim().toLowerCase();
        const extraAnswers = ((currentSong as FirebaseSong).answers ?? [])
            .map(a => a.toLowerCase());

        // 정답 또는 추가 정답 중 하나라도 일치하면 정답
        const allAnswers = [correctAnswer, ...extraAnswers];
        const correct = allAnswers.some(ans =>
            ans === userAnswer ||
            ans.includes(userAnswer) ||
            userAnswer.includes(ans)
        );

        if (timerRef.current) clearTimeout(timerRef.current);
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
            }, 300);
        }
    };

    const handleNext = () => {
        const isLastSong = gameState.currentIndex === gameState.songs.length - 1;

        if (timerRef.current) clearTimeout(timerRef.current);

        if (isLastSong) {
            router.push(`/result?score=${gameState.score}&total=${gameState.songs.length}`);
            return;
        }

        setIsPlaying(true);
        setIframeKey(prev => prev + 1);
        setAnswer('');
        setIsCorrect(null);
        setGameState(prev => ({
            ...prev,
            currentIndex: prev.currentIndex + 1,
            isAnswered: false,
            isBlurred: true,
        }));
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
                    {isPlaying ? (
                        <iframe
                            key={iframeKey}
                            width="100%"
                            height="315"
                            src={getIframeSrc(isPlaying)}
                            allow="autoplay"
                        />
                    ) : (
                        // 멈췄을 때 썸네일 보여주기
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
                            정답: <span className="font-bold text-gray-700">{currentSong?.title}</span>
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
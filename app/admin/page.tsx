'use client';

import { useState } from 'react';
import { addSong } from '@/lib/firebase';
import { Genre } from '@/types';

interface YoutubeVideoInfo {
    title: string;
    artist: string;
    youtubeId: string;
    startTime: number;
    answers: string;  // 쉼표로 구분

}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
};

const fetchVideoInfo = async (youtubeId: string): Promise<YoutubeVideoInfo | null> => {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) return null;

    const snippet = data.items[0].snippet;
    return {
        title: snippet.title,
        artist: snippet.channelTitle,
        youtubeId,
        startTime: 0,
        answers: '',

    };
};

export default function AdminPage() {
    const [url, setUrl] = useState('');
    const [genre, setGenre] = useState<Genre>('kpop');
    const [preview, setPreview] = useState<YoutubeVideoInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUrlChange = async (value: string) => {
        setUrl(value);
        setPreview(null);
        setMessage('');

        const youtubeId = extractYoutubeId(value);
        if (!youtubeId) return;

        setIsLoading(true);
        const info = await fetchVideoInfo(youtubeId);
        setPreview(info);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!preview) return;

        setIsLoading(true);
        await addSong({
            title: preview.title,
            artist: preview.artist,
            youtubeId: preview.youtubeId,
            genre,
            startTime: preview.startTime,
            answers: preview.answers.split(',').map(a => a.trim()).filter(Boolean),

        });

        setMessage('✅ 저장됐어요!');
        setUrl('');
        setPreview(null);
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-black text-gray-800 mb-8">🎵 노래 관리자</h1>

                <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">

                    {/* URL 입력 */}
                    <div>
                        <label className="font-bold text-gray-700 mb-2 block">유튜브 URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-400 transition-all"
                        />
                    </div>

                    {isLoading && (
                        <p className="text-pink-400 font-semibold animate-pulse">불러오는 중...</p>
                    )}

                    {preview && (
                        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                            <p className="text-sm text-gray-500">미리보기</p>

                            {/* 시작 시간 적용된 영상 미리보기 */}
                            <iframe
                                width="100%"
                                height="200"
                                src={`https://www.youtube.com/embed/${preview.youtubeId}?start=${preview.startTime}`}
                                className="rounded-xl"
                            />

                            {/* 제목 */}
                            <div>
                                <label className="text-sm font-bold text-gray-600">제목</label>
                                <input
                                    type="text"
                                    value={preview.title}
                                    onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-pink-400"
                                />
                            </div>

                            {/* 가수 */}
                            <div>
                                <label className="text-sm font-bold text-gray-600">가수</label>
                                <input
                                    type="text"
                                    value={preview.artist}
                                    onChange={(e) => setPreview({ ...preview, artist: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-pink-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600">
                                    추가 정답 (쉼표로 구분)
                                </label>
                                <input
                                    type="text"
                                    value={preview.answers}
                                    onChange={(e) => setPreview({ ...preview, answers: e.target.value })}
                                    placeholder="다이너마이트, dynamite bts"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-pink-400"
                                />
                            </div>
                            {/* 시작 시간 */}
                            <div>
                                <label className="text-sm font-bold text-gray-600">
                                    시작 시간 (초) — 인트로 건너뛰기
                                </label>
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="number"
                                        min={0}
                                        value={preview.startTime}
                                        onChange={(e) => setPreview({ ...preview, startTime: Number(e.target.value) })}
                                        className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400"
                                    />
                                    <span className="text-sm text-gray-400">초부터 시작</span>
                                    {/* 빠른 선택 버튼 */}
                                    {[0, 15, 30, 45, 60].map((sec) => (
                                        <button
                                            key={sec}
                                            onClick={() => setPreview({ ...preview, startTime: sec })}
                                            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                                preview.startTime === sec
                                                    ? 'bg-pink-400 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                                            }`}
                                        >
                                            {sec}초
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 장르 선택 */}
                    <div>
                        <label className="font-bold text-gray-700 mb-2 block">장르</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['kpop', 'pop', 'jpop', 'random'] as Genre[]).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGenre(g)}
                                    className={`py-2 rounded-xl font-semibold text-sm transition-all ${
                                        genre === g
                                            ? 'bg-pink-400 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                                    }`}
                                >
                                    {g === 'kpop' ? 'K-POP' : g === 'pop' ? 'POP' : g === 'jpop' ? 'J-POP' : 'RANDOM'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!preview || isLoading}
                        className="w-full py-3 bg-pink-400 hover:bg-pink-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black rounded-xl transition-all"
                    >
                        저장하기
                    </button>

                    {message && (
                        <p className="text-center font-bold text-green-500">{message}</p>
                    )}
                </div>
            </div>
        </main>
    );
}
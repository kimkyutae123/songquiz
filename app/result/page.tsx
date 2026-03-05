'use client';
export const dynamic = 'force-dynamic';  // ← 이거 추가

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const score = searchParams.get('score');
    const total = searchParams.get('total');

    return (
        <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-xl flex flex-col items-center gap-6">
                <h1 className="text-4xl font-black text-pink-500">🏆 결과</h1>
                <p className="text-2xl font-bold text-gray-700">
                    {total}문제 중 <span className="text-pink-500">{Number(score) / 100}개</span> 정답!
                </p>
                <p className="text-4xl font-black text-gray-800">{score}점</p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-black rounded-xl transition-all"
                >
                    다시 하기 🎵
                </button>
            </div>
        </main>
    );
}

export default function ResultPageWrapper() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center">
                <p className="text-2xl font-bold text-pink-400 animate-pulse">🎵 로딩 중...</p>
            </main>
        }>
            <ResultPage />
        </Suspense>
    );
}
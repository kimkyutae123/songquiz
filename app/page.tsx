'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSettings, Genre, ListenMode, SongCount, Theme } from '@/types';

export default function Home() {
  const router = useRouter();

  // 게임 설정 상태
  const [settings, setSettings] = useState<GameSettings>({
    genre: 'kpop',
    listenMode: '30sec',
    songCount: 10,
    theme: 'bright',
  });

  // 게임 시작 버튼 클릭
  const handleStart = () => {
    // 설정값을 URL 파라미터로 game 페이지에 넘겨요
    router.push(
        `/game?genre=${settings.genre}&listenMode=${settings.listenMode}&songCount=${settings.songCount}&theme=${settings.theme}`
    );
  };

  return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex flex-col items-center justify-center p-8">

        {/* 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-pink-500 mb-2">🎵 Song Quiz</h1>
          <p className="text-gray-500 text-lg">노래를 듣고 제목을 맞춰보세요!</p>
        </div>

        {/* 설정 카드 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6">

          {/* 장르 선택 */}
          <div>
            <label className="font-bold text-gray-700 mb-2 block">🎸 장르</label>
            <div className="grid grid-cols-2 gap-2">
              {(['kpop', 'pop', 'jpop', 'random'] as Genre[]).map((genre) => (
                  <button
                      key={genre}
                      onClick={() => setSettings({ ...settings, genre })}
                      className={`py-2 rounded-xl font-semibold transition-all ${
                          settings.genre === genre
                              ? 'bg-pink-400 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                      }`}
                  >
                    {genre === 'kpop' ? 'K-POP' : genre === 'pop' ? 'POP' : genre === 'jpop' ? 'J-POP' : 'RANDOM'}
                  </button>
              ))}
            </div>
          </div>
          {/* 듣기 모드 선택*/}
          <div>
            <label className="font-bold text-gray-700 mb-2 block">⏱️ 듣기 모드</label>
            <div className="grid grid-cols-3 gap-2">
              {(['5sec', '30sec', 'full'] as ListenMode[]).map((mode) => (
                  <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, listenMode: mode })}
                      className={`py-2 rounded-xl font-semibold transition-all ${
                          settings.listenMode === mode
                              ? 'bg-pink-400 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                      }`}
                  >
                    {mode === '5sec' ? '5초' : mode === '30sec' ? '30초' : '전체'}
                  </button>
              ))}
            </div>
          </div>

          {/* 노래 수 선택 */}
          <div>
            <label className="font-bold text-gray-700 mb-2 block">🎵 노래 수</label>
            <div className="grid grid-cols-3 gap-2">
              {([10, 30, 50] as SongCount[]).map((count) => (
                  <button
                      key={count}
                      onClick={() => setSettings({ ...settings, songCount: count })}
                      className={`py-2 rounded-xl font-semibold transition-all ${
                          settings.songCount === count
                              ? 'bg-pink-400 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                      }`}
                  >
                    {count}
                  </button>
              ))}
            </div>
          </div>



          {/* 게임 시작 버튼 */}
          <button
              onClick={handleStart}
              className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white text-xl font-black rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            🎮 게임 시작!
          </button>
        </div>
      </main>
  );
}
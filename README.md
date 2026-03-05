# 🎵 Song Quiz

> 유튜브 영상을 블러 처리한 채로 음악을 듣고, 노래 제목을 맞추는 웹 게임입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

---

## 📖 프로젝트 소개

Song Quiz는 유튜브 뮤직비디오를 블러 처리한 상태로 재생하고, 노래 제목을 맞추는 퀴즈 게임입니다.  
정답을 맞추면 블러가 걷히며 뮤직비디오가 공개되는 방식으로, 혼자서도 친구들과 함께도 즐길 수 있습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 데이터베이스 | Firebase Firestore |
| 영상 API | YouTube Data API v3 |
| 호스팅 | Vercel |
| 패키지 매니저 | npm |
| 개발 도구 | IntelliJ IDEA |

---

## 🎮 주요 기능

### 게임 플레이
- 🎵 유튜브 뮤직비디오를 **블러 처리**한 채로 음악 재생
- ✅ 정답 입력 시 블러가 걷히며 **뮤직비디오 공개**
- 🔀 매 게임마다 **랜덤 순서**로 노래 출제
- 🏆 라운드별 점수 누적 및 최종 결과 화면 제공
- ✕ 게임 중 언제든 **로비로 나가기** 가능

### 게임 설정
- 🎸 **장르 선택**: K-POP / POP / J-POP / RANDOM
- ⏱️ **듣기 모드**: 5초 / 30초 / 전체 듣기
- 🎵 **노래 수**: 10곡 / 30곡 / 50곡
- 🎨 **테마**: 밝음 / 네온 / 카페

### 정답 처리
- 대소문자 구분 없음
- 띄어쓰기 무시
- 특수문자 무시 (`Magnetic'` → `magnetic` 으로 처리)
- 한국어 자음/모음 입력 허용
- 한국어 / 영어 복수 정답 지원

### 관리자 기능 (`/admin`)
- 유튜브 URL 입력 시 제목 / 가수 자동 불러오기
- 노래 시작 시간 설정 (인트로 스킵)
- 한국어 제목 + 영어 추가 정답 등록
- Firebase Firestore에 즉시 저장

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 홈 (게임 설정 화면)
│   ├── game/
│   │   └── page.tsx      # 게임 화면
│   ├── result/
│   │   └── page.tsx      # 결과 화면
│   └── admin/
│       └── page.tsx      # 노래 관리자 페이지
├── lib/
│   ├── youtube.ts        # YouTube 관련 유틸 함수
│   └── firebase.ts       # Firebase 연동 함수
└── types/
    └── index.ts          # TypeScript 타입 정의
```

---

## 🚀 시작하기




브라우저에서 [https://songquiz.vercel.app/](https://songquiz.vercel.app/) 접속

---

## 🗄️ Firebase Firestore 구조

```
songs/
  └── {auto_id}
        ├── title: string         # 노래 제목 (한국어)
        ├── artist: string        # 가수명
        ├── youtubeId: string     # YouTube 영상 ID
        ├── genre: string         # kpop | pop | jpop | random
        ├── startTime: number     # 영상 시작 시간 (초)
        ├── answers: string[]     # 추가 정답 목록 (영어 등)
        └── createdAt: number     # 등록 타임스탬프
```

---

## 📝 노래 추가 방법

1. `/admin` 페이지 접속
2. 유튜브 뮤직비디오 URL 붙여넣기
3. 제목을 **한국어**로 수정
4. 추가 정답에 **영어 제목** 입력 (쉼표로 구분)
5. 인트로 스킵할 시작 시간 설정
6. 장르 선택 후 저장

---

## 🐛 트러블슈팅

### YouTube IFrame API → 일반 iframe 방식으로 교체
YouTube IFrame API 사용 시 `postMessage` 오류가 반복 발생하여 플레이어 제어가 불가능했음.  
`YT.Player` 를 완전히 제거하고 일반 `<iframe>` 태그로 교체하여 해결.

### iframe 영상이 3초만에 끊기는 문제
정답 입력창에 글자를 입력할 때마다 컴포넌트가 리렌더링되면서 iframe src가 재계산되어 영상이 초기화되는 문제.  
`useMemo` 로 src를 고정하여 `iframeKey` 가 바뀔 때만 재계산되도록 수정.

```typescript
const iframeSrc = useMemo(() => {
    if (!currentSong) return null;
    return `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&start=${startTime}`;
}, [iframeKey, currentSong?.youtubeId]);
```

### YouTube `end` 파라미터 불안정 문제
URL에 `&end=35` 파라미터를 넣어도 광고가 붙은 일부 영상에서 무시되는 문제.  
`end` 파라미터를 제거하고 `setTimeout` 방식으로 교체.

### React 개발 모드 useEffect 두 번 실행 문제
React 개발 모드에서 `useEffect` 가 의도적으로 두 번 실행되면서 타이머가 취소되는 문제.  
`useRef` 로 타이머 시작 여부를 추적하여 중복 실행 방지.

```typescript
const isTimerStarted = useRef(false);

useEffect(() => {
    if (isTimerStarted.current) return;
    isTimerStarted.current = true;
    timerRef.current = setTimeout(() => setIsPlaying(false), duration * 1000);
}, [currentSong?.youtubeId]);
```

### Next.js 빌드 오류 (useSearchParams Suspense)
Vercel 배포 시 `useSearchParams() should be wrapped in a suspense boundary` 오류 발생.  
컴포넌트를 분리하고 `Suspense` 로 감싸서 해결.

```typescript
export default function GamePageWrapper() {
    return (
        <Suspense fallback={...}>
            <GamePage />
        </Suspense>
    );
}
```

### 정답 비교 로직 오류
`includes` 방식으로 비교하면 짧은 단어 입력만으로 정답 처리되는 문제.  
완전 일치 방식으로 변경 후 특수문자 / 대소문자 / 띄어쓰기를 제거한 뒤 비교.

```typescript
const clean = (str: string) => str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣぁ-んァ-ン]/g, '')
    .replace(/\s/g, '');

const correct = allAnswers.some(ans => clean(ans) === clean(userAnswer));
```

---

## 🌐 배포

Vercel을 통해 배포합니다.



## 📄 라이선스

MIT License

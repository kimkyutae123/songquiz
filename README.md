<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# 🎵 Song Quiz

> 유튜브 영상을 블러 처리한 채로 음악을 듣고, 노래 제목을 맞추는 웹 게임입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📖 프로젝트 소개

Song Quiz는 유튜브 뮤직비디오를 블러 처리한 상태로 재생하고, 노래 제목을 맞추는 퀴즈 게임입니다.  
정답을 맞추면 블러가 걷히며 뮤직비디오가 공개되는 방식으로, 혼자서도, 친구들과 함께 파티 모드로도 즐길 수 있습니다.

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

### 게임 설정
- 🎸 **장르 선택**: K-POP / POP / J-POP / RANDOM
- ⏱️ **듣기 모드**: 5초 / 30초 / 전체 듣기
- 🎵 **노래 수**: 10곡 / 30곡 / 50곡
- 🎨 **테마**: 밝음 / 네온 / 카페

### 정답 처리
- 대소문자 구분 없음
- 띄어쓰기 무시
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
├── components/
│   ├── ui/               # 공통 UI 컴포넌트
│   └── game/             # 게임 전용 컴포넌트
├── lib/
│   ├── youtube.ts        # YouTube 관련 유틸 함수
│   └── firebase.ts       # Firebase 연동 함수
├── types/
│   └── index.ts          # TypeScript 타입 정의
└── data/
    └── songs.ts          # 노래 데이터
```

---

## 🚀 시작하기

### 필수 조건
- Node.js 18 이상
- npm
- Firebase 프로젝트
- YouTube Data API v3 키


### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) (추후 변경 예정)접속

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

## 🌐 배포

Vercel을 통해 배포합니다.

---

## 📄 라이선스

MIT License
>>>>>>> 5d42b12c62917e8739e7e0af7353df61c7500655

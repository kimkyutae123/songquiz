

---

**🎵 Song Quiz 프로젝트 시작 및 기획**
- 노래 맞추기 게임 컨셉 확정 (블러 처리 → 음악 재생 → 정답 맞추면 뮤비 공개)
- 솔로/파티 모드 동일 구조, 글로벌 랭킹 없이 심플하게 확정
- 기술 스택 확정: Next.js + TypeScript + Firebase + YouTube API + Vercel

**⚙️ 프로젝트 세팅**
- `create-next-app` 으로 프로젝트 생성
- 폴더 구조 설정 (`app`, `components`, `lib`, `types`, `data`)
- YouTube Data API v3 키 발급 및 `.env.local` 설정

**📝 타입 정의 (`types/index.ts`)**
- `Genre`, `ListenMode`, `SongCount`, `Theme`, `GameSettings`, `Song`, `FirebaseSong`, `GameState`, `GameResult`, `YTPlayer`, `YTEvent`, `YTWindow` 타입 정의

**🎮 게임 화면 구현**
- 메인 홈 페이지 (장르 / 듣기모드 / 노래수 / 테마 설정)
- 게임 화면 (블러 처리 영상 + 정답 입력)
- 듣기 모드 5초 / 30초 / 전체 구현 (`setTimeout` 방식)
- 정답 비교 로직 (대소문자 무시, 띄어쓰기 무시, 추가 정답 지원)

**🔥 Firebase 연동**
- Firebase 프로젝트 생성 및 Firestore 활성화
- `firebase.ts` 에 `addSong`, `getSongsByGenre` 함수 구현
- YouTube API → Firebase DB 방식으로 전환

**🛠 관리자 페이지 (`/admin`)**
- 유튜브 URL 입력 시 제목/가수 자동 불러오기
- 시작 시간 설정 (인트로 스킵, 0/15/30/45/60초 빠른 선택)
- 한국어 제목 + 영어 추가 정답 등록 기능
- Firebase에 즉시 저장

**🐛 해결한 버그들**
- `listenMode` URL 파라미터 null 문제 수정
- 빈 문자열 입력 시 정답 처리되는 버그 수정
- `useEffect` 중복 실행으로 인한 타이머 취소 문제 수정
- YouTube IFrame API → 일반 `iframe` 방식으로 교체 (`postMessage` 오류 해결)
- `any` 타입 제거 및 타입 정의로 교체

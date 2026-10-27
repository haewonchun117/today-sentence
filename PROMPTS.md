# 개발 순서 + Claude Code 프롬프트

## 0단계. 준비 (사람이 직접)
1. GitHub에 저장소 만들기 → 두 사람 모두 collaborator로 추가
2. VS Code에 Claude Code 확장 설치
3. 저장소를 clone한 폴더에 이 키트의 파일 넣기
   - `CLAUDE.md` → 프로젝트 루트
   - `supabase/schema.sql` → 그대로
   - 데모 HTML → `design/today-sentence.html`
4. Supabase 프로젝트 생성 → SQL Editor에서 `schema.sql` 실행 → Table Editor에서 데이터 들어갔는지 확인
5. Supabase > Project Settings > API에서 Project URL, service_role key 복사

## 1단계. 프로젝트 생성
> CLAUDE.md를 읽고, 현재 폴더에 Next.js(App Router) + TypeScript + Tailwind 프로젝트를 만들어 줘. 기존 파일(CLAUDE.md, supabase/, design/)은 그대로 둬. `@supabase/supabase-js`를 설치하고 `.env.local.example`에 필요한 환경 변수 이름을 적어 줘.

→ `.env.local`을 직접 만들어 키를 넣고 `npm run dev`로 확인.

## 2단계. API
> CLAUDE.md의 API 표대로 서버용 Supabase 클라이언트(lib/supabase-server.ts)와 API Routes 6개를 만들어 줘. 오늘의 문장은 Asia/Seoul 기준 날짜로 정해. 입력 검증도 넣어 줘. 다 만들면 각 API를 curl로 호출하는 테스트 명령도 알려 줘.

## 3단계. 홈 화면
> design/today-sentence.html의 디자인을 Tailwind로 옮겨서 공통 레이아웃(헤더, 날짜, 상단 메뉴, 언덕과 토끼)과 홈 화면을 만들어 줘. 오늘의 문장은 /api/sentences/today, 뽑기 버튼은 /api/sentences/random을 써.

## 4단계. 카테고리 화면
> /category 페이지를 만들어 줘. 카테고리 버튼을 누르면 해당 카테고리 랜덤 문장을 보여 주고, [다른 문장 뽑기]는 방금 문장을 제외하고 다시 뽑아.

## 5단계. 저장 기능
> deviceId(localStorage) 훅을 만들고, 홈·카테고리의 [저장하기] 버튼과 /saved 페이지를 구현해 줘. 저장/취소 시 토스트를 띄우고, 메뉴의 '저장한 문장' 옆에 개수를 보여 줘. 저장 목록이 비었을 때 화면도 만들어 줘.

## 6단계. 마무리
> 모바일 화면, 다크 모드, 키보드 포커스, 로딩/에러 상태를 점검하고 고쳐 줘. 그다음 npm run build가 통과하는지 확인해 줘.

## 7단계. 배포 (사람이 직접)
1. GitHub에 push
2. Vercel > Add New Project > 저장소 선택
3. Environment Variables에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 등록 → Deploy
4. 배포된 주소에서 저장 기능까지 동작 확인

## 2인 역할 분담 예시
- A: 0단계 Supabase 세팅, 2단계 API, 7단계 배포
- B: 3~4단계 화면, 5단계 저장 UI
- 6단계는 함께, 서로의 PR 리뷰

## 확장 아이디어 (시간 남으면)
- 문장 공유 버튼 (Web Share API / 링크 복사)
- 관리용 문장 추가 페이지
- 카테고리별 "오늘의 문장"

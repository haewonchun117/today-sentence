# 오늘의 문장 (Today's Sentence)

매일 새로운 문장을 보여 주고, 카테고리별로 문장을 뽑고, 마음에 드는 문장을 저장하는 웹앱.
전공세미나 팀 프로젝트 (2인). 핵심 타겟: 위로나 동기부여가 필요한 10~20대.

## 기술 스택 (과제 기준 — 바꾸지 말 것)
- Next.js (App Router) + TypeScript + Tailwind CSS
- 백엔드: Next.js API Routes (`app/api/**/route.ts`). Express 등 별도 서버 쓰지 않음
- DB: Supabase (`@supabase/supabase-js`). 스키마는 `supabase/schema.sql`
- 배포: Vercel + GitHub 연동
- 로그인/인증 없음

## 화면 (Sitemap)
1. 홈 `/` : 로고, 오늘 날짜, 오늘의 문장, [오늘의 문장 뽑기] 버튼, [저장하기] 버튼
2. 카테고리 `/category` : 위로·동기부여·사랑·인간관계·공부 중 선택 → 해당 문장 랜덤 출력, [다른 문장 뽑기], [저장하기]
3. 저장한 문장 `/saved` : 문장 + 작성자/출처 + 카테고리 목록, [저장 취소]. 비어 있으면 홈으로 가는 버튼
   - 문장마다 '내 생각 메모'를 쓰고·수정하고·지울 수 있다. 메모가 있으면 문장 아래에 손글씨 폰트(Gaegu)로 보여 주고, 없으면 [메모 남기기] 버튼만 보여 준다.
   - 메모가 있는 문장을 저장 취소하면 메모도 함께 지워지므로 한 번 확인한다.

상단에 세 메뉴(홈 / 카테고리 / 저장한 문장)가 항상 보인다.

## API
| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| GET | `/api/sentences/today` | 오늘의 문장. 한국 시간(Asia/Seoul) 날짜로 정해서 하루 동안 같은 문장 |
| GET | `/api/sentences/random?category=<id>&exclude=<id>` | 랜덤 문장. category 없으면 전체, exclude는 방금 본 문장 제외 |
| GET | `/api/categories` | 카테고리 목록 (sort 순) |
| GET | `/api/saved?deviceId=<uuid>` | 저장한 문장 목록 (최신순, 문장·카테고리·메모 포함) |
| POST | `/api/saved` body `{ deviceId, sentenceId }` | 저장 (이미 있으면 그대로 성공, 메모 유지) |
| PATCH | `/api/saved` body `{ deviceId, sentenceId, memo }` | 내 생각 메모 쓰기·수정. 빈 문자열이면 지움. 저장하지 않은 문장이면 404 |
| DELETE | `/api/saved` body `{ deviceId, sentenceId }` | 저장 취소 (메모도 함께 삭제) |

## 내 생각 메모
- `saved_sentences.memo` (`text not null default ''`, 메모 없음 = 빈 문자열), `saved_sentences.memo_updated_at` (`timestamptz`, 메모가 없으면 null).
- 앞뒤 공백을 지운 뒤 500자까지 (`lib/types.ts`의 `MEMO_MAX_LENGTH`). 넘으면 400.

## 저장 방식 (로그인 없음)
- 처음 방문 시 `crypto.randomUUID()`로 deviceId를 만들어 localStorage에 보관하고, 저장 API에 함께 보낸다.
- 같은 브라우저에서는 저장 목록이 유지되고, 데이터 자체는 Supabase에 있다.

## 보안 규칙
- Supabase 접근은 서버(API Routes)에서만 한다. `lib/supabase-server.ts`에서 `SUPABASE_SERVICE_ROLE_KEY`로 클라이언트 생성.
- service role key는 절대 `NEXT_PUBLIC_` 접두사를 붙이지 않고, 클라이언트 컴포넌트에서 import하지 않는다.
- 환경 변수: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (`.env.local`, Vercel 환경 변수에 동일하게 등록). `.env.local`은 커밋 금지.
- API 입력값(deviceId 형식, sentenceId 숫자, category 값, memo 문자열·500자) 검증 후 잘못되면 400.

## 디자인
- `design/today-sentence.html` 데모를 기준으로 한다: 줄 노트 배경, 찢은 종이 띠 카드, 파스텔(파랑 #BBD6F7, 노랑 #F6EFBF, 분홍 #F8D6CF, 초록 #CFE8BC, 보라 #DCCBF2), 손그림 느낌 테두리, 언덕 위 토끼.
- 폰트: Jua(UI), Gaegu(문장) — `next/font/google` 사용.
- 카테고리 색: 위로=분홍, 동기부여=노랑, 사랑=보라, 인간관계=초록, 공부=파랑.
- 모바일 우선, 다크 모드 지원, 저장/취소 시 토스트("저장했어요"/"저장을 취소했어요"), 메모 저장/삭제 시 토스트("메모를 저장했어요"/"메모를 지웠어요").

## 작업 방식
- 기능 하나 끝날 때마다 `npm run build`가 통과하는지 확인하고 커밋.
- 컴포넌트는 `components/`, Supabase·타입은 `lib/`에 둔다.
- 사용자에게 보이는 문구는 한국어.

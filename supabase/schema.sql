-- 오늘의 문장 : Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run

-- 1) 카테고리
create table if not exists categories (
  id   text primary key,          -- 'comfort' 같은 영문 slug
  name text not null,             -- 화면에 보이는 이름
  sort int  not null default 0
);

-- 2) 문장
create table if not exists sentences (
  id          bigint generated always as identity primary key,
  category_id text not null references categories(id),
  content     text not null,
  author      text not null,
  created_at  timestamptz not null default now()
);
create index if not exists sentences_category_idx on sentences(category_id);

-- 3) 저장한 문장 (로그인 없이 기기별 device_id 로 구분)
create table if not exists saved_sentences (
  id          bigint generated always as identity primary key,
  device_id   uuid   not null,
  sentence_id bigint not null references sentences(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (device_id, sentence_id)
);
create index if not exists saved_device_idx on saved_sentences(device_id);

-- RLS 켜기: 브라우저에서 DB에 직접 접근하지 못하게 막고,
-- 모든 읽기/쓰기는 서버(Next.js API Routes)에서 service role key 로만 처리
alter table categories       enable row level security;
alter table sentences        enable row level security;
alter table saved_sentences  enable row level security;

-- 시드 데이터
insert into categories (id, name, sort) values
  ('comfort',    '위로',     1),
  ('motivation', '동기부여', 2),
  ('love',       '사랑',     3),
  ('people',     '인간관계', 4),
  ('study',      '공부',     5)
on conflict (id) do nothing;

insert into sentences (category_id, content, author) values
  ('comfort', '이 또한 지나가리라.', '옛 격언'),
  ('comfort', '비 온 뒤에 땅이 굳어진다.', '한국 속담'),
  ('comfort', '고생 끝에 낙이 온다.', '한국 속담'),
  ('comfort', '쥐구멍에도 볕 들 날 있다.', '한국 속담'),
  ('comfort', '쉬어 가도 괜찮아. 멈춘 게 아니라 숨을 고르는 중이니까.', '오늘의 문장'),
  ('comfort', '오늘 잘 해내지 못했어도, 오늘을 버텨낸 것만으로 충분해.', '오늘의 문장'),
  ('comfort', '모든 꽃이 같은 계절에 피지는 않는다.', '오늘의 문장'),
  ('comfort', '눈물과 함께 빵을 먹어 보지 않은 사람은 인생의 맛을 모른다.', '괴테'),
  ('motivation', '천 리 길도 한 걸음부터.', '한국 속담'),
  ('motivation', '시작이 반이다.', '한국 속담'),
  ('motivation', '낙숫물이 댓돌을 뚫는다.', '한국 속담'),
  ('motivation', '천재는 1%의 영감과 99%의 노력으로 이루어진다.', '토머스 에디슨'),
  ('motivation', '나는 천천히 가지만, 결코 뒤로 가지는 않는다.', '에이브러햄 링컨'),
  ('motivation', '오늘의 작은 한 걸음이 내일의 큰 차이를 만든다.', '오늘의 문장'),
  ('motivation', '완벽한 때는 오지 않아. 지금 시작하는 때가 있을 뿐.', '오늘의 문장'),
  ('love', '사랑은 오래 참고, 사랑은 온유하며.', '고린도전서 13장'),
  ('love', '사랑받고 싶다면 사랑하라, 그리고 사랑스러워져라.', '벤저민 프랭클린'),
  ('love', '사랑은 눈으로 보지 않고 마음으로 본다.', '셰익스피어, 「한여름 밤의 꿈」'),
  ('love', '진정한 사랑의 길은 결코 순탄하지 않았다.', '셰익스피어, 「한여름 밤의 꿈」'),
  ('love', '제 눈에 안경.', '한국 속담'),
  ('love', '가장 좋은 선물은 함께 보내는 시간이다.', '오늘의 문장'),
  ('love', '좋아하는 마음은 숨겨도 티가 난다.', '오늘의 문장'),
  ('people', '가는 말이 고와야 오는 말이 곱다.', '한국 속담'),
  ('people', '말 한마디로 천 냥 빚을 갚는다.', '한국 속담'),
  ('people', '백지장도 맞들면 낫다.', '한국 속담'),
  ('people', '친구란 두 몸에 깃든 하나의 영혼이다.', '아리스토텔레스'),
  ('people', '세 사람이 길을 가면 그중에 반드시 나의 스승이 있다.', '공자, 『논어』'),
  ('people', '내가 원하지 않는 일은 남에게도 하지 말라.', '공자, 『논어』'),
  ('people', '좋은 사람 곁에 있으면 나도 조금씩 좋은 사람이 된다.', '오늘의 문장'),
  ('study', '배우고 때때로 익히면 또한 기쁘지 아니한가.', '공자, 『논어』'),
  ('study', '배우기만 하고 생각하지 않으면 얻는 것이 없다.', '공자, 『논어』'),
  ('study', '아는 것이 힘이다.', '프랜시스 베이컨'),
  ('study', '티끌 모아 태산.', '한국 속담'),
  ('study', '늦었다고 생각할 때가 가장 빠를 때다.', '격언'),
  ('study', '오늘 공부한 한 페이지가 내일의 나를 지켜 준다.', '오늘의 문장'),
  ('study', '어제보다 한 줄 더 알게 된 것, 그게 오늘의 성장이다.', '오늘의 문장');

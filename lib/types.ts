export type Category = {
  id: string;
  name: string;
  sort: number;
};

export type Sentence = {
  id: number;
  content: string;
  author: string;
  category: { id: string; name: string };
};

// 내 생각 메모 최대 길이 (API 검증과 입력창이 함께 쓴다)
export const MEMO_MAX_LENGTH = 500;

export type SavedSentence = {
  savedAt: string;
  // 메모가 없으면 빈 문자열
  memo: string;
  memoUpdatedAt: string | null;
  sentence: Sentence;
};

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

export type SavedSentence = {
  savedAt: string;
  sentence: Sentence;
};

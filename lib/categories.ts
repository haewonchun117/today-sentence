// 카테고리별 파스텔 색 (Tailwind 클래스). 다크 모드 색은 globals.css 의 변수가 처리한다
const CATEGORY_BG: Record<string, string> = {
  comfort: "bg-pink",
  motivation: "bg-yellow",
  love: "bg-lavender",
  people: "bg-green",
  study: "bg-blue",
};

export function categoryBg(id: string): string {
  return CATEGORY_BG[id] ?? "bg-strip";
}

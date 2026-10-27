// 라이트/다크 테마. <html> 에 .dark 클래스를 붙이고 떼는 방식이다 (globals.css, Tailwind dark: 변형).
// 사용자가 고른 값이 없으면 시스템 설정을 따른다.
export const THEME_KEY = "today-sentence-theme";

// 브라우저 상단 색 (meta theme-color): 종이색 / 밤 노트색
const THEME_COLOR = { light: "#fbf8ef", dark: "#1f2430" };

// <head> 에서 화면이 그려지기 전에 실행해 새로 고침 때 번쩍이지 않게 한다.
// layout.tsx 에서 그대로 문자열로 넣으므로 다른 모듈을 참조하지 않는다.
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => (meta.content = dark ? THEME_COLOR.dark : THEME_COLOR.light));
}

export function getStoredTheme(): "light" | "dark" | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(dark: boolean) {
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {}
}

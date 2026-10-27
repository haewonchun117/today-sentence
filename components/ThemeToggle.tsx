"use client";

import { useEffect, useSyncExternalStore } from "react";
import { applyTheme, getStoredTheme, storeTheme } from "@/lib/theme";

// <html> 의 .dark 클래스를 구독한다 (첫 화면에서는 <head> 스크립트가 이미 붙여 둔 상태)
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const isDarkNow = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDarkNow, () => false);

  useEffect(() => {
    // 브라우저 상단 색을 지금 테마에 맞추고,
    // 사용자가 직접 고른 적이 없으면 시스템 설정이 바뀔 때 따라간다
    applyTheme(isDarkNow());
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (getStoredTheme() === null) applyTheme(e.matches);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    applyTheme(!dark);
    storeTheme(!dark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="다크 모드"
      aria-pressed={dark}
      title={dark ? "밝은 화면으로 바꾸기" : "어두운 화면으로 바꾸기"}
      className="rounded-sketch-chip grid size-10 flex-none place-items-center border-2 border-ink bg-strip text-lg leading-none transition-transform duration-150 hover:-rotate-6"
    >
      {/* 아이콘은 CSS(dark: 변형)로 바꿔서 하이드레이션 전에도 맞는 아이콘이 보이게 한다 */}
      <span aria-hidden="true" className="dark:hidden">
        🌙
      </span>
      <span aria-hidden="true" className="hidden dark:inline">
        ☀️
      </span>
    </button>
  );
}

import Link from "next/link";

// 라이트 모드에서는 웃는 해, 다크 모드에서는 조는 달 (CSS dark: 변형으로 바꾼다)
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="오늘의 문장 홈"
      className="flex items-center gap-2 text-[1.6rem] tracking-[-0.02em] whitespace-nowrap text-ink no-underline"
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-[38px] flex-none dark:hidden">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="20" cy="20" r="8" fill="#F6EFBF" />
          <path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5" />
          <path d="M17 21.5q3 2.5 6 0" />
        </g>
        <circle cx="17.3" cy="18" r="1.1" fill="currentColor" />
        <circle cx="22.7" cy="18" r="1.1" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="hidden size-[38px] flex-none dark:block">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {/* 초승달: 바깥 큰 호 + 안쪽 작은 호 */}
          <path d="M24 5.5 A15 15 0 1 0 34.5 26 A12 12 0 0 1 24 5.5 Z" fill="#F6EFBF" />
          {/* 감은 눈과 미소 */}
          <path d="M10.5 18.5q2 1.8 4 0M12 25q2.5 2 5 0" />
          {/* 반짝이는 별 */}
          <path d="M31 8v5M28.5 10.5h5" />
        </g>
      </svg>
      오늘의 문장
    </Link>
  );
}

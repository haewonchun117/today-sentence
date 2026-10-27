import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="오늘의 문장 홈"
      className="flex items-center gap-2 text-[1.6rem] tracking-[-0.02em] whitespace-nowrap text-ink no-underline"
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-[38px] flex-none">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="20" cy="20" r="8" fill="#F6EFBF" />
          <path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5" />
          <path d="M17 21.5q3 2.5 6 0" />
        </g>
        <circle cx="17.3" cy="18" r="1.1" fill="currentColor" />
        <circle cx="22.7" cy="18" r="1.1" fill="currentColor" />
      </svg>
      오늘의 문장
    </Link>
  );
}

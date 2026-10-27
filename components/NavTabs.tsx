"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSaved } from "@/lib/use-saved";

const TABS = [
  { href: "/", label: "홈" },
  { href: "/category", label: "카테고리" },
  { href: "/saved", label: "저장한 문장" },
];

export default function NavTabs() {
  const pathname = usePathname();
  const { items } = useSaved();

  return (
    <nav aria-label="메뉴" className="mt-[22px] mb-[30px] flex flex-wrap gap-2.5">
      {TABS.map((tab) => {
        const current = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-sketch-tab border-2 border-ink px-4 pt-1.5 pb-[5px] text-[1.05rem] text-ink transition-transform duration-150 hover:-rotate-[1.5deg] ${
              current ? "bg-blue" : "bg-strip"
            }`}
          >
            {tab.label}
            {tab.href === "/saved" && items.length > 0 && (
              <span className="ml-1 text-[0.85rem] text-ink-soft">
                {items.length}
                <span className="sr-only">개</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

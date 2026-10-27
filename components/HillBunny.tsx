"use client";

import { useEffect, useState } from "react";
import { HOP_EVENT } from "@/lib/ui-events";

// 화면 아래 언덕 위 토끼. 새 문장을 뽑으면 한 번 깡충 뛴다
export default function HillBunny() {
  const [hops, setHops] = useState(0);

  useEffect(() => {
    const onHop = () => setHops((n) => n + 1);
    window.addEventListener(HOP_EVENT, onHop);
    return () => window.removeEventListener(HOP_EVENT, onHop);
  }, []);

  return (
    <div aria-hidden="true">
      <div className="fixed bottom-[-260px] left-1/2 -z-10 h-[340px] w-[560px] -translate-x-1/2 rounded-[50%] border-3 border-ink bg-hill" />
      <svg
        key={hops}
        viewBox="0 0 64 70"
        className={`fixed bottom-[62px] left-1/2 -z-10 w-16 -translate-x-1/2 ${hops > 0 ? "animate-hop" : ""}`}
      >
        <g stroke="#2A2622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="#fff">
          <path d="M22 30 C17 12 18 3 24 3 C29 3 29 15 28 28" />
          <path d="M38 28 C37 14 39 3 44 4 C50 5 47 16 42 30" />
          <path d="M14 46 C12 30 22 25 32 25 C44 25 52 31 50 46 C48 58 42 66 32 66 C21 66 15 58 14 46 Z" />
        </g>
        <circle cx="25" cy="42" r="2.2" fill="#2A2622" />
        <circle cx="39" cy="42" r="2.2" fill="#2A2622" />
        <path d="M29 48 q3 3 6 0" fill="none" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="49" r="2.5" fill="#F8C9C0" />
        <circle cx="44" cy="49" r="2.5" fill="#F8C9C0" />
      </svg>
    </div>
  );
}

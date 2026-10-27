"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HOP_EVENT } from "@/lib/ui-events";

// 화면 아래 언덕 위 토끼. 새 문장을 뽑으면 한 번 깡충 뛴다.
//
// bunny.svg (viewBox 120x136) 를 너비 96px(0.8배)로 그린다.
// 언덕 윗선은 화면 아래에서 80px (높이 340px - 아래로 내린 260px).
// 토끼 바닥을 57px 에 두면 그림의 y≈107(머리 바로 아래)부터 약 23px 이 언덕 뒤에 묻힌다.
// 폴짝(22px) 뛰어도 몸통의 잘린 바닥선이 언덕 위로 드러나지 않는 깊이다.
export default function HillBunny() {
  const [hops, setHops] = useState(0);

  useEffect(() => {
    const onHop = () => setHops((n) => n + 1);
    window.addEventListener(HOP_EVENT, onHop);
    return () => window.removeEventListener(HOP_EVENT, onHop);
  }, []);

  return (
    // 토끼와 언덕을 한 묶음으로 내용 뒤에 두고, 묶음 안에서는 언덕을 토끼 위에 그린다
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 -z-10">
      <Image
        key={hops}
        src="/bunny.svg"
        alt=""
        width={96}
        height={109}
        unoptimized
        className={`absolute bottom-[57px] left-1/2 w-24 -translate-x-1/2 ${hops > 0 ? "animate-hop" : ""}`}
      />
      <div className="absolute bottom-[-260px] left-1/2 h-[340px] w-[560px] -translate-x-1/2 rounded-[50%] border-3 border-ink bg-hill" />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { HEART_EVENT, HOP_EVENT, isBunnySleeping, subscribeBunnySleeping } from "@/lib/ui-events";

// 화면 아래 언덕 위 토끼. 상황에 따라 반응한다.
// - 문장을 뽑으면 폴짝 (hopBunny)
// - 문장을 저장하면 머리 위로 하트가 퐁 (popHeart)
// - 저장한 문장이 없는 빈 화면에서는 눈을 감고 Zzz (setBunnySleeping)
//
// bunny.svg (viewBox 120x136) 를 너비 96px(0.8배)로 그린다.
// 언덕 윗선은 화면 아래에서 80px (높이 340px - 아래로 내린 260px).
// 토끼 바닥을 57px 에 두면 그림의 y≈107(머리 바로 아래)부터 약 23px 이 언덕 뒤에 묻힌다.
// 폴짝(22px) 뛰어도 몸통의 잘린 바닥선이 언덕 위로 드러나지 않는 깊이다.
export default function HillBunny() {
  const [hops, setHops] = useState(0);
  const [hearts, setHearts] = useState(0);
  const sleeping = useSyncExternalStore(subscribeBunnySleeping, isBunnySleeping, () => false);

  useEffect(() => {
    const onHop = () => setHops((n) => n + 1);
    const onHeart = () => setHearts((n) => n + 1);
    window.addEventListener(HOP_EVENT, onHop);
    window.addEventListener(HEART_EVENT, onHeart);
    return () => {
      window.removeEventListener(HOP_EVENT, onHop);
      window.removeEventListener(HEART_EVENT, onHeart);
    };
  }, []);

  const bunnyClass = "absolute bottom-[57px] left-1/2 w-24 -translate-x-1/2";

  return (
    // 토끼와 언덕을 한 묶음으로 내용 뒤에 두고, 묶음 안에서는 언덕을 토끼 위에 그린다
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 -z-10">
      {sleeping ? (
        <Image src="/bunny-sleep.svg" alt="" width={96} height={109} unoptimized className={bunnyClass} />
      ) : (
        <Image
          key={hops}
          src="/bunny.svg"
          alt=""
          width={96}
          height={109}
          unoptimized
          className={`${bunnyClass} ${hops > 0 ? "animate-hop" : ""}`}
        />
      )}

      {/* 하트: 귀 끝(화면 아래에서 약 166px) 바로 위에서 시작 */}
      {hearts > 0 && (
        <svg
          key={hearts}
          viewBox="0 0 24 22"
          className="absolute bottom-[160px] left-1/2 w-6 -translate-x-1/2 animate-heart opacity-0"
        >
          <path
            d="M12 20 C5 15 2 11 2 7.5 C2 4.5 4.4 2.5 7 2.5 C9 2.5 10.8 3.7 12 5.6 C13.2 3.7 15 2.5 17 2.5 C19.6 2.5 22 4.5 22 7.5 C22 11 19 15 12 20 Z"
            fill="#F8C9C0"
            stroke="#1f1b17"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Zzz: 머리 오른쪽 위에서 하나씩 떠오른다.
          애니메이션을 끈 사용자(동작 줄이기)에게는 계단 모양으로 멈춰 있는 Zzz 를 보여 준다 */}
      {sleeping && (
        <div className="absolute bottom-[112px] left-[calc(50%+30px)] font-ui text-lg text-ink-soft">
          <span className="absolute bottom-0 left-0 origin-bottom-left animate-zzz motion-reduce:text-sm">z</span>
          <span className="absolute bottom-0 left-0 origin-bottom-left animate-zzz [animation-delay:0.8s] motion-reduce:translate-x-2.5 motion-reduce:-translate-y-4 motion-reduce:text-base">
            z
          </span>
          <span className="absolute bottom-0 left-0 origin-bottom-left animate-zzz [animation-delay:1.6s] motion-reduce:translate-x-5 motion-reduce:-translate-y-9 motion-reduce:text-xl">
            Z
          </span>
        </div>
      )}

      <div className="absolute bottom-[-260px] left-1/2 h-[340px] w-[560px] -translate-x-1/2 rounded-[50%] border-3 border-ink bg-hill" />
    </div>
  );
}

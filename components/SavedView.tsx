"use client";

import Link from "next/link";
import { sketchButtonClass } from "@/components/SketchButton";
import { categoryBg } from "@/lib/categories";
import { useSaved } from "@/lib/use-saved";

export default function SavedView() {
  const { items, status, pendingIds, toggle } = useSaved({ refresh: true });

  let body;
  if (items.length > 0) {
    body = (
      <ul className="grid gap-[22px]">
        {items.map(({ sentence }) => (
          <li
            key={sentence.id}
            className="torn px-6 pt-[22px] pb-6 odd:-rotate-[0.6deg] even:rotate-[0.6deg]"
          >
            <p className="font-hand text-2xl leading-[1.35] font-bold break-keep">{sentence.content}</p>
            <p className="mt-2 text-right font-hand text-[1.15rem] text-ink-soft">— {sentence.author}</p>
            <div className="mt-3 flex items-center justify-between gap-2.5">
              <span
                className={`rounded-sketch-tag border-[1.5px] border-ink px-3 py-0.5 text-[0.9rem] ${categoryBg(sentence.category.id)}`}
              >
                {sentence.category.name}
              </span>
              <button
                type="button"
                onClick={() => toggle(sentence)}
                disabled={pendingIds.has(sentence.id)}
                className="p-1 text-[0.95rem] text-ink-soft underline underline-offset-[3px] disabled:opacity-60"
              >
                저장 취소
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  } else if (status === "ready") {
    body = (
      <div className="px-2.5 py-[30px] text-center">
        <p className="mb-[18px] font-hand text-2xl break-keep">
          아직 저장한 문장이 없어요.
          <br />
          마음에 드는 문장을 만나면 저장해 보세요.
        </p>
        <Link href="/" className={sketchButtonClass()}>
          문장 뽑으러 가기
        </Link>
      </div>
    );
  } else {
    body = (
      <p className="font-hand text-[1.35rem] text-ink-soft">
        {status === "error"
          ? "저장한 문장을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
          : "저장한 문장을 펼치는 중…"}
      </p>
    );
  }

  return (
    <section>
      <h2 className="torn mb-[22px] inline-block -rotate-[1.2deg] px-[26px] pt-2.5 pb-2 text-[1.7rem] font-normal">
        저장한 문장
      </h2>
      {body}
    </section>
  );
}

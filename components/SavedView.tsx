"use client";

import Link from "next/link";
import { useRef } from "react";
import SavedMemo from "@/components/SavedMemo";
import SketchButton, { sketchButtonClass } from "@/components/SketchButton";
import { categoryBg } from "@/lib/categories";
import { useSaved } from "@/lib/use-saved";
import type { Sentence } from "@/lib/types";

export default function SavedView() {
  const { items, status, pendingIds, toggle, reload, saveMemo } = useSaved({ refresh: true });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 저장 취소한 항목이 사라지면 그 버튼에 있던 키보드 포커스도 사라지므로
  // 같은 자리의 다음 항목 [저장 취소] 버튼(없으면 제목)으로 옮긴다
  async function unsave(sentence: Sentence, memo: string, index: number) {
    // 저장을 취소하면 메모도 함께 지워지므로 메모가 있으면 한 번 묻는다
    if (memo && !window.confirm("메모도 함께 지워져요. 저장을 취소할까요?")) return;
    await toggle(sentence);
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && active !== document.body && document.contains(active)) return;
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-unsave]");
      const next = buttons?.[index] ?? buttons?.[index - 1];
      (next ?? headingRef.current)?.focus();
    });
  }

  let body;
  if (items.length > 0) {
    body = (
      <ul ref={listRef} className="grid gap-[22px]">
        {items.map(({ sentence, memo }, index) => {
          const pending = pendingIds.has(sentence.id);
          return (
            <li
              key={sentence.id}
              className="torn px-6 pt-[22px] pb-6 odd:-rotate-[0.6deg] even:rotate-[0.6deg]"
            >
              <p className="font-hand text-2xl leading-[1.35] font-bold break-keep">{sentence.content}</p>
              <p className="mt-2 text-right font-hand text-[1.15rem] text-ink-soft">— {sentence.author}</p>
              <SavedMemo
                sentenceContent={sentence.content}
                memo={memo}
                onSave={(next) => saveMemo(sentence.id, next)}
              />
              <div className="mt-3 flex items-center justify-between gap-2.5">
                <span
                  className={`rounded-sketch-tag border-[1.5px] border-ink px-3 py-0.5 text-[0.9rem] ${categoryBg(sentence.category.id)}`}
                >
                  {sentence.category.name}
                </span>
                <button
                  type="button"
                  data-unsave
                  onClick={pending ? undefined : () => unsave(sentence, memo, index)}
                  aria-disabled={pending || undefined}
                  className="p-1 text-[0.95rem] text-ink-soft underline underline-offset-[3px] aria-disabled:cursor-progress aria-disabled:opacity-60"
                >
                  저장 취소
                  <span className="sr-only">: {sentence.content}</span>
                </button>
              </div>
            </li>
          );
        })}
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
  } else if (status === "error") {
    body = (
      <div>
        <p className="mb-[18px] font-hand text-[1.35rem] text-ink-soft">
          저장한 문장을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
        <SketchButton onClick={reload}>다시 시도</SketchButton>
      </div>
    );
  } else {
    body = (
      <p className="font-hand text-[1.35rem] text-ink-soft" aria-busy="true">
        저장한 문장을 펼치는 중…
      </p>
    );
  }

  return (
    <section>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="torn mb-[22px] inline-block -rotate-[1.2deg] px-[26px] pt-2.5 pb-2 text-[1.7rem] font-normal"
      >
        저장한 문장
      </h2>
      {body}
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import SentenceCard from "@/components/SentenceCard";
import SketchButton from "@/components/SketchButton";
import { categoryBg } from "@/lib/categories";
import { hopBunny } from "@/lib/ui-events";
import { useSaved } from "@/lib/use-saved";
import type { Category, Sentence } from "@/lib/types";

const LOAD_ERROR = "문장을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";

export default function CategoryView() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoriesFailed, setCategoriesFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [drawFailed, setDrawFailed] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const { savedIds, toggle, pending } = useSaved();
  // 버튼을 빠르게 여러 번 누르면 마지막 요청의 결과만 보여 준다
  const latestRequest = useRef(0);

  useEffect(() => {
    let ignore = false;
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { categories: Category[] }) => {
        if (!ignore) setCategories(data.categories);
      })
      .catch(() => {
        if (!ignore) setCategoriesFailed(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function draw(categoryId: string) {
    const request = ++latestRequest.current;
    // 같은 카테고리에서 다시 뽑을 때만 방금 본 문장을 제외한다
    const exclude = sentence && sentence.category.id === categoryId ? sentence.id : null;
    const params = new URLSearchParams({ category: categoryId });
    if (exclude !== null) params.set("exclude", String(exclude));

    setSelected(categoryId);
    setDrawing(true);
    try {
      const res = await fetch(`/api/sentences/random?${params}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { sentence: Sentence } = await res.json();
      if (request !== latestRequest.current) return;
      setSentence(data.sentence);
      setDrawFailed(false);
      setDrawCount((n) => n + 1);
      hopBunny();
    } catch {
      if (request !== latestRequest.current) return;
      setSentence(null);
      setDrawFailed(true);
    } finally {
      if (request === latestRequest.current) setDrawing(false);
    }
  }

  const saved = sentence !== null && savedIds.has(sentence.id);

  return (
    <section>
      <div role="group" aria-label="카테고리 선택" className="mb-[26px] flex min-h-12 flex-wrap gap-2.5">
        {categories?.map((category) => {
          const active = category.id === selected;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => draw(category.id)}
              className={`rounded-sketch-chip border-2 border-ink px-[18px] pt-2 pb-1.5 text-[1.1rem] text-ink transition-transform duration-150 ${
                active ? `${categoryBg(category.id)} -rotate-2` : "bg-strip"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {selected === null ? (
        <p className="font-hand text-[1.35rem] text-ink-soft">
          {categoriesFailed
            ? "카테고리를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            : "지금 필요한 문장을 골라 보세요."}
        </p>
      ) : (
        <>
          <SentenceCard
            key={drawCount}
            sentence={sentence}
            animate={drawCount > 0}
            placeholder={drawFailed ? LOAD_ERROR : "문장을 고르는 중…"}
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <SketchButton onClick={() => draw(selected)} disabled={drawing}>
              다른 문장 뽑기
            </SketchButton>
            <SketchButton
              variant="ghost"
              aria-pressed={saved}
              disabled={!sentence || pending}
              onClick={() => sentence && toggle(sentence.id)}
            >
              {saved ? "저장됨" : "저장하기"}
            </SketchButton>
          </div>
        </>
      )}
    </section>
  );
}

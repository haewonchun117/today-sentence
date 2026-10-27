"use client";

import { useEffect, useState } from "react";
import SentenceCard from "@/components/SentenceCard";
import SketchButton from "@/components/SketchButton";
import { hopBunny } from "@/lib/ui-events";
import { useSaved } from "@/lib/use-saved";
import type { Sentence } from "@/lib/types";

const LOAD_ERROR = "문장을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";

export default function HomeView() {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [placeholder, setPlaceholder] = useState("오늘의 문장을 펼치는 중…");
  const [drawCount, setDrawCount] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const { savedIds, toggle, pending } = useSaved();

  useEffect(() => {
    let ignore = false;
    fetch("/api/sentences/today")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { sentence: Sentence }) => {
        if (!ignore) setSentence(data.sentence);
      })
      .catch(() => {
        if (!ignore) setPlaceholder(LOAD_ERROR);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function draw() {
    setDrawing(true);
    try {
      const query = sentence ? `?exclude=${sentence.id}` : "";
      const res = await fetch(`/api/sentences/random${query}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { sentence: Sentence } = await res.json();
      setSentence(data.sentence);
      setDrawCount((n) => n + 1);
      hopBunny();
    } catch {
      if (!sentence) setPlaceholder(LOAD_ERROR);
    } finally {
      setDrawing(false);
    }
  }

  const saved = sentence !== null && savedIds.has(sentence.id);

  return (
    <section>
      <SentenceCard
        key={drawCount}
        sentence={sentence}
        animate={drawCount > 0}
        placeholder={placeholder}
      />
      <div className="mt-7 flex flex-wrap gap-3">
        <SketchButton onClick={draw} disabled={drawing}>
          오늘의 문장 뽑기
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
    </section>
  );
}

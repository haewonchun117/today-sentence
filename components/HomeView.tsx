"use client";

import { useEffect, useState } from "react";
import SentenceCard from "@/components/SentenceCard";
import SketchButton from "@/components/SketchButton";
import { hopBunny, showToast } from "@/lib/ui-events";
import { useSaved } from "@/lib/use-saved";
import type { Sentence } from "@/lib/types";

const LOAD_ERROR = "문장을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
const DRAW_ERROR = "새 문장을 불러오지 못했어요";

export default function HomeView() {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [placeholder, setPlaceholder] = useState("오늘의 문장을 펼치는 중…");
  const [drawCount, setDrawCount] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const { ids: savedIds, pendingIds, ready, toggle } = useSaved();

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
      // 보던 문장이 있으면 그대로 두고 알려만 준다
      if (sentence) showToast(DRAW_ERROR);
      else setPlaceholder(LOAD_ERROR);
    } finally {
      setDrawing(false);
    }
  }

  const saved = sentence !== null && savedIds.has(sentence.id);
  const loading = drawing || (sentence === null && placeholder !== LOAD_ERROR);

  return (
    <section>
      {/* 새 문장을 화면 읽기 프로그램이 읽어 주도록 */}
      <div aria-live="polite" aria-busy={loading}>
        <SentenceCard
          key={drawCount}
          sentence={sentence}
          animate={drawCount > 0}
          placeholder={placeholder}
        />
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <SketchButton onClick={draw} busy={drawing}>
          오늘의 문장 뽑기
        </SketchButton>
        <SketchButton
          variant="ghost"
          aria-pressed={saved}
          disabled={!sentence || !ready}
          busy={sentence !== null && pendingIds.has(sentence.id)}
          onClick={() => sentence && toggle(sentence)}
        >
          {saved ? "저장됨" : "저장하기"}
        </SketchButton>
      </div>
    </section>
  );
}

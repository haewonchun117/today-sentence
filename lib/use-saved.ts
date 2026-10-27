"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceId } from "@/lib/device-id";
import { showToast } from "@/lib/ui-events";
import type { SavedSentence } from "@/lib/types";

// 이 브라우저에서 저장한 문장 id 목록과 저장/저장 취소 토글
export function useSaved() {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/saved?deviceId=${getDeviceId()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { saved: SavedSentence[] }) => {
        if (!ignore) setSavedIds(new Set(data.saved.map((s) => s.sentence.id)));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const toggle = useCallback(
    async (sentenceId: number) => {
      const wasSaved = savedIds.has(sentenceId);
      setPending(true);
      try {
        const res = await fetch("/api/saved", {
          method: wasSaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId: getDeviceId(), sentenceId }),
        });
        if (!res.ok) throw new Error(String(res.status));

        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.delete(sentenceId);
          else next.add(sentenceId);
          return next;
        });
        showToast(wasSaved ? "저장을 취소했어요" : "저장했어요");
      } catch {
        showToast("잠시 후 다시 시도해 주세요");
      } finally {
        setPending(false);
      }
    },
    [savedIds],
  );

  return { savedIds, toggle, pending };
}

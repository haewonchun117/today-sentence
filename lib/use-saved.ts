"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useDeviceId } from "@/lib/device-id";
import { showToast } from "@/lib/ui-events";
import type { SavedSentence, Sentence } from "@/lib/types";

// 저장한 문장은 화면 전체(메뉴 개수, 홈, 카테고리, 저장한 문장)가 함께 보므로
// 컴포넌트 밖의 작은 저장소 하나에 두고 useSyncExternalStore 로 구독한다.
type SavedState = {
  status: "idle" | "loading" | "ready" | "error";
  items: SavedSentence[];
  ids: Set<number>;
  pendingIds: Set<number>;
};

const INITIAL: SavedState = { status: "idle", items: [], ids: new Set(), pendingIds: new Set() };

let state = INITIAL;
const listeners = new Set<() => void>();

function setState(patch: Partial<SavedState>) {
  const next = { ...state, ...patch };
  if (patch.items) next.ids = new Set(patch.items.map((item) => item.sentence.id));
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// 저장/취소가 성공할 때마다 올린다. 목록을 받는 도중에 바뀌었으면 그 결과는 버린다
let version = 0;
// 메뉴와 화면이 동시에 불러도 요청은 한 번만 보낸다
let inflight: Promise<void> | null = null;

function load(deviceId: string): Promise<void> {
  if (inflight) return inflight;
  setState({ status: "loading" });
  const startedAt = version;

  inflight = (async () => {
    try {
      const res = await fetch(`/api/saved?deviceId=${deviceId}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { saved: SavedSentence[] } = await res.json();
      if (startedAt === version) setState({ status: "ready", items: data.saved });
    } catch {
      setState({ status: "error" });
    }
  })().finally(() => {
    inflight = null;
  });

  return inflight.then(() => {
    if (startedAt !== version) return load(deviceId);
  });
}

function setPending(sentenceId: number, on: boolean) {
  const pendingIds = new Set(state.pendingIds);
  if (on) pendingIds.add(sentenceId);
  else pendingIds.delete(sentenceId);
  setState({ pendingIds });
}

async function toggle(deviceId: string, sentence: Sentence) {
  if (state.pendingIds.has(sentence.id)) return;
  const wasSaved = state.ids.has(sentence.id);
  setPending(sentence.id, true);
  try {
    const res = await fetch("/api/saved", {
      method: wasSaved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, sentenceId: sentence.id }),
    });
    if (!res.ok) throw new Error(String(res.status));

    version++;
    const others = state.items.filter((item) => item.sentence.id !== sentence.id);
    setState({
      items: wasSaved ? others : [{ savedAt: new Date().toISOString(), sentence }, ...others],
    });
    showToast(wasSaved ? "저장을 취소했어요" : "저장했어요");
  } catch {
    showToast("잠시 후 다시 시도해 주세요");
  } finally {
    setPending(sentence.id, false);
  }
}

type Options = {
  // true 면 화면에 들어올 때마다 서버에서 목록을 다시 받아온다 (저장한 문장 화면)
  refresh?: boolean;
};

export function useSaved({ refresh = false }: Options = {}) {
  const deviceId = useDeviceId();
  const saved = useSyncExternalStore(subscribe, () => state, () => INITIAL);

  useEffect(() => {
    if (!deviceId) return;
    if (refresh || state.status === "idle" || state.status === "error") void load(deviceId);
  }, [deviceId, refresh]);

  return {
    ...saved,
    // 아직 목록을 받아오지 못했으면 저장 여부를 모르니 버튼을 막는다
    ready: deviceId !== null && saved.status === "ready",
    toggle: (sentence: Sentence) => {
      if (deviceId) void toggle(deviceId, sentence);
    },
  };
}

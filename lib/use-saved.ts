"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useDeviceId } from "@/lib/device-id";
import { popHeart, showToast } from "@/lib/ui-events";
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
  setPending(sentence.id, true);
  try {
    // 목록을 못 받아온 상태면 저장 여부를 알 수 없으니 먼저 다시 받아 본다
    if (state.status === "error") {
      await load(deviceId);
      if (state.status === "error") throw new Error("saved list unavailable");
    }
    const wasSaved = state.ids.has(sentence.id);

    const res = await fetch("/api/saved", {
      method: wasSaved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, sentenceId: sentence.id }),
    });
    if (!res.ok) throw new Error(String(res.status));

    version++;
    const others = state.items.filter((item) => item.sentence.id !== sentence.id);
    setState({
      items: wasSaved
        ? others
        : [{ savedAt: new Date().toISOString(), memo: "", memoUpdatedAt: null, sentence }, ...others],
    });
    showToast(wasSaved ? "저장을 취소했어요" : "저장했어요");
    if (!wasSaved) popHeart();
  } catch {
    showToast("잠시 후 다시 시도해 주세요");
  } finally {
    setPending(sentence.id, false);
  }
}

// 내 생각 메모 저장. 빈 문자열이면 지운다. 성공하면 true
async function saveMemo(deviceId: string, sentenceId: number, memo: string): Promise<boolean> {
  try {
    const res = await fetch("/api/saved", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, sentenceId, memo }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data: { memo: string; memoUpdatedAt: string | null } = await res.json();

    version++;
    setState({
      items: state.items.map((item) =>
        item.sentence.id === sentenceId ? { ...item, memo: data.memo, memoUpdatedAt: data.memoUpdatedAt } : item,
      ),
    });
    showToast(data.memo ? "메모를 저장했어요" : "메모를 지웠어요");
    return true;
  } catch {
    showToast("메모를 저장하지 못했어요. 잠시 후 다시 시도해 주세요");
    return false;
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
    // 목록을 받아오는 중이면 저장 여부를 모르니 버튼을 막는다 (실패했으면 누를 때 다시 받는다)
    ready: deviceId !== null && (saved.status === "ready" || saved.status === "error"),
    toggle: async (sentence: Sentence) => {
      if (deviceId) await toggle(deviceId, sentence);
    },
    reload: () => {
      if (deviceId) void load(deviceId);
    },
    saveMemo: async (sentenceId: number, memo: string) =>
      deviceId ? saveMemo(deviceId, sentenceId, memo) : false,
  };
}

"use client";

import { useSyncExternalStore } from "react";

// 로그인 대신 브라우저마다 deviceId 를 하나 만들어 localStorage 에 보관한다
const KEY = "today-sentence-device-id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let cached: string | null = null;

export function getDeviceId(): string {
  if (cached) return cached;
  try {
    const stored = localStorage.getItem(KEY);
    // 형식이 깨진 값이 들어 있으면 API 가 400 을 주므로 새로 만든다
    if (stored && UUID_RE.test(stored)) return (cached = stored);
  } catch {
    // 사생활 보호 모드 등에서 localStorage 를 못 쓰면 이번 방문 동안만 유지
  }
  cached = crypto.randomUUID();
  try {
    localStorage.setItem(KEY, cached);
  } catch {}
  return cached;
}

const subscribe = () => () => {};

// 서버 렌더와 첫 하이드레이션에서는 null, 브라우저에서는 deviceId
export function useDeviceId(): string | null {
  return useSyncExternalStore(subscribe, getDeviceId, () => null);
}

// 로그인 대신 브라우저마다 deviceId 를 하나 만들어 localStorage 에 보관한다
const KEY = "today-sentence-device-id";

let cached: string | null = null;

export function getDeviceId(): string {
  if (cached) return cached;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return (cached = stored);
  } catch {
    // 사생활 보호 모드 등에서 localStorage 를 못 쓰면 이번 방문 동안만 유지
  }
  cached = crypto.randomUUID();
  try {
    localStorage.setItem(KEY, cached);
  } catch {}
  return cached;
}

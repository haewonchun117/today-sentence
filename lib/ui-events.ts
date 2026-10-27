// 화면 어디서든 토스트를 띄우거나 토끼를 반응하게 하는 작은 이벤트 도우미.
// 레이아웃의 <Toast />, <HillBunny /> 가 이 이벤트를 듣는다.
export const TOAST_EVENT = "today-sentence:toast";
export const HOP_EVENT = "today-sentence:hop";
export const HEART_EVENT = "today-sentence:heart";

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

// 문장을 뽑으면 폴짝
export function hopBunny() {
  window.dispatchEvent(new Event(HOP_EVENT));
}

// 문장을 저장하면 머리 위로 하트가 퐁
export function popHeart() {
  window.dispatchEvent(new Event(HEART_EVENT));
}

// 잠자는 중인지는 순간 이벤트가 아니라 '상태'라서 저장소로 둔다.
// 토끼가 나중에 그려져도(useSyncExternalStore) 지금 상태를 바로 읽을 수 있다.
let sleeping = false;
const sleepListeners = new Set<() => void>();

export function setBunnySleeping(value: boolean) {
  if (sleeping === value) return;
  sleeping = value;
  sleepListeners.forEach((listener) => listener());
}

export function subscribeBunnySleeping(listener: () => void) {
  sleepListeners.add(listener);
  return () => sleepListeners.delete(listener);
}

export function isBunnySleeping() {
  return sleeping;
}

// 화면 어디서든 토스트를 띄우거나 토끼를 뛰게 하는 작은 이벤트 도우미.
// 레이아웃의 <Toast />, <HillBunny /> 가 이 이벤트를 듣는다.
export const TOAST_EVENT = "today-sentence:toast";
export const HOP_EVENT = "today-sentence:hop";

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

export function hopBunny() {
  window.dispatchEvent(new Event(HOP_EVENT));
}

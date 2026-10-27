import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

// 손그림 테두리 + 눌리는 그림자. 링크를 버튼처럼 보이게 할 때도 쓴다
export function sketchButtonClass(variant: Variant = "primary", pressed = false): string {
  const bg = pressed ? "bg-pink" : variant === "ghost" ? "bg-strip" : "bg-yellow";
  return `inline-block rounded-sketch-btn border-2 border-ink px-[22px] pt-2.5 pb-2 text-[1.15rem] text-ink shadow-[3px_3px_0_var(--ink)] transition-[translate,box-shadow] duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-default disabled:opacity-60 ${bg}`;
}

// aria-pressed 가 true 면 분홍색
export default function SketchButton({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      type="button"
      className={`${sketchButtonClass(variant, props["aria-pressed"] === true)} ${className}`}
      {...props}
    />
  );
}

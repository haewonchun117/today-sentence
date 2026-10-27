import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

// 손그림 테두리 + 눌리는 그림자 버튼. aria-pressed 가 true 면 분홍색
export default function SketchButton({ variant = "primary", className = "", ...props }: Props) {
  const bg = props["aria-pressed"] === true ? "bg-pink" : variant === "ghost" ? "bg-strip" : "bg-yellow";
  return (
    <button
      type="button"
      className={`rounded-sketch-btn border-2 border-ink px-[22px] pt-2.5 pb-2 text-[1.15rem] text-ink shadow-[3px_3px_0_var(--ink)] transition-[translate,box-shadow] duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-default disabled:opacity-60 ${bg} ${className}`}
      {...props}
    />
  );
}

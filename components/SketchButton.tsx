import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  // 처리 중: 클릭은 무시하지만 disabled 와 달리 키보드 포커스를 잃지 않는다
  busy?: boolean;
};

const SIZE: Record<Size, string> = {
  md: "px-[22px] pt-2.5 pb-2 text-[1.15rem] shadow-[3px_3px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px]",
  sm: "px-4 pt-1.5 pb-1 text-base shadow-[2px_2px_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px]",
};

// 손그림 테두리 + 눌리는 그림자. 링크를 버튼처럼 보이게 할 때도 쓴다
export function sketchButtonClass(variant: Variant = "primary", pressed = false, size: Size = "md"): string {
  const bg = pressed ? "bg-pink" : variant === "ghost" ? "bg-strip" : "bg-yellow";
  return `inline-block rounded-sketch-btn border-2 border-ink text-ink transition-[translate,box-shadow] duration-100 active:shadow-none disabled:cursor-default disabled:opacity-60 aria-disabled:cursor-progress aria-disabled:opacity-60 ${SIZE[size]} ${bg}`;
}

// aria-pressed 가 true 면 분홍색
export default function SketchButton({
  variant = "primary",
  size = "md",
  busy = false,
  className = "",
  onClick,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`${sketchButtonClass(variant, props["aria-pressed"] === true, size)} ${className}`}
      aria-disabled={busy || undefined}
      onClick={busy ? undefined : onClick}
      {...props}
    />
  );
}

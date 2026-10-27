import { categoryBg } from "@/lib/categories";
import type { Sentence } from "@/lib/types";

type Props = {
  sentence: Sentence | null;
  // 새로 뽑은 문장이면 넘기는 애니메이션
  animate?: boolean;
  // 문장이 없을 때 보여 줄 안내 문구
  placeholder?: string;
};

export default function SentenceCard({ sentence, animate = false, placeholder }: Props) {
  return (
    <div
      className={`torn flex min-h-[230px] -rotate-[0.8deg] flex-col justify-center px-[22px] pt-6 pb-7 note:px-[30px] note:pt-[30px] note:pb-[34px] ${
        animate ? "animate-flip" : ""
      }`}
    >
      {sentence ? (
        <>
          <span
            className={`rounded-sketch-tag mb-3.5 self-start border-[1.5px] border-ink px-3 py-0.5 text-[0.9rem] ${categoryBg(sentence.category.id)}`}
          >
            {sentence.category.name}
          </span>
          <p className="font-hand text-[clamp(1.7rem,6vw,2.3rem)] leading-[1.35] font-bold break-keep">
            {sentence.content}
          </p>
          <p className="mt-4 text-right font-hand text-[1.3rem] text-ink-soft">— {sentence.author}</p>
        </>
      ) : (
        <p className="text-center font-hand text-[1.35rem] text-ink-soft">{placeholder}</p>
      )}
    </div>
  );
}

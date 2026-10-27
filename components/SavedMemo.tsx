"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import SketchButton from "@/components/SketchButton";
import { MEMO_MAX_LENGTH } from "@/lib/types";

type Props = {
  sentenceContent: string;
  // 지금 저장된 메모 (없으면 빈 문자열)
  memo: string;
  // 빈 문자열이면 지운다. 성공하면 true
  onSave: (memo: string) => Promise<boolean>;
};

// 저장한 문장 하나에 붙는 '내 생각 메모': 보기 / 쓰기·수정 / 지우기
export default function SavedMemo({ sentenceContent, memo, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaId = useId();
  const counterId = useId();

  // 편집을 닫으면 사라진 입력창 대신 [수정] 또는 [메모 남기기] 버튼으로 포커스를 돌려준다
  function focusFirstButtonSoon() {
    requestAnimationFrame(() => rootRef.current?.querySelector("button")?.focus());
  }

  function startEditing() {
    setDraft(memo);
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    focusFirstButtonSoon();
  }

  async function save(next: string) {
    if (saving) return;
    if (next.trim() === memo) {
      // 바뀐 게 없으면 요청 없이 닫는다
      setEditing(false);
      focusFirstButtonSoon();
      return;
    }
    setSaving(true);
    const ok = await onSave(next);
    setSaving(false);
    if (ok) {
      setEditing(false);
      focusFirstButtonSoon();
    }
  }

  async function remove() {
    if (!window.confirm("메모를 지울까요?")) return;
    setSaving(true);
    const ok = await onSave("");
    setSaving(false);
    if (ok) focusFirstButtonSoon();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void save(draft);
    }
  }

  // 화면 읽기 프로그램에 어느 문장의 메모 버튼인지 알려 준다
  const context = <span className="sr-only">: {sentenceContent}</span>;

  if (editing) {
    return (
      <div ref={rootRef} className="mt-4">
        <label htmlFor={textareaId} className="mb-1.5 block text-[0.95rem] text-ink-soft">
          내 생각 메모
        </label>
        <textarea
          id={textareaId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={MEMO_MAX_LENGTH}
          rows={4}
          autoFocus
          readOnly={saving}
          aria-busy={saving}
          aria-describedby={counterId}
          placeholder="이 문장을 읽고 든 생각을 적어 보세요."
          className="block w-full resize-y rounded-lg border-2 border-ink bg-paper px-3 py-2 font-hand text-[1.3rem] leading-snug text-ink placeholder:text-ink-soft"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span id={counterId} className="text-[0.9rem] text-ink-soft">
            {draft.length}/{MEMO_MAX_LENGTH}자
          </span>
          <div className="flex gap-2">
            <SketchButton size="sm" variant="ghost" onClick={cancel}>
              취소
            </SketchButton>
            <SketchButton size="sm" busy={saving} onClick={() => save(draft)}>
              저장
            </SketchButton>
          </div>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div ref={rootRef} className="mt-3">
        <SketchButton size="sm" variant="ghost" onClick={startEditing}>
          메모 남기기
          {context}
        </SketchButton>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="mt-4 border-t-2 border-dashed border-line pt-3">
      <p className="text-[0.9rem] text-ink-soft">내 생각</p>
      <p className="mt-1 font-hand text-[1.3rem] leading-snug break-keep whitespace-pre-wrap">{memo}</p>
      <div className="mt-1.5 flex justify-end gap-1">
        <button
          type="button"
          onClick={startEditing}
          className="p-1 text-[0.95rem] text-ink-soft underline underline-offset-[3px]"
        >
          수정
          <span className="sr-only"> 메모{context}</span>
        </button>
        <button
          type="button"
          onClick={saving ? undefined : remove}
          aria-disabled={saving || undefined}
          className="p-1 text-[0.95rem] text-ink-soft underline underline-offset-[3px] aria-disabled:cursor-progress aria-disabled:opacity-60"
        >
          지우기
          <span className="sr-only"> 메모{context}</span>
        </button>
      </div>
    </div>
  );
}

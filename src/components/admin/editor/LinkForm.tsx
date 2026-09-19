"use client";

import { useState } from "react";

interface LinkFormProps {
  initialHref: string;
  onApply: (href: string) => void;
  onRemove: () => void;
}

/** http(s)/mailto/tel 과 사이트 내부 경로만 허용한다. 서버 sanitize와 같은 규칙이다. */
function normalizeHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  const withProtocol = /^[a-z]+:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function LinkForm({ initialHref, onApply, onRemove }: LinkFormProps) {
  const [value, setValue] = useState(initialHref);
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const href = normalizeHref(value);
    if (!href) {
      setError("http(s), mailto, tel 주소 또는 /로 시작하는 경로만 사용할 수 있습니다.");
      return;
    }
    onApply(href);
  };

  // 공지 작성 <form> 안에 들어가므로 중첩 form 대신 Enter 키를 직접 처리한다.
  return (
    <div className="w-[300px]">
      <label htmlFor="editor-link-href" className="text-[12px] font-bold text-ink-soft">
        링크 주소
      </label>
      <input
        id="editor-link-href"
        type="text"
        inputMode="url"
        autoFocus
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setError(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            apply();
          }
        }}
        placeholder="https://example.com"
        className="mt-1.5 h-10 w-full rounded-[10px] border border-line-soft px-3 text-caption focus:border-primary-400 focus:outline-2 focus:outline-primary-100"
      />
      {error && <p className="mt-1.5 text-[12px] font-bold text-note-pink-ink">{error}</p>}
      <p className="mt-1.5 text-[11px] text-ink-muted">글자를 선택한 뒤 적용하면 해당 글자에 링크가 걸립니다.</p>
      <div className="mt-3 flex justify-end gap-1.5">
        {initialHref && (
          <button type="button" onClick={onRemove} className="h-8 rounded-[8px] px-3 text-[12px] font-bold text-[#c2255c] hover:bg-note-pink">
            링크 해제
          </button>
        )}
        <button type="button" onClick={apply} className="h-8 rounded-[8px] bg-primary-600 px-3 text-[12px] font-bold text-white hover:bg-primary-700">
          적용
        </button>
      </div>
    </div>
  );
}

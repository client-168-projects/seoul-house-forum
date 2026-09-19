"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const CHANGE_EVENT = "shf-cooldown-change";

function readStoredDeadline(storageKey: string): number {
  try {
    return Number(window.localStorage.getItem(storageKey)) || 0;
  } catch {
    return 0;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * 재등록 대기 카운트다운. 새로고침해도 대기 시간이 초기화되지 않도록 마감 시각을 localStorage에 둔다.
 * 저장이 막힌 환경에서는 메모리 값으로 동작한다. 실제 차단은 서버(IP 기준)가 하고, 이 훅은 버튼 표시만 담당한다.
 */
export function useCooldown(storageKey: string) {
  const storedDeadline = useSyncExternalStore(
    subscribe,
    () => readStoredDeadline(storageKey),
    () => 0,
  );
  const [memoryDeadline, setMemoryDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const deadline = Math.max(storedDeadline, memoryDeadline);

  useEffect(() => {
    if (deadline <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const start = useCallback(
    (seconds: number) => {
      const next = Date.now() + seconds * 1000;
      setMemoryDeadline(next);
      setNow(Date.now());
      try {
        window.localStorage.setItem(storageKey, String(next));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        // 저장이 막혀도 메모리 값으로 현재 화면의 카운트다운은 동작한다.
      }
    },
    [storageKey],
  );

  const remainingSeconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  return { remainingSeconds, isCoolingDown: remainingSeconds > 0, start };
}

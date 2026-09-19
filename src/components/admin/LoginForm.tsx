"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-10 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-username" className="text-caption font-bold text-ink-soft">
          아이디
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={40}
          defaultValue={state.username}
          className="h-12 rounded-[12px] border border-line-soft px-4 text-body focus:border-primary-500 focus:outline-2 focus:outline-primary-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="text-caption font-bold text-ink-soft">
          비밀번호
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={200}
          className="h-12 rounded-[12px] border border-line-soft px-4 text-body focus:border-primary-500 focus:outline-2 focus:outline-primary-200"
        />
      </div>

      {state.message && (
        <p role="alert" className="rounded-[10px] bg-note-pink px-3 py-2.5 text-caption font-bold text-note-pink-ink">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-2 h-12 rounded-[12px] bg-primary-600 text-body font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:bg-primary-400"
      >
        {pending ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
}

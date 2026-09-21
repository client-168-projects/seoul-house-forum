"use client";

import { useActionState } from "react";
import { changePassword, type PasswordFormState } from "@/app/admin/(panel)/account/actions";
import { cn } from "@/utils/cn";

const FIELDS = [
  { name: "currentPassword", label: "현재 비밀번호", autoComplete: "current-password" },
  { name: "newPassword", label: "새 비밀번호", autoComplete: "new-password" },
  { name: "confirmPassword", label: "새 비밀번호 확인", autoComplete: "new-password" },
] as const;

export function PasswordChangeForm() {
  const [state, action, pending] = useActionState<PasswordFormState, FormData>(changePassword, {});

  return (
    <form action={action} className="mt-5 flex flex-col gap-4" key={state.status === "success" ? "reset" : "form"}>
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label htmlFor={field.name} className="text-caption font-bold text-ink-soft">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="password"
            required
            maxLength={200}
            autoComplete={field.autoComplete}
            className="h-12 max-w-[360px] rounded-[12px] border border-line-soft px-4 text-body focus:border-primary-500 focus:outline-2 focus:outline-primary-100"
          />
        </div>
      ))}

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "max-w-[480px] rounded-[10px] px-3 py-2.5 text-caption font-bold",
            state.status === "error" ? "bg-note-pink text-note-pink-ink" : "bg-note-green text-note-green-ink",
          )}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 w-[180px] rounded-full bg-primary-600 text-body font-bold text-white hover:bg-primary-700 disabled:cursor-wait disabled:bg-primary-400"
      >
        {pending ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}

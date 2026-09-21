import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { ADMIN_SESSION_TTL_HOURS } from "@/constants/auth";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { formatDateTime } from "@/utils/date";

export const metadata: Metadata = { title: "계정 설정" };

export default async function AdminAccountPage() {
  const session = await verifyAdmin();

  return (
    <div className="mx-auto max-w-[720px]">
      <AdminPageHeader eyebrow="ACCOUNT" title="계정 설정" />

      <section className="mt-8 rounded-[20px] bg-white p-6 ring-1 ring-primary-100 lg:p-8">
        <h2 className="text-body font-extrabold text-ink">계정 정보</h2>
        <dl className="mt-4 flex flex-col gap-3 text-caption">
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-ink-muted">아이디</dt>
            <dd className="font-bold text-ink">{session.username}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-ink-muted">권한</dt>
            <dd className="text-ink">관리자</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-ink-muted">최근 로그인</dt>
            <dd className="text-ink">{session.lastLoginAt ? formatDateTime(session.lastLoginAt) : "기록 없음"}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-ink-muted">로그인 유지</dt>
            <dd className="text-ink">{ADMIN_SESSION_TTL_HOURS}시간 (이후 자동 로그아웃)</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-[20px] bg-white p-6 ring-1 ring-primary-100 lg:p-8">
        <h2 className="text-body font-extrabold text-ink">비밀번호 변경</h2>
        <p className="mt-1 text-caption text-ink-muted">
          영문, 숫자, 특수문자를 포함해 12자 이상으로 정해 주세요. 변경하면 다른 기기의 로그인은 모두 해제됩니다.
        </p>
        <PasswordChangeForm />
      </section>
    </div>
  );
}

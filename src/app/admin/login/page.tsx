import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "로그인" };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getSession()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_560px]">
      <section className="relative hidden overflow-hidden bg-primary-950 lg:flex lg:flex-col lg:p-14">
        <Image src="/images/hero/logos/logo-white.svg" alt="2026 서울주거포럼" width={123} height={44} priority />
        <div className="relative z-10 mt-[12vh]">
          <p className="text-caption font-bold tracking-[0.2em] text-accent">ADMIN CONSOLE</p>
          <p className="mt-4 font-heading text-[40px] leading-[1.25] font-bold text-white">
            포럼의 소식과
            <br />
            시민의 목소리를 관리합니다.
          </p>
        </div>
        <Image
          src="/images/hero/main-hero-asset.svg"
          alt=""
          width={766}
          height={512}
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-24 w-[640px] opacity-25"
        />
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[380px]">
          <Image
            src="/images/hero/logos/logo-purple.svg"
            alt="2026 서울주거포럼"
            width={123}
            height={44}
            className="lg:hidden"
          />
          <h1 className="mt-8 font-heading text-[28px] font-bold text-primary-950 lg:mt-0">관리자 로그인</h1>
          <p className="mt-2 text-body text-ink-muted">승인된 운영자 계정으로만 접근할 수 있습니다.</p>
          <LoginForm next={typeof next === "string" ? next : ""} />
        </div>
      </section>
    </main>
  );
}

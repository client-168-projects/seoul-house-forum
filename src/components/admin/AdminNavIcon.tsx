import type { AdminNavIcon as AdminNavIconName } from "@/constants/adminNav";

const PATHS: Record<AdminNavIconName, string> = {
  dashboard: "M4 19V10M10 19V5M16 19v-7M22 19H2",
  notice: "M4 10v4a1 1 0 001 1h2l5 4V5L7 9H5a1 1 0 00-1 1zM16 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12",
  board: "M5 4h14a1 1 0 011 1v10a1 1 0 01-1 1h-6l-4 4v-4H5a1 1 0 01-1-1V5a1 1 0 011-1zM8 9h8M8 12h5",
};

export function AdminNavIcon({ name, className }: { name: AdminNavIconName; className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

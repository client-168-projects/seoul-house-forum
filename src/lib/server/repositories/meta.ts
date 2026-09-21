import "server-only";
import { getDb } from "@/lib/server/cloudflare";

/**
 * 주기 작업을 여러 요청이 동시에 돌리지 않도록 D1에 마지막 실행 시각을 남긴다.
 * UPDATE의 WHERE 조건으로 선점하므로, 동시에 들어온 요청 중 하나만 true를 받는다.
 */
export async function claimPeriodicTask(key: string, minIntervalMs: number): Promise<boolean> {
  const now = new Date();
  const threshold = new Date(now.getTime() - minIntervalMs).toISOString();

  const result = await getDb()
    .prepare(
      `INSERT INTO app_meta (key, value, updated_at) VALUES (?1, ?2, ?2)
       ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?2 WHERE app_meta.updated_at < ?3`,
    )
    .bind(key, now.toISOString(), threshold)
    .run();

  return result.meta.changes > 0;
}

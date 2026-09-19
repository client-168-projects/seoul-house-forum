import { NOTE_MAX_TILT_DEG, NOTE_MIN_TILT_DEG } from "@/constants/board";

/**
 * 게시글 id로 결정되는 의사 난수 기울기.
 * Math.random을 쓰면 렌더마다 쪽지가 흔들리고 SSR/CSR 값이 어긋나므로 id로 고정한다.
 *
 * 방향은 Thue-Morse 수열(id 비트 수의 홀짝)로 정한다. 같은 방향이 최대 2번까지만 이어지고
 * 주기가 없어서, 그리드 열 수가 몇이든 한 열이 한쪽으로만 쏠리지 않는다.
 * 각도 크기만 해시로 흩뿌리고, 최소값을 둬서 거의 수평인 쪽지가 섞이지 않게 한다.
 */
export function getNoteTilt(id: number): number {
  const direction = countSetBits(id) % 2 === 0 ? 1 : -1;
  const hash = Math.sin(id * 12.9898 + 78.233) * 43758.5453;
  const unit = hash - Math.floor(hash);
  const magnitude = NOTE_MIN_TILT_DEG + unit * (NOTE_MAX_TILT_DEG - NOTE_MIN_TILT_DEG);
  return Number((direction * magnitude).toFixed(2));
}

function countSetBits(value: number): number {
  let count = 0;
  for (let remaining = value; remaining > 0; remaining >>= 1) count += remaining & 1;
  return count;
}

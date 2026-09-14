export const DEMO_BROADCAST_DURATION_SECONDS = 78 * 60;

export function getDemoLivePosition(
  nowMs: number,
  durationSeconds = DEMO_BROADCAST_DURATION_SECONDS,
) {
  if (!Number.isFinite(nowMs) || durationSeconds <= 0) return 0;

  return Math.floor(nowMs / 1000) % durationSeconds;
}
export function formatLivePosition(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

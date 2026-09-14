export const DEMO_ADMISSION_DURATION_MS = 4_800;
export const DEMO_INITIAL_POSITION = 1_284;

export type AdmissionScenario = "healthy" | "surge" | "dependency-failure";

export type AdmissionDecision =
  | { status: "admitted"; passId: string }
  | {
      status: "queued";
      queueToken: string;
      peopleAhead: number;
      pollAfterMs: number;
    }
  | { status: "degraded"; retryAfterSeconds: number };

export type QueueProgress =
  | { status: "queued"; peopleAhead: number; pollAfterMs: number }
  | { status: "admitted"; passId: string };

function compactId(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").slice(-10) || "guest";
}

export function decideAdmission(
  eventId: string,
  idempotencyKey: string,
  scenario: AdmissionScenario,
  nowMs: number,
): AdmissionDecision {
  if (scenario === "dependency-failure") {
    return { status: "degraded", retryAfterSeconds: 3 };
  }

  if (scenario === "healthy") {
    return { status: "admitted", passId: `pass-${compactId(idempotencyKey)}` };
  }

  return {
    status: "queued",
    queueToken: `demo.${compactId(eventId)}.${nowMs}.${DEMO_INITIAL_POSITION}.${compactId(idempotencyKey)}`,
    peopleAhead: DEMO_INITIAL_POSITION,
    pollAfterMs: 800,
  };
}

export function readQueueProgress(queueToken: string, nowMs: number): QueueProgress | undefined {
  const [version, eventId, issuedAtValue, positionValue, requestId] = queueToken.split(".");
  const issuedAt = Number(issuedAtValue);
  const initialPosition = Number(positionValue);

  if (
    version !== "demo" ||
    !eventId ||
    !requestId ||
    !Number.isFinite(issuedAt) ||
    !Number.isFinite(initialPosition)
  ) {
    return undefined;
  }

  const elapsed = Math.max(0, nowMs - issuedAt);
  if (elapsed >= DEMO_ADMISSION_DURATION_MS) {
    return { status: "admitted", passId: `pass-${requestId}` };
  }

  const completion = elapsed / DEMO_ADMISSION_DURATION_MS;
  return {
    status: "queued",
    peopleAhead: Math.max(1, Math.ceil(initialPosition * (1 - completion))),
    pollAfterMs: 800,
  };
}

import { describe, expect, it } from "vitest";
import {
  DEMO_ADMISSION_DURATION_MS,
  decideAdmission,
  readQueueProgress,
} from "./admission";

describe("demo admission contract", () => {
  it("admits immediately when capacity is healthy", () => {
    expect(decideAdmission("event-1", "request-123", "healthy", 1_000)).toEqual({
      status: "admitted",
      passId: "pass-request123",
    });
  });

  it("places a surge request in the queue and eventually admits it", () => {
    const decision = decideAdmission("event-1", "request-123", "surge", 1_000);
    expect(decision.status).toBe("queued");
    if (decision.status !== "queued") return;

    expect(readQueueProgress(decision.queueToken, 1_800)).toMatchObject({
      status: "queued",
    });
    expect(
      readQueueProgress(decision.queueToken, 1_000 + DEMO_ADMISSION_DURATION_MS),
    ).toEqual({ status: "admitted", passId: "pass-request123" });
  });

  it("returns a retryable degraded response for a dependency failure", () => {
    expect(decideAdmission("event-1", "request-123", "dependency-failure", 1_000)).toEqual({
      status: "degraded",
      retryAfterSeconds: 3,
    });
  });

  it("rejects malformed queue tokens", () => {
    expect(readQueueProgress("not-a-token", 1_000)).toBeUndefined();
  });
});

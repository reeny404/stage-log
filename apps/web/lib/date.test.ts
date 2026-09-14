import { describe, expect, it } from "vitest";
import { formatSchedule } from "./date";

describe("formatSchedule", () => {
  it("converts a UTC schedule into the requested timezone", () => {
    expect(formatSchedule("2026-09-20T11:00:00.000Z", "en-US", "Asia/Seoul")).toContain(
      "8:00 PM",
    );
  });
});

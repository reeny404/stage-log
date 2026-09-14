import { describe, expect, it } from "vitest";
import { formatLivePosition, getDemoLivePosition } from "./live";

describe("demo live timeline", () => {
  it("keeps viewers on the same wall-clock position", () => {
    expect(getDemoLivePosition(65_000, 60)).toBe(5);
    expect(getDemoLivePosition(125_000, 60)).toBe(5);
  });

  it("formats a broadcast position as a player timecode", () => {
    expect(formatLivePosition(3_725)).toBe("01:02:05");
  });

  it("falls back safely for an invalid duration", () => {
    expect(getDemoLivePosition(65_000, 0)).toBe(0);
  });
});

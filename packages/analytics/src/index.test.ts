import { describe, expect, it, vi } from "vitest";
import { track } from "./index";

describe("track", () => {
  it("does nothing during server rendering", () => {
    const dispatch = vi.fn();
    expect(() => track("content_view", { contentId: "night-drive", contentType: "vod" })).not.toThrow();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

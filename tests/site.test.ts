import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/site";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/dashboard/items")).toBe("/dashboard/items");
    expect(safeNext("/items?tab=done#top")).toBe("/items?tab=done#top");
  });

  it("falls back to default path when there is nowhere to go", () => {
    expect(safeNext(null)).toBe("/");
    expect(safeNext("")).toBe("/");
    expect(safeNext(null, "/dashboard")).toBe("/dashboard");
  });

  it("refuses anything that leads to another site", () => {
    for (const value of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/\t/evil.example",
      "/\n/evil.example",
      "javascript:alert(1)",
    ]) {
      expect(safeNext(value)).toBe("/");
    }
  });

  it("never sends a signed-in user back to the sign-in page", () => {
    expect(safeNext("/sign-in")).toBe("/");
    expect(safeNext("/sign-in?mode=sign-up")).toBe("/");
    expect(safeNext("/sign-in-help")).toBe("/sign-in-help");
  });
});

import { describe, expect, it } from "vitest";
import { isPublicRoute, normalizedPathname } from "../lib/routes";

describe("public routes", () => {
  it.each(["/auth", "/privacy", "/privacy/", "/legal", "/legal/"])(
    "allows %s without authentication",
    (path) => expect(isPublicRoute(path)).toBe(true),
  );

  it("keeps application pages protected", () => {
    expect(isPublicRoute("/profile")).toBe(false);
    expect(isPublicRoute("/chat/")).toBe(false);
  });

  it("normalizes trailing slashes", () => {
    expect(normalizedPathname("/legal/")).toBe("/legal");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../lib/api";
import { isPublicRoute, normalizedPathname } from "../lib/routes";
import {
  clearCachedSession, hasCachedSession, storeSession,
  resetSessionValidationForTests, validateSession,
} from "../lib/session";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

afterEach(() => { vi.useRealTimers(); resetSessionValidationForTests(); });

describe("startup session gate", () => {
  it("treats trailing-slash auth exports as public routes", () => {
    expect(normalizedPathname("/auth/")).toBe("/auth");
    expect(isPublicRoute("/auth/")).toBe(true);
    expect(isPublicRoute("/register/")).toBe(true);
    expect(isPublicRoute("/auth/callback/")).toBe(true);
    expect(isPublicRoute("/")).toBe(false);
  });

  it("no local session selects auth immediately without a session fetch", () => {
    const local = storage();
    const request = vi.fn();
    expect(hasCachedSession(local)).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it("valid cached session selects shell immediately and resolves", async () => {
    const local = storage();
    storeSession({ accessToken: "at", refreshToken: "rt" }, local);
    expect(hasCachedSession(local)).toBe(true);
    await expect(validateSession(() => Promise.resolve({}))).resolves.toBe("valid");
  });

  it("401 and timeout never hang and return auth", async () => {
    await expect(validateSession(() => Promise.reject(new ApiError(401, "UNAUTHORIZED", "no"))))
      .resolves.toBe("unauthorized");
    resetSessionValidationForTests();
    vi.useFakeTimers();
    const result = validateSession((signal) => new Promise((_, reject) => {
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }), 10);
    await vi.advanceTimersByTimeAsync(10);
    await expect(result).resolves.toBe("timeout");
    const local = storage(); storeSession({ accessToken: "at", refreshToken: "rt" }, local); clearCachedSession(local);
    expect(hasCachedSession(local)).toBe(false);
  });

  it("deduplicates concurrent session requests", async () => {
    let resolve!: () => void;
    const request = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const first = validateSession(request);
    const second = validateSession(request);
    expect(second).toBe(first);
    expect(request).toHaveBeenCalledTimes(1);
    resolve();
    await expect(first).resolves.toBe("valid");
  });
});

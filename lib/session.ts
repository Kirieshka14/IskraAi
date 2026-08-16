import { apiRequest, ApiError } from "./api";

const SESSION_HINT_KEY = "iskra-session-confirmed";
export const SESSION_TIMEOUT_MS = 4_000;

export type SessionResult = "valid" | "unauthorized" | "timeout" | "error";
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type SessionRequest = (signal: AbortSignal) => Promise<unknown>;

let inFlight: Promise<SessionResult> | null = null;

function browserStorage(): StorageLike | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

export function hasCachedSession(storage: StorageLike | null = browserStorage()): boolean {
  try { return storage?.getItem(SESSION_HINT_KEY) === "1"; }
  catch { return false; }
}

export function cacheSession(storage: StorageLike | null = browserStorage()): void {
  try { storage?.setItem(SESSION_HINT_KEY, "1"); } catch { /* storage may be unavailable */ }
}

export function clearCachedSession(storage: StorageLike | null = browserStorage()): void {
  try { storage?.removeItem(SESSION_HINT_KEY); } catch { /* storage may be unavailable */ }
}

async function pointsSessionRequest(signal: AbortSignal): Promise<unknown> {
  return apiRequest("/api/points", { signal });
}

export function validateSession(
  request: SessionRequest = pointsSessionRequest,
  timeoutMs = SESSION_TIMEOUT_MS,
): Promise<SessionResult> {
  if (inFlight) return inFlight;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);

  const promise = request(controller.signal)
    .then((): SessionResult => "valid")
    .catch((error: unknown): SessionResult => {
      if (timedOut || (error instanceof DOMException && error.name === "AbortError")) return "timeout";
      if (error instanceof ApiError && error.status === 401) return "unauthorized";
      return "error";
    })
    .finally(() => {
      clearTimeout(timer);
      if (inFlight === promise) inFlight = null;
    });

  inFlight = promise;
  return promise;
}

export function resetSessionValidationForTests(): void { inFlight = null; }

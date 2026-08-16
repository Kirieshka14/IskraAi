import { apiRequest, ApiError } from "./api";
import { clearCachedSession, getStoredSession, hasCachedSession, storeSession, type StoredSession } from "./auth-tokens";

export { clearCachedSession, getStoredSession, hasCachedSession, storeSession };
export type { StoredSession };

export const SESSION_TIMEOUT_MS = 4_000;
export type SessionResult = "valid" | "unauthorized" | "timeout" | "error";
type SessionRequest = (signal: AbortSignal) => Promise<unknown>;

let inFlight: Promise<SessionResult> | null = null;

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

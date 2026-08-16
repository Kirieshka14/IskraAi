export type StoredSession = { accessToken: string; refreshToken: string; userId?: string; email?: string };
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const TOKENS_KEY = "iskra-session";

function browserStorage(): StorageLike | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

export function getStoredSession(storage: StorageLike | null = browserStorage()): StoredSession | null {
  try {
    const raw = storage?.getItem(TOKENS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return parsed?.accessToken && parsed?.refreshToken ? parsed : null;
  } catch { return null; }
}

export function storeSession(session: StoredSession, storage: StorageLike | null = browserStorage()): void {
  try { storage?.setItem(TOKENS_KEY, JSON.stringify(session)); } catch { /* storage may be unavailable */ }
}

export function hasCachedSession(storage: StorageLike | null = browserStorage()): boolean {
  return getStoredSession(storage) !== null;
}

export function clearCachedSession(storage: StorageLike | null = browserStorage()): void {
  try { storage?.removeItem(TOKENS_KEY); } catch { /* storage may be unavailable */ }
}

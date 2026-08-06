import type { Bot, Message, ResponseSize, SubscriptionPlan, UserProfile } from "./types";

export interface RegisterInput { email: string; password: string; displayName: string; isAdultConfirmed: true; termsAccepted: true; newsletterOptIn: boolean; captchaToken: string; }
export interface CreateBotInput { name: string; description: string; systemPrompt: string; genre: Bot["genre"]; avatarUrl?: string | null; }
export interface SendMessageInput { conversationId: string; content: string; responseSize: ResponseSize; operationKey: string; regenerateMessageId?: string; }
export type PendingBot = { id: string; name: string; description: string | null; system_prompt: string; genre: string; author_id: string; author_display_name: string | null; created_at: string; };
export class ApiError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }

type ApiEnvelope<T> = { data: T } | T;
type ApiFailure = { error?: { code?: string; message?: string } };

export function getApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(getApiUrl(path), { ...init, headers, credentials: "include", cache: init.cache ?? "no-store" });
  const payload = await response.json().catch(() => null) as (ApiEnvelope<T> & ApiFailure) | null;
  if (!response.ok) throw new ApiError(response.status, payload?.error?.code ?? "API_ERROR", payload?.error?.message ?? "Не удалось выполнить запрос");
  if (payload && typeof payload === "object" && "data" in payload) return payload.data as T;
  return payload as T;
}

export class HttpApiClient {
  getBots = () => apiRequest<Bot[]>("/api/bots");
  getBot = (id: string) => apiRequest<Bot>(`/api/bots/${id}`);
  getProfile = () => apiRequest<UserProfile>("/api/profile");
  register = (input: RegisterInput) => apiRequest<UserProfile>("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
  createBot = (input: CreateBotInput) => apiRequest<Bot>("/api/bots", { method: "POST", body: JSON.stringify(input) });
  sendMessage = (input: SendMessageInput) => apiRequest<Message>(`/api/conversations/${input.conversationId}/messages`, { method: "POST", body: JSON.stringify(input) });
  getPlans = () => apiRequest<SubscriptionPlan[]>("/api/plans");
}

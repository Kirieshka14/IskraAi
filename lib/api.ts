import type { Genre, Message, ResponseSize, SubscriptionPlan, UserProfile } from "./types";

export class ApiError extends Error {
  constructor(public status:number, public code:string, message:string){ super(message); }
}

export function getApiUrl(path:string){
  const base=process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/,"");
  if(!base) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  return `${base}${path.startsWith("/")?path:`/${path}`}`;
}

export async function apiRequest<T>(path:string,init:RequestInit={}):Promise<T>{
  const headers=new Headers(init.headers);
  if(init.body && !(init.body instanceof FormData)) headers.set("content-type","application/json");
  let response:Response;
  try{response=await fetch(getApiUrl(path),{...init,headers,credentials:"include",cache:"no-store",signal:AbortSignal.any([init.signal,AbortSignal.timeout(60_000)].filter(Boolean) as AbortSignal[])});}catch(error){if(error instanceof DOMException&&error.name==="TimeoutError")throw new ApiError(504,"API_TIMEOUT","Сервер долго не отвечает. Попробуйте ещё раз.");throw error;}
  const payload=await response.json().catch(()=>null);
  if(!response.ok) throw new ApiError(response.status,payload?.error?.code??"API_ERROR",payload?.error?.message??"Не удалось выполнить запрос");
  return (payload?.data??payload) as T;
}

export interface ApiBot {
  id:string; name:string; description:string|null; genre:Genre; avatar_url:string|null;
  likes_count:number; author_id:string; moderation_status:"approved";
}
export interface Conversation {
  id:string; bot_id:string; created_at:string; last_message_at:string;
  bots?:{name:string;avatar_url:string|null;genre:Genre}|Array<{name:string;avatar_url:string|null;genre:Genre}>|null;
}
export interface Points { remaining:number; total:number; resetsAt:string }
export type PendingBot={id:string;name:string;description:string|null;system_prompt:string;genre:string;author_id:string;author_display_name:string|null;created_at:string};

export class HttpApiClient {
  requestOtp=(x:{email:string;purpose:"register"|"login";captchaToken:string})=>apiRequest<{ok:true}>("/api/auth/otp/request",{method:"POST",body:JSON.stringify(x)});
  verifyOtp=(x:unknown)=>apiRequest<UserProfile>("/api/auth/otp/verify",{method:"POST",body:JSON.stringify(x)});
  getBots=()=>apiRequest<ApiBot[]>("/api/bots");
  createBot=(x:unknown)=>apiRequest<ApiBot>("/api/bots",{method:"POST",body:JSON.stringify(x)});
  getProfile=()=>apiRequest<UserProfile>("/api/profile");
  getPlans=()=>apiRequest<SubscriptionPlan[]>("/api/plans");
  getPoints=()=>apiRequest<Points>("/api/points");
  getConversations=()=>apiRequest<Conversation[]>("/api/conversations");
  createConversation=(botId:string)=>apiRequest<Conversation>("/api/conversations",{method:"POST",body:JSON.stringify({botId})});
  getMessages=(conversationId:string)=>apiRequest<Message[]>(`/api/conversations/${conversationId}/messages`);
  sendMessage=(x:{conversationId:string;content:string;responseSize:ResponseSize;operationKey:string})=>apiRequest<{userMessage:Message;assistantMessage:Message;remaining:number}>(`/api/conversations/${x.conversationId}/messages`,{method:"POST",body:JSON.stringify(x)});
}

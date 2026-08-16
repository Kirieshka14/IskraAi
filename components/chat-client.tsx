"use client";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { ArrowLeft,RefreshCw,Send } from "lucide-react";
import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import type { Message,ResponseSize } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ApiError,HttpApiClient,type ApiBot } from "@/lib/api";
import { canSendMessage,remainingAfterSuccessfulReply } from "@/lib/chat-state";

const api=new HttpApiClient();
const sizes:{id:ResponseSize;label:string}[]=[{id:"small",label:"Маленький"},{id:"medium",label:"Средний"},{id:"large",label:"Большой"}];
const time=(value:string)=>new Date(value).toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});

export function ChatClient(){
  const search=useSearchParams(),router=useRouter(),botId=search.get("bot");
  const [bot,setBot]=useState<ApiBot|null>(null),[conversationId,setConversationId]=useState<string|null>(null);
  const [size,setSize]=useState<ResponseSize>("medium"),[text,setText]=useState(""),[msgs,setMsgs]=useState<Message[]>([]);
  const [remaining,setRemaining]=useState<number|null>(null),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);
  const bottom=useRef<HTMLDivElement>(null);
  const allowed=canSendMessage(remaining,busy,text);

  const load=useCallback(async()=>{
    if(!botId){setError("Персонаж не выбран");setLoading(false);return}
    setLoading(true);setError(null);
    try{
      const [bots,points,conversations]=await Promise.all([api.getBots(),api.getPoints(),api.getConversations()]);
      const selected=bots.find(item=>item.id===botId);
      if(!selected) throw new Error("Персонаж недоступен");
      setBot(selected);setRemaining(points.remaining);
      let conversation=conversations.find(item=>item.bot_id===botId)??null;
      if(!conversation) conversation=await api.createConversation(botId);
      setConversationId(conversation.id);
      setMsgs(await api.getMessages(conversation.id));
    }catch(value){
      if(value instanceof ApiError&&value.status===401){router.replace(`/auth?next=${encodeURIComponent(`/chat/?bot=${botId}`)}`);return}
      setError(value instanceof Error?value.message:"Не удалось открыть диалог");
    }finally{setLoading(false)}
  },[botId,router]);

  useEffect(()=>{void load()},[load]);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"})},[msgs,busy]);

  async function send(){
    const content=text.trim();
    if(!conversationId||!canSendMessage(remaining,busy,content))return;
    setBusy(true);setError(null);
    try{
      const result=await api.sendMessage({conversationId,content,responseSize:size,operationKey:crypto.randomUUID()});
      if(!result.assistantMessage?.content?.trim())throw new Error("Сервер не вернул содержательный ответ");
      setMsgs(previous=>[...previous,result.userMessage,result.assistantMessage]);
      setRemaining(current=>remainingAfterSuccessfulReply(current??0,result));
      setText("");
    }catch(value){
      const message=value instanceof ApiError&&(value.status===402||value.status===429)?"Дневной лимит сообщений исчерпан":value instanceof Error?value.message:"Не удалось отправить сообщение";
      setError(message);
    }finally{setBusy(false)}
  }

  const initials=useMemo(()=>bot?.name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase()??"ИИ",[bot]);
  if(loading)return <main className="grid min-h-[60vh] place-items-center"><p>Загружаем диалог…</p></main>;
  if(!bot)return <main className="mx-auto max-w-xl px-4 py-16 text-center"><p className="font-bold">{error??"Диалог недоступен"}</p><Link className="mt-5 inline-block text-ember" href="/">Вернуться к персонажам</Link></main>;
  return <main className="mx-auto flex h-[calc(100vh-65px)] max-w-6xl flex-col bg-white lg:my-5 lg:h-[calc(100vh-106px)] lg:rounded-2xl lg:border lg:border-stone-200 lg:shadow-soft">
    <header className="flex items-center gap-3 border-b border-stone-200 p-3 sm:p-4"><Link href="/" className="grid size-11 place-items-center rounded-lg hover:bg-stone-100"><ArrowLeft size={19}/></Link><div className="grid size-10 place-items-center rounded-full bg-[#d9a07d] text-sm font-black text-white">{initials}</div><div><h1 className="text-sm font-bold sm:text-base">{bot.name}</h1><p className="text-xs text-stone-500">{bot.genre}</p></div></header>
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8"><div className="mx-auto max-w-3xl"><div className="mb-8 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-[#d9a07d] text-xl font-black text-white">{initials}</div><h2 className="mt-3 font-bold">История с {bot.name}</h2><p className="mx-auto mt-1 max-w-md text-xs leading-5 text-stone-500">{bot.description}</p></div><div className="grid gap-5">{msgs.map((m,i)=><div key={m.id} className={cn("group max-w-[92%] sm:max-w-[75%]",m.sender==="user"&&"ml-auto")}><div className={cn("whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6",m.sender==="user"?"rounded-br-md bg-ink text-white":"rounded-bl-md bg-stone-100 text-stone-800")}>{m.content}</div><div className={cn("mt-1 flex items-center gap-2 px-1 text-[10px] text-stone-400",m.sender==="user"&&"justify-end")}>{time(m.createdAt??(m as unknown as {created_at:string}).created_at)}{m.sender==="assistant"&&i===msgs.length-1&&<span className="flex items-center gap-1"><RefreshCw size={11}/>ответ</span>}</div></div>)}{busy&&<div className="max-w-[75%] rounded-2xl rounded-bl-md bg-stone-100 px-4 py-3 text-sm text-stone-500">Персонаж отвечает…</div>}<div ref={bottom}/></div></div></div>
    <footer className="border-t border-stone-200 bg-paper p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:p-4"><div className="mx-auto max-w-3xl"><div className="scrollbar-none mb-2 flex items-center gap-1 overflow-x-auto"><span className="mr-2 whitespace-nowrap text-xs font-semibold text-stone-500">Размер ответа</span>{sizes.map(s=><button key={s.id} onClick={()=>setSize(s.id)} disabled={busy||remaining===0} className={cn("min-h-11 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold",size===s.id?"bg-ink text-white":"bg-white text-stone-600")}>{s.label}</button>)}<span className="ml-auto whitespace-nowrap text-xs font-bold text-moss">{remaining??"—"} сообщений</span></div><div className="flex items-end gap-2 rounded-2xl border border-stone-300 bg-white p-2 focus-within:border-ember"><textarea disabled={busy||remaining===0} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void send()}}} rows={1} className="max-h-32 min-h-10 flex-1 border-0 px-2 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-white disabled:text-stone-400" placeholder={remaining===0?"Лимит сообщений исчерпан":"Что вы сделаете или скажете?"}/><button onClick={()=>void send()} disabled={!allowed} aria-label="Отправить сообщение" className="grid size-10 shrink-0 place-items-center rounded-xl bg-ember text-white disabled:cursor-not-allowed disabled:bg-stone-300"><Send size={17}/></button></div>{error&&<p role="alert" className="mt-2 text-center text-xs text-red-700">{error}</p>}<p className="mt-1 text-center text-[10px] text-stone-400">Лимит уменьшается только после успешного ответа.</p></div></footer>
  </main>;
}

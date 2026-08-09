import { Suspense } from "react";
import { ChatClient } from "@/components/chat-client";
export default function ChatPage(){return <Suspense fallback={<main className="grid min-h-[60vh] place-items-center"><p>Загружаем диалог…</p></main>}><ChatClient/></Suspense>}

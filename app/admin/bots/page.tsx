"use client";

import { useEffect, useState } from "react";
import { BotModerationQueue } from "@/components/admin/bot-moderation-queue";
import { ApiError, apiRequest, type PendingBot } from "@/lib/api";

type State = { status: "loading" | "ready" | "unauthorized" | "forbidden" | "error"; bots: PendingBot[]; message?: string };

export default function AdminBotsPage() {
  const [state, setState] = useState<State>({ status: "loading", bots: [] });
  useEffect(() => {
    let active = true;
    apiRequest<PendingBot[]>("/api/admin/bots")
      .then(bots => { if (active) setState({ status: "ready", bots }); })
      .catch(error => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) setState({ status: "unauthorized", bots: [] });
        else if (error instanceof ApiError && error.status === 403) setState({ status: "forbidden", bots: [] });
        else setState({ status: "error", bots: [], message: error instanceof Error ? error.message : "Не удалось загрузить очередь" });
      });
    return () => { active = false; };
  }, []);

  return <main className="mx-auto max-w-6xl px-4 py-7 sm:py-10 md:px-6">
    <div className="mb-8"><span className="text-sm font-bold uppercase tracking-[.18em] text-ember">Администрирование</span><h1 className="display mt-2 text-3xl sm:text-4xl font-semibold">Модерация ботов</h1><p className="mt-2 text-sm text-stone-500">Права проверяет backend; frontend только отображает результат.</p></div>
    {state.status === "loading" && <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">Загрузка очереди…</p>}
    {state.status === "unauthorized" && <p role="alert" className="rounded-2xl border border-stone-300 bg-stone-100 p-8 text-center">Войдите в аккаунт, чтобы открыть этот экран.</p>}
    {state.status === "forbidden" && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">Backend отклонил доступ: требуются права администратора.</p>}
    {state.status === "error" && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">{state.message}</p>}
    {state.status === "ready" && <BotModerationQueue initialBots={state.bots} />}
  </main>;
}

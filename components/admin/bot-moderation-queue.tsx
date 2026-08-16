"use client";

import { useState } from "react";
import { apiRequest, type PendingBot } from "@/lib/api";

const genreLabels: Record<string, string> = {
  fantasy: "Фэнтези", horror: "Хоррор", romance: "Романтика", sci_fi: "Научная фантастика",
  drama: "Драма", comedy: "Комедия", slice_of_life: "Повседневность", historical: "Историческое", other: "Другое",
};

export function BotModerationQueue({ initialBots }: { initialBots: PendingBot[] }) {
  const [bots, setBots] = useState(initialBots);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moderate(botId: string, action: "approve" | "reject") {
    setBusyId(botId);
    setError(null);
    try {
      const body = action === "reject" ? { action, reason: reasons[botId]?.trim() || undefined } : { action };
      await apiRequest(`/api/admin/bots/${botId}/moderate`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setBots(current => current.filter(bot => bot.id !== botId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось выполнить действие");
    } finally {
      setBusyId(null);
    }
  }

  if (!bots.length) return <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center text-stone-500">Очередь модерации пуста.</div>;

  return <div className="grid gap-5">
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
    {bots.map(bot => <article key={bot.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="display text-2xl font-semibold">{bot.name}</h2><p className="mt-1 text-xs text-stone-500">{genreLabels[bot.genre] || bot.genre} · {new Date(bot.created_at).toLocaleString("ru-RU")}</p></div>
        <div className="text-xs text-stone-500 sm:text-right"><div>{bot.author_display_name || "Без имени"}</div><div className="break-all font-mono">{bot.author_id}</div></div>
      </div>
      <section className="mt-5 grid gap-4">
        <div><h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">Описание</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{bot.description || "—"}</p></div>
        <div><h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">System prompt</h3><pre className="mt-2 max-h-80 max-w-full overflow-auto whitespace-pre-wrap rounded-xl bg-stone-950 p-4 text-xs leading-5 text-stone-100">{bot.system_prompt}</pre></div>
      </section>
      <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="grid gap-1 text-xs font-semibold text-stone-600">Причина отклонения (необязательно)<textarea value={reasons[bot.id] || ""} onChange={event => setReasons(current => ({ ...current, [bot.id]: event.target.value }))} maxLength={1000} rows={2} disabled={busyId === bot.id} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-ember" /></label>
        <button disabled={busyId !== null} onClick={() => moderate(bot.id, "reject")} className="min-h-11 rounded-xl border border-red-300 px-5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Отклонить</button>
        <button disabled={busyId !== null} onClick={() => moderate(bot.id, "approve")} className="min-h-11 rounded-xl bg-moss px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">Одобрить</button>
      </div>
    </article>)}
  </div>;
}

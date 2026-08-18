import { ArrowUpRight, Wallet } from "lucide-react";
import { authorMetrics, bots } from "@/lib/mock-data";
import { Badge, LinkButton } from "@/components/ui";

export default function CreatorPage() {
  const mine = bots.slice(0, 2);
  const metrics = authorMetrics.map((metric) => metric.label === "Ожидаемый доход" ? { ...metric, value: "0 ₽", hint: "Пока нет начислений" } : metric);

  return <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Badge>Кабинет автора</Badge><h1 className="display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Ваши истории в цифрах</h1><p className="mt-3 text-base text-stone-500">Актуальные данные за текущий месяц</p></div><LinkButton href="/create">Создать персонажа</LinkButton></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="surface-lift rounded-2xl border border-stone-200 bg-white p-5"><p className="text-sm font-semibold text-stone-500">{metric.label}</p><p className="mt-2 text-2xl font-black">{metric.value}</p><p className="mt-2 text-sm text-moss">{metric.hint}</p></div>)}</div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="surface-lift rounded-2xl border border-stone-200 bg-white"><div className="flex items-center justify-between border-b border-stone-700 p-5"><h2 className="font-bold">Мои персонажи</h2><span className="text-xs text-stone-500">Опубликованные персонажи</span></div><div className="divide-y divide-stone-700">{mine.map((bot, index) => <div key={bot.id} className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5"><div className={`grid size-12 shrink-0 place-items-center rounded-full ${index ? "bg-moss" : "bg-stone-600"} font-black text-white`}>{bot.avatar}</div><div className="min-w-0 flex-1"><p className="truncate font-bold">{bot.name}</p><p className="text-xs leading-5 text-stone-500">{bot.likes.toLocaleString("ru-RU")} лайков · {Math.round(bot.conversations / 1000)} тыс. диалогов</p></div><button aria-label={`Открыть ${bot.name}`} className="grid size-11 place-items-center rounded-lg border border-stone-600 transition hover:-translate-y-0.5 hover:border-white"><ArrowUpRight size={16} /></button></div>)}</div></section>
      <aside className="surface-lift rounded-2xl border border-stone-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Выплаты</h2><Wallet size={19} /></div><p className="mt-5 text-sm text-stone-500">Доступно к выводу</p><p className="mt-1 text-3xl font-black">0 ₽</p><button disabled className="mt-4 h-11 w-full rounded-xl bg-stone-800 text-sm font-bold text-stone-400">Баланс 0 ₽</button><p className="mt-5 border-t border-stone-700 pt-5 text-sm leading-6 text-stone-500">Когда появятся начисления, доступная сумма и действие для вывода отобразятся здесь автоматически.</p></aside>
    </div>
  </main>;
}

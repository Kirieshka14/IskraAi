"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Coins, Mail, ShieldCheck } from "lucide-react";
import { plans } from "@/lib/mock-data";
import { getDailyPriceRub, getDurationLabel } from "@/lib/subscription-plans";
import { HttpApiClient } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui";

const api = new HttpApiClient();

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "Я").toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getProfile()
      .then((data) => { if (active) setProfile(data); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Не удалось загрузить профиль"); });
    return () => { active = false; };
  }, []);

  const progress = useMemo(() => {
    if (!profile || profile.points.total <= 0) return 0;
    return Math.min(100, Math.max(0, (profile.points.remaining / profile.points.total) * 100));
  }, [profile]);

  return (
    <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6">
      {error && <p role="alert" className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">{error}</p>}
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <div className="surface-lift rounded-2xl border border-stone-200 bg-white p-5">
            {profile ? <>
              <div className="grid size-16 place-items-center rounded-full bg-stone-700 text-xl font-black text-white">{initials(profile.displayName)}</div>
              <h1 className="mt-4 break-words text-xl font-black">{profile.displayName}</h1>
              <p className="mt-1 flex items-center gap-2 break-all text-sm text-stone-500"><Mail size={15} />{profile.email}</p>
              <div className="mt-5 grid gap-3 border-t border-stone-700 pt-4 text-sm">
                <p className="flex items-center gap-2"><ShieldCheck size={17} className="text-moss" />{profile.isAdultConfirmed ? "Возраст подтверждён" : "Возраст не подтверждён"}</p>
                <p className="flex items-center gap-2"><Mail size={17} />{profile.newsletterOptIn ? "Новости включены" : "Новости выключены"}</p>
              </div>
            </> : <div className="grid gap-3" aria-label="Загрузка профиля"><div className="skeleton size-16 rounded-full" /><div className="skeleton h-6 w-40 rounded" /><div className="skeleton h-4 w-52 rounded" /></div>}
          </div>

          <div className="surface-lift rounded-2xl bg-ink p-5 text-white ring-1 ring-stone-700">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold">Баланс на сегодня</span><Coins size={18} /></div>
            <div className="mt-3 text-3xl font-black">{profile ? profile.points.remaining : "—"}<span className="text-sm font-normal text-white/60"> / {profile ? profile.points.total : "—"}</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${progress}%` }} /></div>
            <p className="mt-3 flex items-center gap-1 text-xs text-white/60"><Clock size={13} />Сброс {profile?.points.resetsAt ?? "—"}</p>
          </div>
        </aside>

        <section>
          <div>
            <Badge>Текущий тариф: {profile?.plan ?? "Загрузка…"}</Badge>
            <h2 className="display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Выберите свой ритм</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-500">Баллы обновляются каждый день. Смена тарифа вступит в силу на следующий день.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{plans.map((plan, index) => <article key={plan.id} className={`surface-lift relative rounded-2xl border bg-white p-5 ${plan.isFeatured ? "border-white shadow-soft" : "border-stone-200"}`}>
            {plan.isFeatured && <span className="absolute right-4 top-4 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-black">Выгодный выбор</span>}
            <p className="text-sm font-bold">{plan.name}</p><p className="mt-4 text-3xl font-black">{plan.priceRub} ₽</p><p className="text-xs text-stone-500">за {getDurationLabel(plan.durationDays)}</p>
            <ul className="my-5 grid gap-2 text-xs leading-5 text-stone-500"><li className="flex gap-2"><Check size={15} className="text-moss" />{plan.dailyPointAllowance !== null ? `${plan.dailyPointAllowance} баллов ежедневно` : "Дневные баллы уточняются"}</li>{getDailyPriceRub(plan) !== null && <li className="flex gap-2"><Check size={15} className="text-moss" />{getDailyPriceRub(plan)!.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽ в день</li>}<li className="flex gap-2"><Check size={15} className="text-moss" />Все размеры ответа</li></ul>
            <button disabled={index > 0} className="min-h-11 w-full rounded-xl bg-white text-xs font-bold text-black transition hover:scale-[1.01] active:scale-[.98] disabled:bg-stone-800 disabled:text-stone-400">{index === 0 ? "Ваш тариф" : "Скоро"}</button>
          </article>)}</div>
        </section>
      </div>
    </main>
  );
}

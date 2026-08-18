"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Button, Field, inputClass } from "@/components/ui";
import { genreLabels } from "@/lib/mock-data";
import { apiRequest, HttpApiClient } from "@/lib/api";
import type { Genre } from "@/lib/types";

const api = new HttpApiClient();

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState<Genre | "">("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [openingLine, setOpeningLine] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      let avatarUrl: string | null = null;
      if (avatar) {
        const form = new FormData();
        form.set("avatar", avatar);
        avatarUrl = (await apiRequest<{ url: string }>("/api/bots/avatar", { method: "POST", body: form })).url;
      }
      await api.createBot({
        name,
        genre: genre as Genre,
        description,
        systemPrompt: `${systemPrompt}\n\nПервая реплика: ${openingLine}`,
        avatarUrl,
      });
      setCreated(true);
      setMessage("Персонаж создан и опубликован.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать персонажа");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-enter mx-auto max-w-3xl px-4 py-8 sm:py-12 md:px-6">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-bold text-white">Новый персонаж</p>
        <h1 className="display mt-2 text-3xl font-semibold leading-tight sm:text-4xl">Создайте своего персонажа</h1>
        <p className="mt-3 text-base leading-7 text-stone-500">Заполните основные данные и настройте поведение. После сохранения персонаж будет доступен сразу.</p>
      </div>

      <div className="mb-6 flex items-center gap-3" aria-label={`Шаг ${step} из 2`}>
        {[1, 2].map((item) => (
          <span key={item} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= item ? "bg-white" : "bg-stone-700"}`} />
        ))}
        <span className="text-sm font-semibold text-stone-400">{step}/2</span>
      </div>

      <form onSubmit={submit} className="surface-lift rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        {step === 1 && (
          <div className="form-step grid gap-6">
            <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
              <label className="grid aspect-square min-h-40 place-items-center rounded-2xl border-2 border-dashed border-stone-500 bg-stone-900 text-center text-sm text-stone-300 transition hover:border-white hover:bg-stone-800">
                <span><Upload className="mx-auto mb-3" />Загрузить аватар<br /><small className="mt-1 block text-stone-500">JPG, PNG, WebP до 5 МБ</small></span>
                <input accept="image/jpeg,image/png,image/webp" type="file" className="hidden" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
              </label>
              <div className="grid gap-5">
                <Field label="Имя персонажа"><input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} maxLength={60} /></Field>
                <Field label="Жанр"><select required value={genre} onChange={(e) => setGenre(e.target.value as Genre)} className={inputClass}><option value="" disabled>Выберите жанр</option>{Object.entries(genreLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></Field>
              </div>
            </div>
            <Field label="Короткое описание"><textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} h-32 py-3 leading-6`} maxLength={300} /></Field>
          </div>
        )}

        {step === 2 && (
          <div className="form-step grid gap-6">
            <Field label="Поведение и правила персонажа" hint="Опишите стиль общения, характер, границы роли и важные детали."><textarea required value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} className={`${inputClass} h-64 py-3 leading-6`} maxLength={10000} /></Field>
            <Field label="Первая реплика"><textarea required value={openingLine} onChange={(e) => setOpeningLine(e.target.value)} className={`${inputClass} h-32 py-3 leading-6`} /></Field>
          </div>
        )}

        {message && <p role="status" className={`mt-6 flex items-center gap-2 rounded-xl border p-4 text-sm ${created ? "border-emerald-800 bg-emerald-950/40 text-emerald-200" : "border-red-900 bg-red-950/40 text-red-200"}`}>{created && <CheckCircle2 size={18} />}{message}</p>}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-700 pt-5 sm:flex-row sm:justify-between">
          <Button type="button" disabled={step === 1 || busy || created} onClick={() => setStep(1)} className="w-full bg-stone-800 text-white ring-1 ring-stone-600 hover:bg-stone-700 sm:w-auto">Назад</Button>
          <Button disabled={busy || created} className="w-full sm:w-auto">{busy ? "Создаём…" : step === 1 ? "Продолжить" : "Создать персонажа"}</Button>
        </div>
      </form>
    </main>
  );
}

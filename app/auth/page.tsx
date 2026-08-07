"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Turnstile, type TurnstileHandle } from "@/components/turnstile";
import { Button, Field, inputClass } from "@/components/ui";
import { HttpApiClient } from "@/lib/api";

const api = new HttpApiClient();
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Mode = "register" | "login";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleTokenChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setFormError(null);
    setCaptchaToken(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (mode === "login") return;
    if (!turnstileSiteKey) {
      setFormError("Регистрация временно недоступна: не настроена проверка безопасности.");
      return;
    }
    if (!captchaToken) {
      setFormError("Подтвердите, что вы не робот.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.register({
        email,
        password,
        displayName,
        isAdultConfirmed: true,
        termsAccepted: true,
        newsletterOptIn,
        captchaToken,
      });
      router.push("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось создать аккаунт. Попробуйте снова.");
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationDisabled =
    !turnstileSiteKey || !captchaToken || !isAdultConfirmed || !termsAccepted || isSubmitting;

  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <section className="hidden lg:block">
        <span className="text-sm font-bold uppercase tracking-[.2em] text-ember">Добро пожаловать</span>
        <h1 className="display mt-4 text-5xl font-semibold leading-tight">Ваша следующая история уже началась.</h1>
        <ul className="mt-8 grid gap-4 text-sm text-stone-600">
          {["100 баллов каждый день на бесплатном тарифе", "Тысячи авторских персонажей и миров", "Ваш выбор влияет на каждую сцену"].map((item) => (
            <li className="flex items-center gap-3" key={item}>
              <span className="grid size-6 place-items-center rounded-full bg-moss text-white"><Check size={14} /></span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-7 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
          <button type="button" onClick={() => changeMode("register")} className={`rounded-lg py-2.5 text-sm font-bold ${mode === "register" ? "bg-white shadow-sm" : "text-stone-500"}`}>Регистрация</button>
          <button type="button" onClick={() => changeMode("login")} className={`rounded-lg py-2.5 text-sm font-bold ${mode === "login" ? "bg-white shadow-sm" : "text-stone-500"}`}>Войти</button>
        </div>
        <h2 className="display text-3xl font-semibold">{mode === "register" ? "Создать аккаунт" : "С возвращением"}</h2>
        <p className="mt-2 text-sm text-stone-500">{mode === "register" ? "Займёт меньше минуты" : "Продолжите с того места, где остановились"}</p>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <Field label="Как вас называть">
              <input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} placeholder="Имя или псевдоним" />
            </Field>
          )}
          <Field label="Электронная почта">
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="name@example.com" />
          </Field>
          <Field label="Пароль">
            <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} placeholder="Не менее 8 символов" />
          </Field>

          {mode === "register" && (
            <>
              <label className="flex gap-3 text-sm">
                <input required checked={isAdultConfirmed} onChange={(event) => setIsAdultConfirmed(event.target.checked)} type="checkbox" className="mt-1 size-4 accent-[#c95f3f]" />
                <span><b>Мне исполнилось 18 лет</b><br /><span className="text-xs text-stone-500">Обязательное подтверждение возраста</span></span>
              </label>
              <label className="flex gap-3 text-sm">
                <input required checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} type="checkbox" className="mt-1 size-4 accent-[#c95f3f]" />
                <span>Я принимаю <Link href="#" className="underline">пользовательское соглашение</Link> и понимаю, что диалоги могут использоваться для улучшения сервиса.</span>
              </label>
              <label className="flex gap-3 text-sm text-stone-600">
                <input checked={newsletterOptIn} onChange={(event) => setNewsletterOptIn(event.target.checked)} type="checkbox" className="mt-1 size-4 accent-[#c95f3f]" />
                Хочу получать новости на почту
              </label>

              {turnstileSiteKey ? (
                <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} onTokenChange={handleTokenChange} />
              ) : (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  Регистрация временно недоступна: не настроена проверка безопасности.
                </p>
              )}
            </>
          )}

          {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
          <Button type="submit" disabled={mode === "register" ? registrationDisabled : isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Подождите…" : mode === "register" ? "Создать аккаунт" : "Войти"}
          </Button>
        </form>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Turnstile, type TurnstileHandle } from "@/components/turnstile";
import { Field, inputClass } from "@/components/ui";
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
  const handleTokenChange = useCallback((token: string | null) => setCaptchaToken(token), []);

  function changeMode(nextMode: Mode) {
    setMode(nextMode); setFormError(null); setCaptchaToken(null); turnstileRef.current?.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(null);
    if (mode === "register" && !turnstileSiteKey) return setFormError("Регистрация временно недоступна: не настроена проверка безопасности.");
    if (mode === "register" && !captchaToken) return setFormError("Подтвердите, что вы не робот.");
    setIsSubmitting(true);
    try {
      if (mode === "register") await api.register({ email, password, displayName, isAdultConfirmed: true, termsAccepted: true, newsletterOptIn, captchaToken: captchaToken! });
      else await api.login({ email, password });
      router.push("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось продолжить. Попробуйте снова.");
      if (mode === "register") turnstileRef.current?.reset();
    } finally { setIsSubmitting(false); }
  }

  const disabled = isSubmitting || (mode === "register" && (!turnstileSiteKey || !captchaToken || !isAdultConfirmed || !termsAccepted));

  return <main className="auth-shell">
    <Link href="/" className="auth-back" aria-label="Вернуться в каталог"><ArrowLeft size={19} /> <span>Назад</span></Link>
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand" aria-label="IskraAi"><BrandMark className="h-14 w-14" /><span>IskraAi</span></div>
      <h1 id="auth-title" className="display text-center text-[clamp(1.8rem,7vw,2.7rem)] font-semibold leading-tight text-white">Откройте мир персонажей IskraAi</h1>
      <p className="mt-3 text-center text-sm text-stone-400">{mode === "register" ? "Зарегистрируйтесь за несколько секунд" : "Войдите, чтобы продолжить свою историю"}</p>

      <div className="auth-tabs" role="tablist" aria-label="Способ авторизации">
        <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => changeMode("register")}>Регистрация</button>
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")}>Вход</button>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {mode === "register" && <Field label="Имя или псевдоним"><input required autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} className={`${inputClass} auth-input`} placeholder="Как к вам обращаться" /></Field>}
        <Field label="Электронная почта"><input required autoComplete="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} auth-input`} placeholder="name@example.com" /></Field>
        <Field label="Пароль"><input required autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} auth-input`} placeholder="Не менее 8 символов" /></Field>

        {mode === "register" && <div className="grid gap-3 pt-1">
          <CheckRow required checked={isAdultConfirmed} onChange={setIsAdultConfirmed}><b>Мне исполнилось 18 лет</b><small>Обязательное подтверждение возраста</small></CheckRow>
          <CheckRow required checked={termsAccepted} onChange={setTermsAccepted}>Я принимаю <Link href="#" className="underline underline-offset-2">пользовательское соглашение</Link> и политику конфиденциальности</CheckRow>
          <CheckRow checked={newsletterOptIn} onChange={setNewsletterOptIn}>Получать новости IskraAi по электронной почте</CheckRow>
          <div className="turnstile-wrap">{turnstileSiteKey ? <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} onTokenChange={handleTokenChange} /> : <p role="alert" className="auth-error">Регистрация временно недоступна: не настроена проверка безопасности.</p>}</div>
        </div>}
        {formError && <p role="alert" className="auth-error">{formError}</p>}
        <button type="submit" disabled={disabled} className="auth-submit">{isSubmitting ? "Подождите…" : mode === "register" ? "Создать аккаунт" : "Войти"}</button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-stone-500">Продолжая, вы подтверждаете, что вам исполнилось 18 лет.</p>
    </section>
  </main>;
}

function CheckRow({ children, checked, onChange, required = false }: { children: React.ReactNode; checked: boolean; onChange: (value: boolean) => void; required?: boolean }) {
  return <label className="auth-check"><input required={required} checked={checked} onChange={e => onChange(e.target.checked)} type="checkbox" /><span>{children}</span></label>;
}

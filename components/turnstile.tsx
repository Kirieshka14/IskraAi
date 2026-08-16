"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SCRIPT_SELECTOR = 'script[data-iskra-turnstile="true"]';

type TurnstileWidgetId = string;

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": (errorCode: string) => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => TurnstileWidgetId;
  remove: (widgetId: TurnstileWidgetId) => void;
  reset: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
};

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile(
  { siteKey, onTokenChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const [loadError, setLoadError] = useState(false);

  useImperativeHandle(ref, () => ({
    reset() {
      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
      onTokenChange(null);
    },
  }), [onTokenChange]);

  useEffect(() => {
    let active = true;
    let script = document.querySelector<HTMLScriptElement>(TURNSTILE_SCRIPT_SELECTOR);

    const renderWidget = () => {
      if (!active || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
      setLoadError(false);
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          if (active) onTokenChange(token);
        },
        "expired-callback": () => {
          if (active) onTokenChange(null);
        },
        "error-callback": () => {
          if (active) {
            onTokenChange(null);
            setLoadError(true);
          }
        },
      });
    };

    const handleScriptError = () => {
      if (active) {
        onTokenChange(null);
        setLoadError(true);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.dataset.iskraTurnstile = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", handleScriptError);
    }

    return () => {
      active = false;
      script?.removeEventListener("load", renderWidget);
      script?.removeEventListener("error", handleScriptError);
      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      widgetIdRef.current = null;
      onTokenChange(null);
    };
  }, [onTokenChange, siteKey]);

  return (
    <div className="grid gap-2" aria-label="Проверка безопасности">
      <div ref={containerRef} className="min-h-[65px]" />
      {loadError && (
        <p role="alert" className="text-xs text-red-700">
          Не удалось загрузить проверку безопасности. Обновите страницу и попробуйте снова.
        </p>
      )}
    </div>
  );
});

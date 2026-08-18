"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ApiError, HttpApiClient, type ApiBot } from "@/lib/api";
import {
  canSendMessage,
  remainingAfterSuccessfulReply,
} from "@/lib/chat-state";

const api = new HttpApiClient();
const time = (value: string) =>
  new Date(value).toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });

export function ChatClient() {
  const search = useSearchParams();
  const router = useRouter();
  const botId = search.get("bot");
  const [bot, setBot] = useState<ApiBot | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const allowed = canSendMessage(remaining, busy, text);

  const load = useCallback(async () => {
    if (!botId) {
      setError("Персонаж не выбран");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [bots, points, conversations] = await Promise.all([
        api.getBots(),
        api.getPoints(),
        api.getConversations(),
      ]);
      const selected = bots.find((item) => item.id === botId);
      if (!selected) throw new Error("Персонаж недоступен");
      setBot(selected);
      setRemaining(points.remaining);
      let conversation =
        conversations.find((item) => item.bot_id === botId) ?? null;
      if (!conversation) conversation = await api.createConversation(botId);
      setConversationId(conversation.id);
      setMsgs(await api.getMessages(conversation.id));
    } catch (value) {
      if (value instanceof ApiError && value.status === 401) {
        router.replace(
          `/auth?next=${encodeURIComponent(`/chat/?bot=${botId}`)}`,
        );
        return;
      }
      setError(
        value instanceof Error ? value.message : "Не удалось открыть диалог",
      );
    } finally {
      setLoading(false);
    }
  }, [botId, router]);

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  async function send() {
    const content = text.trim();
    if (!conversationId || !canSendMessage(remaining, busy, content)) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api.sendMessage({
        conversationId,
        content,
        responseSize: "small",
        operationKey: crypto.randomUUID(),
      });
      if (!result.assistantMessage?.content?.trim()) {
        throw new Error("Сервер не вернул содержательный ответ");
      }
      setMsgs((previous) => [
        ...previous,
        result.userMessage,
        result.assistantMessage,
      ]);
      setRemaining((current) =>
        remainingAfterSuccessfulReply(current ?? 0, result),
      );
      setText("");
    } catch (value) {
      const message =
        value instanceof ApiError &&
        (value.status === 402 || value.status === 429)
          ? "Дневной лимит сообщений исчерпан"
          : value instanceof Error
            ? value.message
            : "Не удалось отправить сообщение";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  const initials = useMemo(
    () =>
      bot?.name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "ИИ",
    [bot],
  );

  if (loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <p>Загружаем диалог…</p>
      </main>
    );
  }
  if (!bot) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-bold">{error ?? "Диалог недоступен"}</p>
        <Link className="mt-5 inline-block text-ember" href="/">
          Вернуться к персонажам
        </Link>
      </main>
    );
  }

  return (
    <main className="chat-page">
      <header className="chat-topbar">
        <Link href="/" className="chat-back" aria-label="Вернуться назад">
          <ArrowLeft size={19} />
        </Link>
        <div className="chat-avatar">{initials}</div>
        <div className="chat-identity">
          <h1>{bot.name}</h1>
          <p>{bot.genre}</p>
        </div>
      </header>

      <div className="chat-scroll">
        <div className="chat-column">
          <section className="chat-intro">
            <div className="chat-intro-avatar">{initials}</div>
            <div>
              <h2>История с {bot.name}</h2>
              {bot.description && <p>{bot.description}</p>}
            </div>
          </section>

          <div className="chat-message-list">
            {msgs.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "chat-message-row",
                  message.sender === "user" && "is-user",
                )}
              >
                <div
                  className={cn(
                    "chat-message-bubble",
                    message.sender === "user"
                      ? "chat-message-user"
                      : "chat-message-assistant",
                  )}
                >
                  {message.content}
                </div>
                <div className="chat-message-meta">
                  {time(
                    message.createdAt ??
                      (message as unknown as { created_at: string }).created_at,
                  )}
                  {message.sender === "assistant" &&
                    index === msgs.length - 1 && (
                      <span>
                        <RefreshCw size={11} /> ответ
                      </span>
                    )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="chat-message-row">
                <div className="chat-message-bubble chat-message-assistant chat-typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
            <div ref={bottom} />
          </div>
        </div>
      </div>

      <footer className="chat-composer-area">
        <div className="chat-composer-wrap">
          <div className="chat-composer">
            <textarea
              disabled={busy || remaining === 0}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              rows={1}
              placeholder={
                remaining === 0
                  ? "Лимит сообщений исчерпан"
                  : "Сообщение персонажу…"
              }
            />
            <button
              onClick={() => void send()}
              disabled={!allowed}
              aria-label="Отправить сообщение"
              className="chat-send"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="chat-composer-meta">
            <span>{remaining ?? "—"} сообщений</span>
            <small>Enter — отправить · Shift + Enter — новая строка</small>
          </div>
          {error && (
            <p role="alert" className="chat-error">
              {error}
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}

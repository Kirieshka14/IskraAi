# IskraAi Frontend

Публичный UI-проект IskraAi на Next.js 14. Backend-реализации, миграций и серверных секретов в этом репозитории нет.

## Возможности

- каталог персонажей, профиль, кабинет автора и мастер создания;
- честное состояние чата: доступность запрашивается у backend, при недоступном LLM отправка отключена;
- клиентский экран `/admin/bots`: backend проверяет сессию и роль, UI обрабатывает `401` и `403`;
- единый UI-конфиг тарифов в `lib/subscription-plans.ts` как fallback/представление публичного каталога тарифов.

## Настройка

Требуется Node.js 20+.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Единственная переменная окружения:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

`NEXT_PUBLIC_API_URL` публична и должна указывать на отдельный IskraAi backend. Не добавляйте private env или ключи в этот репозиторий. Backend должен разрешить точный origin frontend через `FRONTEND_URL` и credentialed CORS.

## Проверки

```bash
npm run typecheck
npm run build
```

## Границы репозитория

- `app/` — только страницы;
- `components/` — UI-компоненты;
- `lib/api.ts` — HTTP-клиент с `credentials: "include"`;
- `lib/mock-data.ts` — явно демонстрационные данные незавершённых UI-сценариев;
- `lib/subscription-plans.ts` — тарифный UI-конфиг.

API Route Handlers, `lib/server`, Supabase config/migrations и backend TODO находятся только в приватном backend-проекте.

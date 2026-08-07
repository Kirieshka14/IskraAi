# IskraAi Frontend

Публичный UI-проект IskraAi на Next.js 14. Backend-реализации, миграций и серверных секретов в этом репозитории нет.

## Возможности

- каталог персонажей, профиль, кабинет автора и мастер создания;
- честное состояние чата: доступность запрашивается у backend, при недоступном LLM отправка отключена;
- клиентский экран `/admin/bots`: backend проверяет сессию и роль, UI обрабатывает `401` и `403`;
- единый UI-конфиг тарифов в `lib/subscription-plans.ts` как fallback/представление публичного каталога тарифов.

## Установка и разработка

Требуется Node.js 20+.

```bash
npm install
cp .env.example .env.local # необязательно
npm run dev
```

Публичные переменные окружения:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-public-site-key
```

`NEXT_PUBLIC_API_URL` публична и должна указывать на отдельный IskraAi backend. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — публичный site key Cloudflare Turnstile для регистрации; secret key относится только к backend и не должен добавляться во frontend или в переменные `NEXT_PUBLIC_*`. Если site key не задан, регистрация fail-closed с понятным сообщением, а вход остаётся доступен. Не добавляйте private env или ключи в этот репозиторий. Если переменная не задана, frontend всё равно собирается, а зависящие от API экраны показывают честное состояние недоступности. При подключении backend он должен разрешить точный origin frontend через credentialed CORS.

### Cloudflare Turnstile и CSP

Turnstile загружается только в режиме регистрации через официальный скрипт `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` и рендерится явно. При строгой Content Security Policy разрешите `https://challenges.cloudflare.com` как минимум в директивах `script-src` и `frame-src`. Политику CSP следует задавать на static hosting/CDN, поскольку проект публикуется как static export.

## Статическая сборка и публикация

Публичная версия: **https://kirieshka14.github.io/IskraAi/**

```bash
npm install
npm run typecheck
npm run build
```

Next.js создаст полноценный статический экспорт в `out/`, включая `out/index.html` и HTML-файлы маршрутов. Backend в экспорт не входит; его адрес встраивается при сборке через `NEXT_PUBLIC_API_URL`.

При push в ветку `main` workflow `.github/workflows/deploy-pages.yml` автоматически проверяет типы, собирает frontend в режиме GitHub Pages и публикует `out/`. В этом режиме используется project-site префикс `/IskraAi`; обычная локальная разработка остаётся доступной от корня `/`.

Локальная проверка production-сборки для GitHub Pages:

```bash
GITHUB_PAGES=true npm run build
```

Для локальной проверки отдавайте `out/` по HTTP, например любым простым static server:

```bash
npx serve out
```

Открытие `out/index.html` двойным кликом использует протокол `file://`. Браузер может ограничить загрузку JavaScript, CSS, маршрутизацию и сетевые запросы в этом режиме, поэтому используйте статический hosting или локальный HTTP-сервер. Ручной дублирующий `index.html` в исходниках не нужен: его генерирует Next.js.

## Границы репозитория

- `app/` — только страницы;
- `components/` — UI-компоненты;
- `lib/api.ts` — HTTP-клиент с `credentials: "include"`;
- `lib/mock-data.ts` — явно демонстрационные данные незавершённых UI-сценариев;
- `lib/subscription-plans.ts` — тарифный UI-конфиг.

API Route Handlers, `lib/server`, Supabase config/migrations и backend TODO находятся только в приватном backend-проекте.

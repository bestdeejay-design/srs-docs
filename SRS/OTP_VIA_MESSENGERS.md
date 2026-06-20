# Доставка OTP-кодов через мессенджеры (MAX / Telegram)

> **Проблема:** SMS-коды не работают (провайдер недоступен / отключён).
> **Решение:** Отправлять OTP через мессенджеры MAX и Telegram с каскадным fallback.
> **Статус:** Проектирование.

---

## 1. Ключевое ограничение

**Ни MAX API, ни Telegram Bot API не имеют метода поиска пользователя по номеру телефона.** Отправить сообщение можно только зная `user_id` (MAX) или `chat_id` (Telegram). Эти идентификаторы становятся известны, когда пользователь сам запустил бота.

Единственный способ отправить код без предварительной привязки — **Deep Link с параметром `?start=`**, который передаётся боту при первом запуске.

---

## 2. Принципиальная схема

```
┌─────────────────────────────────────────────────────────┐
│                   Пользователь                           │
│   Вводит телефон → нажимает «Получить код в MAX» / TG   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   App / Frontend                         │
│   Генерирует одноразовый сессионный токен:               │
│   AUTH_<32 random hex chars>                             │
│   Сохраняет: session[AUTH_XXX] = {phone, expires: 5min}  │
│                                                          │
│   Открывает deep link:                                   │
│   MAX: https://max.ru/<bot>?start=AUTH_XXX               │
│   TG:  https://t.me/<bot>?start=AUTH_XXX                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Мессенджер                              │
│   Открывает чат с ботом                                   │
│   Пользователь нажимает Старт                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Bot Webhook)                   │
│                                                          │
│   MAX: получает bot_started:                              │
│   { chat_id, user_id, payload: "AUTH_XXX" }              │
│                                                          │
│   TG:  получает /start AUTH_XXX                          │
│   { chat_id, text: "/start AUTH_XXX" }                   │
│                                                          │
│   → Дёргает App API: POST /auth/link                     │
│     { token: "AUTH_XXX", messenger: "max", user_id }     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   App API                                 │
│   Находит phone по AUTH_XXX                              │
│   Сохраняет связку: user_messenger_links[phone] = {      │
│     max: { user_id, linked_at },                         │
│     tg:  { chat_id, linked_at }                          │
│   }                                                      │
│   Отвечает боту: { status: "ok", otp: "1234" }           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Bot в чате                               │
│   Отправляет: «Ваш код: 1234»                             │
│   MAX: POST /messages?user_id=                            │
│   TG:  sendMessage(chat_id, "Ваш код: 1234")              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Пользователь                             │
│   Видит код в чате → вводит в приложении → вход           │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Каскадная логика (при повторных входах)

После первой авторизации через deep link связка `phone → user_id/chat_id` сохранена в БД. При повторном входе:

```
Пользователь вводит телефон
  ↓
Проверка user_messenger_links:
  ┌──────────────────────────────────────────┐
  │ Есть user_id в MAX?                      │
  │   → POST /messages?user_id= → OTP        │
  │   → «Код отправлен в MAX»                │
  ├──────────────────────────────────────────┤
  │ Есть chat_id в TG?                       │
  │   → sendMessage(chat_id) → OTP           │
  │   → «Код отправлен в Telegram»           │
  ├──────────────────────────────────────────┤
  │ Нет привязки                             │
  │   → Deep Link flow (см. схему выше)      │
  │   → Показываем кнопки MAX / TG           │
  └──────────────────────────────────────────┘
```

---

## 4. Сравнение каналов

| Параметр | MAX | Telegram |
|----------|-----|----------|
| География | 🇷🇺 РФ | 🌍 Global |
| Deep Link | `https://max.ru/<bot>?start=<payload>` (до 128 симв.) | `https://t.me/<bot>?start=<payload>` |
| Событие при запуске | `bot_started` с полем `payload` | `/start <payload>` как текст сообщения |
| Отправка сообщения | `POST /messages?user_id=` | `sendMessage(chat_id, text)` |
| Rate limit | 30 rps | 30 msg/s global, 1 msg/s per chat |
| Лимит текста | 4000 символов | 4096 символов |
| Требуется организация | Да (ИП/юрлицо/самозанятый, резиденты РФ) | Нет |
| Модерация бота | Да (может занимать дни) | Нет |
| Макс. ботов | 5 (юрлицо), 2 (самозанятый) | Не ограничено |
| Получение событий | Webhook (HTTPS, порт 443) | Webhook или Long Polling |
| Запрос контакта | `request_contact` кнопка + HMAC-верификация | `KeyboardButton` с `request_contact: true` |

---

## 5. Детальные требования

### 5.1 Сессионный токен

| Поле | Значение |
|------|----------|
| Формат | `AUTH_` + 32 символа (hex) |
| TTL | 5 минут |
| Хранение | Redis / in-memory cache |
| Привязка | `token → { phone, messenger_choice, created_at }` |
| Инвалидация | После успешного получения OTP, по таймауту |

### 5.2 Deep Link URL

**MAX:** `https://max.ru/{bot_username}?start=AUTH_{token}`

**Telegram:** `https://t.me/{bot_username}?start=AUTH_{token}`

Требования к `token`:
- Только латиница, цифры, `_`, `-`, `.`
- Не содержит чувствительных данных (phone, email, user_id)

### 5.3 Bot Webhook (MAX)

**Подписка:** `POST /subscriptions` с `update_types: ["bot_started"]`

**Входящее событие:**
```json
{
  "update_type": "bot_started",
  "timestamp": 1748000000000,
  "chat_id": 1234567890,
  "user": {
    "user_id": 543210,
    "name": "Иван",
    "username": "ivan_petrov"
  },
  "payload": "AUTH_abc123def456..."
}
```

**Обработчик webhook:**
1. Извлечь `payload` (если `null` — ответить приветствием, не обрабатывать)
2. Извлечь `user.user_id` и `chat_id`
3. Вызвать `POST /api/v1/auth/link` вашего приложения:
   ```json
   {
     "token": "AUTH_abc123def456...",
     "messenger": "max",
     "user_id": 543210,
     "chat_id": 1234567890
   }
   ```
4. Если App API вернул `{ status: "ok", otp: "1234" }` — отправить сообщение:
   ```json
   POST /messages?user_id=543210
   {
     "text": "Ваш код подтверждения: 1234\nНикому не сообщайте этот код.",
     "format": "markdown"
   }
   ```
5. Если App API вернул ошибку — отправить: «Срок действия ссылки истёк. Запросите код заново в приложении.»

### 5.4 Bot Webhook (Telegram)

**Входящее сообщение:**
```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "chat": { "id": 987654321 },
    "text": "/start AUTH_abc123def456..."
  }
}
```

**Обработчик:**
1. Проверить, что текст начинается с `/start AUTH_`
2. Извлечь `token` и `chat_id`
3. Вызвать `POST /api/v1/auth/link`:
   ```json
   {
     "token": "AUTH_abc123def456...",
     "messenger": "telegram",
     "chat_id": 987654321
   }
   ```
4. Если App API вернул `{ status: "ok", otp: "1234" }` — отправить:
   ```json
   sendMessage(987654321, {
     "text": "Ваш код подтверждения: 1234\nНикому не сообщайте этот код."
   })
   ```
5. Если ошибка — ответ: «Срок действия ссылки истёк.»

### 5.5 App API — `POST /api/v1/auth/request-otp`

Вызывается фронтендом при нажатии кнопки «Получить код в MAX/TG».

**Запрос:**
```json
{
  "phone": "+79001234567",
  "preferred_messenger": "max"    // "max" | "telegram"
}
```

**Логика:**
1. Проверить `user_messenger_links` для `phone`
2. Если привязка есть → отправить OTP напрямую через бота:
   - MAX: `POST /messages?user_id=...`
   - TG: `sendMessage(chat_id, ...)`
3. Если привязки нет → сгенерировать `AUTH_token`, сохранить в Redis:
   ```
   SET auth_session:AUTH_token '{phone, preferred_messenger}'
   EXPIRE auth_session:AUTH_token 300
   ```
4. Вернуть `{ deep_link: "https://max.ru/bot?start=AUTH_token" }`

**Ответ:**
```json
{
  "success": true,
  "deep_link": "https://max.ru/bot?start=AUTH_abc123..."
}
```

### 5.6 App API — `POST /api/v1/auth/link`

Внутренний эндпоинт, вызывается только ботом (защищён общим секретом).

**Запрос:**
```json
{
  "token": "AUTH_abc123def...",
  "messenger": "max",
  "user_id": 543210,
  "chat_id": 1234567890
}
```

**Логика:**
1. Найти сессию по `token` в Redis
2. Если не найдена или истекла → `{ error: "token_expired" }`
3. Извлечь `phone` из сессии
4. Сохранить/обновить `user_messenger_links[phone]`:
   ```sql
   UPSERT INTO user_messenger_links (phone, max_user_id, max_chat_id, linked_at)
   VALUES ('+79001234567', 543210, 1234567890, NOW())
   ```
5. Сгенерировать OTP (6 цифр), сохранить:
   ```sql
   UPSERT INTO otp_codes (phone, code, expires_at)
   VALUES ('+79001234567', '123456', NOW() + INTERVAL 5 MINUTE)
   ```
6. Удалить сессионный токен из Redis
7. Вернуть `{ status: "ok", otp: "123456" }`

### 5.7 App API — `POST /api/v1/auth/verify-otp`

**Запрос:**
```json
{
  "phone": "+79001234567",
  "code": "123456"
}
```

**Ответ:**
```json
{
  "success": true,
  "token": "jwt_or_session_token..."
}
```

---

## 6. Edge Cases & Обработка ошибок

| Сценарий | Поведение |
|----------|-----------|
| Пользователь нажал «Получить код» но не перешёл в мессенджер | Токен истечёт через 5 мин. Нажать кнопку ещё раз → новый токен |
| Пользователь перешёл, нажал Старт, но `payload` не пришёл | Бот отвечает: «Для входа перейдите по ссылке из приложения» |
| Пользователь уже привязан → нажал MAX / TG | Код приходит сразу, deep link не показывается |
| Бот остановлен / удалён пользователем | `bot_stopped` event → удалить привязку |
| Ошибка отправки (бот заблокирован) | fallback на второй канал, затем предложить перепривязать |
| MAX/TG API недоступен | Время ожидания 5s → ошибка → предложить другой канал |
| Пользователь удалил приложение, не введя код | Токен истекает, связь не сохраняется |
| `payload` > 128 символов (MAX) | Бот не получит `payload`. Проверять длину при генерации |

---

## 7. Затрагиваемые платформы

Изменения коснутся всех клиентских приложений — экран входа (ввод номера, кнопки выбора канала, ввод кода) и экран привязки мессенджера:

| Платформа | Что меняется |
|-----------|-------------|
| iOS (App Store) | Экран входа: +2 кнопки MAX/TG + deep link, поле кода + привязка |
| Android (RuStore + HUAWEI AppGallery) | То же самое |
| Web (полная версия) | Экран входа + deep link (через `window.open`) |
| Web (мобильная версия) | То же, адаптив под touch |

Требования к реализации:
- Deep link открывается системно: `window.open` для web, `Linking.openURL` / универсальные ссылки для мобильных
- После возврата из мессенджера приложение само проверяет статус (polling `GET /auth/status?token=AUTH_XXX` каждые 3s, max 5 мин)
- На Android важен fallback: если MAX не установлен — открыть Telegram; если и TG нет — показать QR

---

## 8. Оценка трудозатрат

| № | Этап | Зависимости |
|---|------|:---:|
| 1 | Регистрация организации на MAX, создание бота, модерация | Документы организации |
| 2 | Создание Telegram-бота, webhook, деплой | — |
| 3 | Redis-сессия `auth_session` (генерация, TTL, инвалидация) | — |
| 4 | Postgres `user_messenger_links` (миграция, CRUD) | — |
| 5 | Postgres `otp_codes` (миграция, CRUD, TTL) | — |
| 6 | Эндпоинт `POST /auth/request-otp` + deep link generation | №3, №4 |
| 7 | Эндпоинт `POST /auth/link` (внутренний, с секретом) | №4, №5 |
| 8 | Эндпоинт `POST /auth/verify-otp` | №5 |
| 9 | MAX Bot: webhook-обработчик `bot_started` | №7 |
| 10 | MAX Bot: отправка OTP `POST /messages` | №9 |
| 11 | Telegram Bot: webhook-обработчик `/start AUTH_XXX` + отправка | №7 |
| 12 | iOS: экран входа (телефон, кнопки MAX/TG, поле кода) | №6 |
| 13 | Android: экран входа (то же самое) | №6 |
| 14 | Web: экран входа | №6 |
| 15 | Web mobile: экран входа (адаптив) | №6 |
| 16 | iOS: экран привязки мессенджера после входа | — |
| 17 | Android: экран привязки мессенджера после входа | — |
| 18 | Web: экран привязки мессенджера после входа | — |
| 19 | Rate limits, retry, таймауты, логирование | — |

---

## 9. Схема данных

### `user_messenger_links`

```sql
CREATE TABLE user_messenger_links (
  id            BIGSERIAL PRIMARY KEY,
  phone         VARCHAR(20) NOT NULL UNIQUE,
  max_user_id   BIGINT,        -- NULL, если не привязан
  max_chat_id   BIGINT,        -- NULL, если не привязан
  tg_chat_id    BIGINT,        -- NULL, если не привязан
  tg_username   VARCHAR(255),  -- для отображения
  linked_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_phone ON user_messenger_links(phone);
```

### `otp_codes`

```sql
CREATE TABLE otp_codes (
  id          BIGSERIAL PRIMARY KEY,
  phone       VARCHAR(20) NOT NULL,
  code        VARCHAR(6) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  used_at     TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_phone_expires ON otp_codes(phone, expires_at);
```

---

## 10. Deployment

| Компонент | Инфраструктура |
|-----------|---------------|
| MAX Bot Webhook | HTTPS-endpoint, публично доступен, порт 443 |
| Telegram Bot Webhook | HTTPS-endpoint (может быть тот же) |
| App API | Существующий backend |
| Redis | Сессии `auth_session`, TTL 5 мин |
| Postgres | Таблицы `user_messenger_links`, `otp_codes` |

**MAX Bot Deployment:**
1. Зарегистрировать организацию/ИП на https://business.max.ru
2. Создать бота, пройти модерацию
3. Получить токен бота в Расширенные настройки
4. Настроить webhook: `POST /subscriptions` с `update_types: ["bot_started"]`

**Telegram Bot Deployment:**
1. Создать бота через `@BotFather`
2. Получить токен
3. Настроить webhook: `setWebhook?url=https://your-domain.com/tg-webhook`

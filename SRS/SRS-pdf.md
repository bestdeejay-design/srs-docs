# Software Requirements Specification

> **Назначение:** Документ спецификации программного продукта — агрегатора доставки продуктов из супермаркетов.
> **Цель:** Позволить команде разработки оценить трудозатраты и реализовать продукт-аналог.
> **Источник данных:** `ШАБЛОН_СПЕЦИФИКАЦИИ_ПРОДУКТА.md` — черновой документ, из которого данные перенесены в эту SRS.

---

## Changelog

<table>
<thead><tr>
<th> Версия</th>
<th>Дата</th>
<th>Автор</th>
<th>Изменения </th>
</tr></thead>
<tbody>
<tr>
<td> 1.17</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 17: Финальная сквозная проверка — исправлен TODO в §4.8 (офлайн-карты), все 15 BP, 7 ADR, 12 event schemas, 17 analytics events верифицированы </td>
</tr>
<tr>
<td> 1.16</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 16: Multi-Region & DR — §5.11, Active-Passive/V2/V3 эволюция, geo-routing, data sync (PG/Redis/RabbitMQ/S3/ES), failover procedure (runbook), regional dependencies </td>
</tr>
<tr>
<td> 1.15</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 15: Vendor Lock-in & Exit Strategy — §5.10, матрица 12 зависимостей, план выхода по категориям риска, contractual safeguards </td>
</tr>
<tr>
<td> 1.14</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 14: Analytics Events Schema — §2.6.1, стандартная схема, каталог 17 событий с sampling, PII-фильтрация, интеграции (Яндекс.Метрика, Firebase, ClickHouse, Amplitude), enforcement </td>
</tr>
<tr>
<td> 1.13</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 13: Frontend Performance Budget — §1.3.1, Core Web Vitals, bundle/image/font/third-party бюджеты, monitoring, enforcement в CI </td>
</tr>
<tr>
<td> 1.12</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 12: Compliance Matrix — полная матрица (12 требований), риски несоответствия, roadmap MVP/V2/V3 </td>
</tr>
<tr>
<td> 1.11</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 11: Fraud Detection — §6.5, сигналы (velocity, geo, device, behavioral), scoring-модель, workflow (Mermaid), интеграции, feedback loop, метрики </td>
</tr>
<tr>
<td> 1.10</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 10: Dispute & Chargeback Workflow — BP-15, типы споров, workflow (Mermaid state machine), таблица ответственности, блокировка клиентов, SLA, финансовые последствия </td>
</tr>
<tr>
<td> 1.9</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 9: Rate Limits & Quotas — таблица лимитов по 10 эндпоинтам, лимиты по ролям, HTTP 429, реализация Nginx+Redis, burst-политика </td>
</tr>
<tr>
<td> 1.8</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 8: Data Migration Strategy — порядок миграции, Double Write + Transactional Outbox, reconciliation, cut-over criteria, rollback, backfill, таблица рисков </td>
</tr>
<tr>
<td> 1.7</td>
<td>2026-06-17</td>
<td>—</td>
<td>Review fix: Courier SM (добавлены 2 перехода в таблицу), Idempotency Policy (противоречие, код), Sequence 2.11.1/2.11.2 (retry/fallback), созданы migrations/*.sql и db/schema.rb </td>
</tr>
<tr>
<td> 1.6</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 7: API Versioning & Deprecation Policy — SLA, уведомления, mobile strategy, feature flags, Error Code Standard </td>
</tr>
<tr>
<td> 1.5</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 6: Idempotency Policy — общие правила, таблица эндпоинтов, edge cases, примеры кода (Rails/Go) </td>
</tr>
<tr>
<td> 1.4</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 5: Event JSON Schemas — Envelope + 12 полных JSON Schema (draft-07) для всех событий из §2.9 </td>
</tr>
<tr>
<td> 1.3</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 4: Sequence Diagrams для 5 сценариев (Order flow, Substitution, Dispatch, Refund, Offline-sync) с Mermaid sequenceDiagram </td>
</tr>
<tr>
<td> 1.2</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 3: State Machine Diagrams для 5 сущностей (Order, Payment, Delivery, Courier, Picker Task) с Mermaid + таблицами переходов </td>
</tr>
<tr>
<td> 1.1</td>
<td>2026-06-17</td>
<td>—</td>
<td>Prompt 2: User Stories + Acceptance Criteria для всех 14 BP (BP-01…BP-14), Placeholder-ссылки на State Machine / Sequence / API </td>
</tr>
<tr>
<td> 1.0</td>
<td>2026-06-17</td>
<td>—</td>
<td>Структурная реорганизация: разделение на 2 тома (Business Requirements + Technical Specification), вынос артефактов в отдельные файлы, сокращение §6.4 Accessibility </td>
</tr>
</tbody>
</table>

---

## Как читать этот документ

SRS разделён на два тома. В зависимости от вашей роли читайте соответствующие разделы:

<table>
<thead><tr>
<th> Роль</th>
<th>Что читать </th>
</tr></thead>
<tbody>
<tr>
<td> **Product Owner / Менеджер**</td>
<td>Том 1 целиком. §8 Project Estimation & Roadmap </td>
</tr>
<tr>
<td> **Backend-разработчик**</td>
<td>Том 2 целиком. §4 Functional Requirements (BP) — технические заметки внутри каждого BP </td>
</tr>
<tr>
<td> **Frontend-разработчик**</td>
<td>Том 1: §1.3 NFR (Usability, Performance Budget). Том 2: §2.2 Technology Stack, §4 Functional Requirements (интерфейсные BP) </td>
</tr>
<tr>
<td> **Mobile-разработчик**</td>
<td>Том 2: §2.8 Mobile App Architecture (→ ADR-007), §4.2–§4.3 (Picker/Courier Domain), §4.8 Offline Strategy </td>
</tr>
<tr>
<td> **QA-инженер**</td>
<td>Том 1: §1.3 NFR. Том 2: §4 Functional Requirements, §7 Testing Strategy </td>
</tr>
<tr>
<td> **DevOps / SRE**</td>
<td>Том 2: §2 Architecture, §5 Infrastructure & DevOps, §6 Security </td>
</tr>
<tr>
<td> **Аналитик / Data Scientist**</td>
<td>Том 1: §1.6 Business Model, §4.6 Cross-Cutting (Analytics). Том 2: §3 Data Model </td>
</tr>
</tbody>
</table>

---

# Том 1: Business Requirements

## 1. Product Overview (Общие сведения)

### 1.1 Purpose & Scope
- Назначение продукта: доставка продуктов из супермаркетов (агрегатор, не свой склад)
- Целевая аудитория: B2C (покупатели), B2B (корпоративные заказы в офис)
- Ключевые бизнес-метрики: кол-во заказов/день, выручка, средний чек, конверсия, время сборки, время доставки
- Платформы: Web (Next.js), iOS, Android, Huawei AppGallery, RuStore

#### 1.1.2 Текущее состояние системы (AS IS)

Система существует в продакшене (референс-сервис). Настоящий документ описывает целевую архитектуру (TO BE). Ключевые отличия текущей реализации от целевой:

<table>
<thead><tr>
<th> Аспект</th>
<th>AS IS (сейчас)</th>
<th>TO BE (цель) </th>
</tr></thead>
<tbody>
<tr>
<td> **Архитектура**</td>
<td>Монолит Rails</td>
<td>Микросервисы (Rails + Go + Python) </td>
</tr>
<tr>
<td> **Dispatch курьеров**</td>
<td>Закреплены за магазином/зоной, редкая переброска вручную</td>
<td>Multi-objective optimization (V3) </td>
</tr>
<tr>
<td> **Поиск**</td>
<td>PostgreSQL ILIKE</td>
<td>Elasticsearch (V2) </td>
</tr>
<tr>
<td> **Инфраструктура**</td>
<td>Docker Compose, Selectel</td>
<td>Docker → K8s (V3) </td>
</tr>
<tr>
<td> **База данных**</td>
<td>PostgreSQL</td>
<td>PostgreSQL per service (V2) </td>
</tr>
<tr>
<td> **Очереди**</td>
<td>RabbitMQ</td>
<td>RabbitMQ (без изменений) </td>
</tr>
<tr>
<td> **Состав команды**</td>
<td>Backend: 2, Frontend: 2, Mobile: 1, DevOps: 2</td>
<td>— </td>
</tr>
</tbody>
</table>

Детальное описание текущих алгоритмов и состав команды — в отдельном документе AUDIT_AS_IS.md.

#### 1.1.3 География покрытия

<table>
<thead><tr>
<th> Параметр</th>
<th>Значение </th>
</tr></thead>
<tbody>
<tr>
<td> **Основной регион**</td>
<td>Санкт-Петербург и Ленинградская область </td>
</tr>
<tr>
<td> **Второй регион (V2)**</td>
<td>Москва и Московская область </td>
</tr>
<tr>
<td> **Формат зон доставки**</td>
<td>Полигоны на карте, закреплённые за магазинами. Адрес клиента → проверка попадания в зону </td>
</tr>
<tr>
<td> **Количество магазинов (MVP)**</td>
<td>1–3 магазина одной сети (Лента) </td>
</tr>
<tr>
<td> **Количество магазинов (V2)**</td>
<td>5–15 магазинов, 2–3 сети </td>
</tr>
<tr>
<td> **Количество магазинов (V3)**</td>
<td>30+ магазинов, 5+ сетей </td>
</tr>
<tr>
<td> **Плотность зон**</td>
<td>В городе — радиус 3–5 км от магазина. В пригороде — до 10–15 км </td>
</tr>
<tr>
<td> **Расширение**</td>
<td>Каждый новый город = минимум 3 магазина одной сети для покрытия основных районов </td>
</tr>
</tbody>
</table>

#### 1.1.4 User Personas (Пользовательские роли)

<table>
<thead><tr>
<th> Персона</th>
<th>Роль</th>
<th>Кто</th>
<th>Потребности</th>
<th>Боль </th>
</tr></thead>
<tbody>
<tr>
<td> **Клиент B2C**</td>
<td>Покупатель</td>
<td>Житель города, 25–45 лет, заказывает продукты домой 1–3 раза в неделю</td>
<td>Широкий ассортимент, быстрая доставка, прозрачные цены, замена при отсутствии</td>
<td>Опоздания, неверные позиции, отсутствие связи с курьером </td>
</tr>
<tr>
<td> **Клиент B2B**</td>
<td>Офис-менеджер</td>
<td>Сотрудник компании, заказывает обеды/продукты в офис регулярно</td>
<td>Индивидуальные цены, отсрочка платежа, счета/УПД, регулярные поставки по расписанию</td>
<td>Бумажная волокита, негибкие условия, отсутствие ЭДО </td>
</tr>
<tr>
<td> **Пикер**</td>
<td>Сборщик</td>
<td>Сотрудник в магазине, собирает заказы по списку</td>
<td>Чёткий интерфейс, быстрый сканер, offline-режим, простые замены</td>
<td>Плохой интернет в магазине, нечитаемые штрихкоды, отсутствие альтернатив при замене </td>
</tr>
<tr>
<td> **Курьер**</td>
<td>Доставщик</td>
<td>Водитель/пеший курьер, доставляет 5–15 заказов за смену</td>
<td>Оптимальный маршрут, быстрая навигация, приём оплаты, фото-подтверждение</td>
<td>Перегруженные маршруты, нет связи с клиентом, offline-зоны </td>
</tr>
<tr>
<td> **Менеджер**</td>
<td>Администратор</td>
<td>Сотрудник колл-центра/бэк-офиса, управляет заказами</td>
<td>Полный контроль заказов, управление пользователями, промокодами, магазинами</td>
<td>Ручные операции, отсутствие сводной аналитики, сложный поиск </td>
</tr>
<tr>
<td> **Супер-админ**</td>
<td>DevOps / Owner</td>
<td>Технический специалист, управляет системой в целом</td>
<td>Audit log, мониторинг, управление адаптерами сетей, feature flags</td>
<td>Нет observability, сложный деплой, ручной rollback </td>
</tr>
</tbody>
</table>

### 1.2 Glossary (Глоссарий)
**Источник:** Раздел 1.2 исходного документа.

Определения всех ключевых терминов:

- **Роли:**
  - Пикер
  - Курьер
  - Менеджер (Admin)
  - Супер-админ
  - DevOps
- **Бизнес-термины:**
  - Агрегатор доставки
  - Сеть супермаркетов
  - Сборка заказа
  - Слот доставки
  - Зона доставки
  - Замена товара
  - Автокурьер
  - Опция «Можно раньше»
  - Товарное соседство
- **Технические термины (каталог):**
  - Адаптер сети
  - Нормализация данных
  - Маппинг категорий
  - Динамические фильтры
  - Sync Queue
- **Технические термины (доставка):**
  - Dispatch
  - Cheapest Insertion Heuristic
  - 2-opt
  - Constraint satisfaction
  - OSRM
  - ETA
- **Архитектурные паттерны:**
  - Микросервисы
  - DDD (Domain-Driven Design)
  - CQRS
  - Event Sourcing
  - Vertical Slice
  - Event-Driven
  - Feature Flag
- **Инфраструктура:** Окружения (dev/staging/prod), CI/CD, Rolling update, Rollback, Error Budget, Observability stack
- **Юридические:** 152-ФЗ, 54-ФЗ, Честный знак (ЦРПТ), ЕГАИС, ОФД, ЭДО, УПД, ЗоЗПП

### 1.3 Non-Functional Requirements (NFR)
**Источник:** Раздел 1.3 исходного документа.

<table>
<thead><tr>
<th> Категория</th>
<th>Must</th>
<th>Should</th>
<th>Could </th>
</tr></thead>
<tbody>
<tr>
<td> **Performance**</td>
<td>p95 < 500ms (каталог), < 200ms (заказ), сборка < 30 мин, доставка < 60 мин</td>
<td>RPS 50→500→5000</td>
<td>— </td>
</tr>
<tr>
<td> **Availability**</td>
<td>99.9% uptime, at-least-once delivery, idempotent orders</td>
<td>Circuit breaker, DLQ</td>
<td>— </td>
</tr>
<tr>
<td> **Scalability**</td>
<td>Horizontal scaling, CDN, RabbitMQ consumers</td>
<td>PgBouncer, Redis Cluster, ES sharding</td>
<td>K8s HPA </td>
</tr>
<tr>
<td> **Security**</td>
<td>JWT, RBAC (5 ролей), TLS 1.3, AES-256, rate limiting, audit 1y</td>
<td>SAST/Trivy на каждый PR</td>
<td>— </td>
</tr>
<tr>
<td> **Observability**</td>
<td>Prometheus + Grafana, Loki, Sentry</td>
<td>Jaeger tracing</td>
<td>— </td>
</tr>
<tr>
<td> **Usability**</td>
<td>Offline-mode пикера и курьера</td>
<td>Startup < 3s, UI p95 < 200ms</td>
<td>WCAG 2.1 AA </td>
</tr>
<tr>
<td> **Portability**</td>
<td>Chrome/Firefox/Safari/Edge, iOS 15+, Android 11+</td>
<td>Huawei, RuStore</td>
<td>— </td>
</tr>
<tr>
<td> **Maintainability**</td>
<td>—</td>
<td>Coverage > 80%, linting, ADR, feature flags, Swagger</td>
<td>— </td>
</tr>
<tr>
<td> **Data Retention**</td>
<td>Orders 3y, PDn до удаления, audit 1y, cache 15min TTL</td>
<td>Logs 90d</td>
<td>— </td>
</tr>
<tr>
<td> **Data Recovery**</td>
<td>Daily full backup + WAL streaming, RPO < 1h, RTO < 4h</td>
<td>DR in another DC</td>
<td>— </td>
</tr>
<tr>
<td> **Food Safety**</td>
<td>Термоупаковка (заморозка/охлаждение), разделение химии и продуктов, срок годности > 50% от остатка</td>
<td>Логирование температуры при доставке</td>
<td>— </td>
</tr>
<tr>
<td> **Internationalization**</td>
<td>Русский язык (интерфейс, контент, платежи)</td>
<td>Locale-файлы, разделение кода и текста</td>
<td>EN/CN интерфейс (V3) </td>
</tr>
</tbody>
</table>

#### 1.3.1 Frontend Performance Budget

Конкретные бюджеты производительности для фронтенда (Web + Mobile Web). Согласовано с §2.2 Technology Stack (Next.js 10) и §7.4 Load Testing Targets.

**Core Web Vitals:**

<table>
<thead><tr>
<th> Метрика</th>
<th>Цель</th>
<th>Инструмент </th>
</tr></thead>
<tbody>
<tr>
<td> LCP (Largest Contentful Paint)</td>
<td>< 2.5 с</td>
<td>Lighthouse CI / Yandex.Metrica RUM </td>
</tr>
<tr>
<td> INP (Interaction to Next Paint)</td>
<td>< 200 мс</td>
<td>Lighthouse CI </td>
</tr>
<tr>
<td> CLS (Cumulative Layout Shift)</td>
<td>< 0.1</td>
<td>Lighthouse CI </td>
</tr>
<tr>
<td> TTFB (Time to First Byte)</td>
<td>< 800 мс</td>
<td>Lighthouse CI / Grafana </td>
</tr>
</tbody>
</table>

**Bundle budget:**

<table>
<thead><tr>
<th> Ресурс</th>
<th>Максимум (gzipped) </th>
</tr></thead>
<tbody>
<tr>
<td> Initial JS (весь фреймворк + роутинг)</td>
<td>< 200 KB </td>
</tr>
<tr>
<td> Initial CSS</td>
<td>< 50 KB </td>
</tr>
<tr>
<td> Total initial (JS + CSS + HTML)</td>
<td>< 300 KB </td>
</tr>
<tr>
<td> Per-route JS (код конкретной страницы)</td>
<td>< 50 KB </td>
</tr>
<tr>
<td> Vendor JS (библиотеки)</td>
<td>< 100 KB </td>
</tr>
</tbody>
</table>

**Image budget:**

<table>
<thead><tr>
<th> Тип изображения</th>
<th>Максимум</th>
<th>Формат</th>
<th>Примечание </th>
</tr></thead>
<tbody>
<tr>
<td> Hero (главный баннер)</td>
<td>< 100 KB</td>
<td>WebP / AVIF</td>
<td>Размеры: 1200×600 </td>
</tr>
<tr>
<td> Product card (каталог)</td>
<td>< 30 KB</td>
<td>WebP / AVIF</td>
<td>Размеры: 300×300 </td>
</tr>
<tr>
<td> Product detail (галерея)</td>
<td>< 80 KB</td>
<td>WebP / AVIF</td>
<td>Размеры: 600×600 </td>
</tr>
<tr>
<td> Total images per page</td>
<td>< 500 KB</td>
<td>—</td>
<td>Сумма всех изображений </td>
</tr>
<tr>
<td> Lazy loading</td>
<td>Обязательно</td>
<td>—</td>
<td>Всё ниже fold — loading="lazy" </td>
</tr>
</tbody>
</table>

**Font budget:**

<table>
<thead><tr>
<th> Параметр</th>
<th>Лимит </th>
</tr></thead>
<tbody>
<tr>
<td> Максимум семейств шрифтов</td>
<td>2 (например, Inter + Roboto Mono для кода) </td>
</tr>
<tr>
<td> Максимум начертаний на семейство</td>
<td>4 (Regular, Medium, Semibold, Bold) </td>
</tr>
<tr>
<td> Общий вес шрифтов</td>
<td>< 100 KB </td>
</tr>
<tr>
<td> `font-display`</td>
<td>`swap` (обязательно для всех) </td>
</tr>
<tr>
<td> Подгрузка</td>
<td>`preload` для основного шрифта, остальные — `preconnect` </td>
</tr>
</tbody>
</table>

**Third-party budget:**

<table>
<thead><tr>
<th> Параметр</th>
<th>Лимит </th>
</tr></thead>
<tbody>
<tr>
<td> Максимум сторонних скриптов</td>
<td>5 (Метрика, Sentry, CDN-шрифты, чат поддержки, ретаргетинг) </td>
</tr>
<tr>
<td> Общий вес third-party JS</td>
<td>< 100 KB </td>
</tr>
<tr>
<td> Асинхронная загрузка</td>
<td>`async` / `defer` для всех (кроме critical) </td>
</tr>
<tr>
<td> Self-hosted fallback</td>
<td>Sentry → self-hosted Sentry, шрифты → self-hosted </td>
</tr>
</tbody>
</table>

**Monitoring:**

<table>
<thead><tr>
<th> Инструмент</th>
<th>Что измеряем</th>
<th>Порог алерта </th>
</tr></thead>
<tbody>
<tr>
<td> Яндекс.Метрика (RUM)</td>
<td>LCP, INP, CLS, TTFB реальных пользователей</td>
<td>LCP > 3 с у 10% пользователей </td>
</tr>
<tr>
<td> Lighthouse CI (synthetic)</td>
<td>Performance score, bundle size</td>
<td>Score < 80 → fail </td>
</tr>
<tr>
<td> Grafana + Prometheus</td>
<td>TTFB сервера (p95)</td>
<td>> 800 мс → alert </td>
</tr>
<tr>
<td> sentry</td>
<td>JavaScript errors</td>
<td>> 1% сессий с ошибкой </td>
</tr>
</tbody>
</table>

**Enforcement:**

<table>
<thead><tr>
<th> Этап</th>
<th>Инструмент</th>
<th>Действие </th>
</tr></thead>
<tbody>
<tr>
<td> PR (CI)</td>
<td>`bundlesize` + Lighthouse CI</td>
<td>Блокировка PR при превышении budget </td>
</tr>
<tr>
<td> Code review</td>
<td>Чеклист: lazy loading, optimized images, no render-blocking</td>
<td>Ручная проверка </td>
</tr>
<tr>
<td> Staging</td>
<td>Lighthouse CI diff против baseline</td>
<td>Предупреждение команде </td>
</tr>
<tr>
<td> Production (ежедневно)</td>
<td>RUM dashboards (Grafana + Yandex.Metrica)</td>
<td>Автоматический алерт при нарушении SLA </td>
</tr>
</tbody>
</table>

### 1.4 External Integrations (Внешние интеграции)
**Источник:** Раздел 1.4 исходного документа.

Сводная таблица всех внешних систем (33 шт.) по категориям:

- **CRITICAL (6):**
  - Т-Банк API
  - Лента API
  - ОФД
  - Selectel Cloud
  - GitHub Actions
  - Docker Registry
- **HIGH (17):**
  - СБП, METRO, Вкусвилл
  - Яндекс.Карты, Google Maps, OSRM
  - SMS, FCM, Firestore, Scandit
  - ЭДО, CDN
  - App Store, Google Play
- **MEDIUM (9):**
  - POS-терминал, Super Babylon, Утконос
  - Telegram, Crashlytics
  - Честный знак, OpenWeather
  - Huawei, RuStore
- **LOW (1):**
  - Календарь праздников

### 1.5 Error Handling & Resilience (Обработка исключений)
**Источник:** Раздел 1.5 исходного документа.

- **Отказы внешних систем (10):**
  - сети магазинов, Т-Банк, SMS
  - геокодер, OSRM, OpenWeather
  - Firebase, CDN и др.
- **Отказы внутренних сервисов (6):**
  - PostgreSQL, Redis, RabbitMQ, ES
  - API Gateway, Dispatcher
- **Бизнес-исключения (12):** товара нет, заказ не подтверждён, платёж не прошёл, курьер не назначен, превышение веса, адрес вне зоны и др.
- **DLQ политика (5 очередей):** причины попадания и действия
- **Матрица timeout'ов (7 компонентов):** timeout, retry, fallback

### 1.6 Business Model (Бизнес-модель)

#### 1.6.1 Доходы (Revenue Streams)

<table>
<thead><tr>
<th> Статья</th>
<th>Описание</th>
<th>Расчёт</th>
<th>Доля в выручке (оценочно) </th>
</tr></thead>
<tbody>
<tr>
<td> **Комиссия с заказа**</td>
<td>Процент от суммы заказа (маржа агрегатора)</td>
<td>10–20% от стоимости товаров</td>
<td>~70% </td>
</tr>
<tr>
<td> **Плата за доставку**</td>
<td>Фиксированная стоимость доставки, зависит от зоны и суммы заказа</td>
<td>Бесплатно от N руб, иначе 149–399 руб за адрес</td>
<td>~15% </td>
</tr>
<tr>
<td> **Сервисный сбор**</td>
<td>Фиксированная плата за сборку заказа</td>
<td>49–99 руб за заказ</td>
<td>~10% </td>
</tr>
<tr>
<td> **B2B — индивидуальные тарифы**</td>
<td>Ежемесячная плата + индивидуальные цены для корпоративных клиентов</td>
<td>Договорная, от 10 000 руб/мес</td>
<td>~5% </td>
</tr>
<tr>
<td> **Premium-опции**</td>
<td>Приоритетная доставка, расширенный временной слот (V3)</td>
<td>+99 руб к заказу</td>
<td><1% </td>
</tr>
</tbody>
</table>

#### 1.6.2 Расходы (Cost Structure)

<table>
<thead><tr>
<th> Статья</th>
<th>Описание</th>
<th>Доля (оценочно) </th>
</tr></thead>
<tbody>
<tr>
<td> **Пикеры**</td>
<td>Почасовая оплата сотрудников в магазинах</td>
<td>~35% </td>
</tr>
<tr>
<td> **Курьеры**</td>
<td>Сдельная оплата за доставленный заказ (или процент)</td>
<td>~30% </td>
</tr>
<tr>
<td> **Инфраструктура**</td>
<td>Selectel (серверы, CDN), SMS-провайдер, Firebase, API</td>
<td>~10% </td>
</tr>
<tr>
<td> **Эквайринг**</td>
<td>Комиссия Т-Банка / СБП за обработку платежей (1.5–3%)</td>
<td>~5% </td>
</tr>
<tr>
<td> **Маркетинг**</td>
<td>Реклама, промокоды, программа лояльности</td>
<td>~10% </td>
</tr>
<tr>
<td> **Команда**</td>
<td>Разработка, поддержка, менеджмент</td>
<td>~10% </td>
</tr>
</tbody>
</table>

#### 1.6.3 Юнит-экономика

<table>
<thead><tr>
<th> Метрика</th>
<th>B2C</th>
<th>B2B </th>
</tr></thead>
<tbody>
<tr>
<td> **Средний чек**</td>
<td>4 800 руб</td>
<td>8 000–15 000 руб </td>
</tr>
<tr>
<td> **Комиссия сервиса**</td>
<td>15% (720 руб)</td>
<td>10% + фикс (договор) </td>
</tr>
<tr>
<td> **Стоимость сборки**</td>
<td>180 руб</td>
<td>300–400 руб </td>
</tr>
<tr>
<td> **Стоимость доставки**</td>
<td>300 руб</td>
<td>300–500 руб </td>
</tr>
<tr>
<td> **Комиссия эквайринга**</td>
<td>~2.2% (105 руб)</td>
<td>~2.2% (включено в договор) </td>
</tr>
<tr>
<td> **Маржинальность (до операционных расходов)**</td>
<td>~135 руб</td>
<td>200–500 руб </td>
</tr>
<tr>
<td> **LTV (жизненный цикл)**</td>
<td>3–6 месяцев (10–20 заказов)</td>
<td>12+ месяцев (регулярные) </td>
</tr>
</tbody>
</table>

**Ключевой вывод:** B2C — бизнес на объёме, маржинальность ~2.8% от оборота (выход в плюс при среднем чеке от 4 500 руб). B2B — бизнес на сервисе, маржинальность 3–6%. Оба сегмента взаимно дополняют друг друга.

#### 1.6.4 Модель ценообразования (Pricing)

<table>
<thead><tr>
<th> Параметр</th>
<th>Значение </th>
</tr></thead>
<tbody>
<tr>
<td> **Бесплатная доставка от**</td>
<td>2 500–4 000 руб (настраивается для каждого магазина) </td>
</tr>
<tr>
<td> **Стоимость доставки (если не бесплатно)**</td>
<td>199–399 руб </td>
</tr>
<tr>
<td> **Сервисный сбор**</td>
<td>49–99 руб (фикс, не зависит от суммы) </td>
</tr>
<tr>
<td> **Минимальная сумма заказа**</td>
<td>500–800 руб </td>
</tr>
<tr>
<td> **Надбавка за пиковое время**</td>
<td>×1.3 (17:00–20:00) </td>
</tr>
<tr>
<td> **Надбавка за погоду**</td>
<td>×1.2–1.5 (дождь/снег) </td>
</tr>
<tr>
<td> **B2B — отсрочка платежа**</td>
<td>7–30 дней, после утверждения кредитного лимита </td>
</tr>
</tbody>
</table>

#### 1.6.5 Ключевые метрики для дашборда

<table>
<thead><tr>
<th> Метрика</th>
<th>Формула</th>
<th>Цель (MVP) </th>
</tr></thead>
<tbody>
<tr>
<td> **Заказов/день**</td>
<td>—</td>
<td>≥ 50 </td>
</tr>
<tr>
<td> **Выручка/день**</td>
<td>Сумма комиссий + доставка + сервис</td>
<td>≥ 100 000 руб </td>
</tr>
<tr>
<td> **Средний чек**</td>
<td>Выручка / кол-во заказов</td>
<td>≥ 2 500 руб </td>
</tr>
<tr>
<td> **Конверсия**</td>
<td>Заказов / посетителей сайта</td>
<td>≥ 3% </td>
</tr>
<tr>
<td> **Маржинальность**</td>
<td>(Выручка - затраты) / Выручка</td>
<td>> 0% (с V2 — > 10%) </td>
</tr>
<tr>
<td> **CAC (стоимость привлечения)**</td>
<td>Расходы на маркетинг / новые клиенты</td>
<td>< 500 руб </td>
</tr>
<tr>
<td> **LTV/CAC**</td>
<td>LTV / CAC</td>
<td>> 3 </td>
</tr>
<tr>
<td> **NPS**</td>
<td>Опрос клиентов</td>
<td>> 40 </td>
</tr>
</tbody>
</table>

#### 1.6.6 Франшиза (Franchise Model)

Подробнее — в [roadmap/V3_FRANCHISE.md](roadmap/V3_FRANCHISE.md). Этап внедрения: V3.

---

---

# Том 2: Technical Specification

## 2. System Architecture (Архитектура системы)

### 2.1 Architecture Style & Patterns
**Источник:** Раздел 5.7.1 исходного документа.

**Микросервисная архитектура** (миграция с монолита Rails).

*Обоснование:* каждый BP можно масштабировать независимо, изолировать сбои в одной сети/платёжном шлюзе, использовать разный стек (Go/Node.js для dispatch, Python для ML ETA).

*Архитектурные паттерны:*

<table>
<thead><tr>
<th> Паттерн</th>
<th>Где применить</th>
<th>Зачем </th>
</tr></thead>
<tbody>
<tr>
<td> **DDD (Domain-Driven Design)**</td>
<td>Catalog, Order, Delivery</td>
<td>Сложная бизнес-логика с разными контекстами (сеть магазинов ≠ доставка) </td>
</tr>
<tr>
<td> **CQRS**</td>
<td>Catalog (Read/Write split)</td>
<td>Чтение каталога (веб-клиенты) vs запись (админка, синхронизация) — разные нагрузки и модели </td>
</tr>
<tr>
<td> **Event Sourcing**</td>
<td>Order Service</td>
<td>Полная аудитория заказа — цепочка событий (создан → оплачен → назначен пикер → собран → передан курьеру → доставлен) </td>
</tr>
<tr>
<td> **Vertical Slice**</td>
<td>Каждый сервис</td>
<td>Каждая фича — сквозная реализация (handler → use case → repository) </td>
</tr>
<tr>
<td> **Event-Driven**</td>
<td>Межсервисная коммуникация</td>
<td>RabbitMQ — асинхронная доставка событий (order.created → dispatch → eta) </td>
</tr>
<tr>
<td> **Façade / Service-Adapter**</td>
<td>API Gateway</td>
<td>Три типа маршрутов: **proxy** (сквозной прокси без изменений), **transform** (адаптация формата между старым и новым API), **aggregate** (сборка ответа из нескольких сервисов). Ключевой паттерн миграции (Strangler-Fig) — новый сервис подключается за Façade, старый маршрут переключается без изменения клиента </td>
</tr>
</tbody>
</table>

### 2.2 Technology Stack
**Источник:** Раздел 1.1 исходного документа.

<table>
<thead><tr>
<th> Уровень</th>
<th>Технология</th>
<th>Версия</th>
<th>Назначение </th>
</tr></thead>
<tbody>
<tr>
<td> **Backend**</td>
<td>Ruby on Rails</td>
<td>5.1+</td>
<td>API, бизнес-логика, админка </td>
</tr>
<tr>
<td></td>
<td>Ruby</td>
<td>2.6–2.7</td>
<td>Язык рантайма (см. Gemfile) </td>
</tr>
<tr>
<td></td>
<td>Sidekiq</td>
<td>~6.x</td>
<td>Фоновые задачи (уведомления, синхронизация) </td>
</tr>
<tr>
<td></td>
<td>Carrierwave + MiniMagick</td>
<td>~1.0</td>
<td>Загрузка и обработка изображений </td>
</tr>
<tr>
<td> **Frontend**</td>
<td>Next.js</td>
<td>10</td>
<td>SSR + SPA-роутинг </td>
</tr>
<tr>
<td></td>
<td>React</td>
<td>17</td>
<td>UI-компоненты </td>
</tr>
<tr>
<td></td>
<td>MobX</td>
<td>~6.x</td>
<td>State management </td>
</tr>
<tr>
<td></td>
<td>Webpack + Babel 7 + PostCSS + CSS Modules</td>
<td>—</td>
<td>Сборка фронтенда </td>
</tr>
<tr>
<td> **Mobile**</td>
<td>Flutter</td>
<td>3.x</td>
<td>Кроссплатформенное мобильное приложение </td>
</tr>
<tr>
<td> **Базы данных**</td>
<td>PostgreSQL</td>
<td>13+</td>
<td>Основное хранилище </td>
</tr>
<tr>
<td></td>
<td>Redis</td>
<td>6+</td>
<td>Кэш, очередь (Sidekiq), сессии </td>
</tr>
<tr>
<td></td>
<td>Elasticsearch</td>
<td>7.x</td>
<td>Поисковый индекс (каталог товаров) </td>
</tr>
<tr>
<td> **Инфраструктура**</td>
<td>Selectel</td>
<td>—</td>
<td>Облако, CDN (изображения товаров) </td>
</tr>
<tr>
<td></td>
<td>Docker / Docker Compose</td>
<td>—</td>
<td>Локальная разработка, тестовые среды </td>
</tr>
<tr>
<td></td>
<td>Nginx</td>
<td>—</td>
<td>Reverse proxy, API Gateway </td>
</tr>
<tr>
<td> **Мониторинг**</td>
<td>Sentry</td>
<td>—</td>
<td>Error tracking (backend + mobile) </td>
</tr>
<tr>
<td></td>
<td>Prometheus + Grafana</td>
<td>—</td>
<td>Метрики + дашборды </td>
</tr>
<tr>
<td></td>
<td>Jaeger</td>
<td>—</td>
<td>Distributed tracing </td>
</tr>
<tr>
<td> **Платежи**</td>
<td>Т-Банк API</td>
<td>—</td>
<td>Онлайн-оплата </td>
</tr>
<tr>
<td></td>
<td>СБП (QR)</td>
<td>—</td>
<td>Оплата при получении </td>
</tr>
</tbody>
</table>

### 2.3 Microservices Breakdown
**Источник:** Раздел 5.7.2 исходного документа.

<table>
<thead><tr>
<th> Сервис</th>
<th>BP</th>
<th>Технология</th>
<th>Хранилище</th>
<th>Коммуникация </th>
</tr></thead>
<tbody>
<tr>
<td> **API Gateway**</td>
<td>Cross-cutting</td>
<td>Nginx / Traefik</td>
<td>—</td>
<td>REST → сервисы </td>
</tr>
<tr>
<td> **Auth Service**</td>
<td>BP-01</td>
<td>Rails</td>
<td>PostgreSQL + Redis (sessions)</td>
<td>REST + JWT </td>
</tr>
<tr>
<td> **Catalog Service (Read)**</td>
<td>BP-02</td>
<td>Next.js → API</td>
<td>PostgreSQL (cache: Redis, search: ES)</td>
<td>REST + GraphQL </td>
</tr>
<tr>
<td> **Catalog Service (Write)**</td>
<td>BP-02, Chain sync</td>
<td>Ruby (Sidekiq worker)</td>
<td>PostgreSQL + EventStoreDB</td>
<td>Events (RabbitMQ) </td>
</tr>
<tr>
<td> **Cart Service**</td>
<td>BP-03</td>
<td>Rails</td>
<td>Redis</td>
<td>REST (stateless) </td>
</tr>
<tr>
<td> **Order Service**</td>
<td>BP-03, BP-07</td>
<td>Rails + Event Sourcing</td>
<td>PostgreSQL + EventStoreDB</td>
<td>Events + REST </td>
</tr>
<tr>
<td> **Payment Service**</td>
<td>BP-04</td>
<td>Rails / Go</td>
<td>PostgreSQL</td>
<td>REST + Webhooks </td>
</tr>
<tr>
<td> **Picker Service**</td>
<td>BP-05</td>
<td>Rails + Flutter API</td>
<td>PostgreSQL</td>
<td>REST + Firestore (real-time) </td>
</tr>
<tr>
<td> **Delivery Service**</td>
<td>BP-06</td>
<td>Go / Rails</td>
<td>PostgreSQL</td>
<td>Events + REST </td>
</tr>
<tr>
<td> **Dispatcher**</td>
<td>BP-06</td>
<td>Go (или TypeScript)</td>
<td>Redis (geospatial) + PostgreSQL</td>
<td>Events (RabbitMQ) </td>
</tr>
<tr>
<td> **ETA Estimator**</td>
<td>BP-06</td>
<td>Python / Go</td>
<td>Redis (кэш OSRM)</td>
<td>Events + REST </td>
</tr>
<tr>
<td> **Notification Service**</td>
<td>BP-09</td>
<td>Rails (Sidekiq)</td>
<td>PostgreSQL (templates)</td>
<td>Events (RabbitMQ) </td>
</tr>
<tr>
<td> **Admin API**</td>
<td>BP-11</td>
<td>Rails Admin</td>
<td>PostgreSQL</td>
<td>REST </td>
</tr>
<tr>
<td> **Inventory Service**</td>
<td>BP-05, BP-02, Store sync</td>
<td>Go / Ruby (Sidekiq)</td>
<td>PostgreSQL + Redis (TTL cache)</td>
<td>Events (RabbitMQ) </td>
</tr>
</tbody>
</table>

**Inventory Service** — управление остатками: синхронизация с API магазинов, резервирование при оформлении заказа, TTL-кэш горячих остатков в Redis. Отдельный сервис, так как остатки (a) обновляются с другой частотой (минуты vs часы), (б) требуют reservation-логики, (в) живут по своим SLA.

*Коммуникация:* сервисы общаются через RabbitMQ (event-driven). REST/gRPC — только для синхронных запросов (API Gateway → сервисы). Event Sourcing — EventStoreDB для Order.

### 2.4 Architecture Decision Records (ADRs)
**Источник:** Раздел 5.7.3 исходного документа.

<table>
<thead><tr>
<th> ID</th>
<th>Решение</th>
<th>Статус</th>
<th>Обоснование </th>
</tr></thead>
<tbody>
<tr>
<td> ADR-001</td>
<td>**Микросервисы вместо монолита**</td>
<td>✓</td>
<td>Изоляция blast radius, независимое масштабирование, разный стек для разных задач </td>
</tr>
<tr>
<td> ADR-002</td>
<td>**RabbitMQ для event-driven**</td>
<td>✓</td>
<td>Проверенный брокер, поддержка в Rails (Bunny/Sneakers), гарантированная доставка </td>
</tr>
<tr>
<td> ADR-003</td>
<td>**PostgreSQL per service + Redis cache + ES search**</td>
<td>✓</td>
<td>Каждый сервис владеет своей БД, Redis для горячего кэша каталога, ES для поиска </td>
</tr>
<tr>
<td> ADR-004</td>
<td>**Read/Write split Catalog**</td>
<td>✓</td>
<td>Чтение каталога (веб/мобайл) — высокая нагрузка, запись (админка, синхронизация) — редкая, тяжёлая </td>
</tr>
<tr>
<td> ADR-005</td>
<td>**Flutter для mobile (picker + courier)**</td>
<td>✓</td>
<td>Кроссплатформенность, единая кодовая база, offline-first экосистема (Hive + sync queue) </td>
</tr>
<tr>
<td> ADR-006</td>
<td>**Redis GEO для dispatch**</td>
<td>✓</td>
<td>`GEOADD`/`GEORADIUS` — p95 < 100ms для поиска ближайших курьеров, против ~380ms с PostGIS </td>
</tr>
</tbody>
</table>

### 2.5 Integration Context Map (Context Map)
**Источник:** Раздел 5.7.4 исходного документа.

![Рис. 1: Контекстная диаграмма интеграций — API Gateway, сервисы, БД, внешние системы](exports/diagrams/diagram-01.png)

#### 2.5.1 Store API Integration Details

Детальные описания интеграций вынесены в отдельные файлы:

- **Лента (MVP):** [integrations/lenta.md](integrations/lenta.md)
- **Вкусвилл (V2):** [integrations/vkusvill.md](integrations/vkusvill.md)
- **Super Babylon (V2):** без API — физическое присутствие сборщика в магазине

### 2.6 Observability
**Источник:** Раздел 5.7.5 исходного документа.

<table>
<thead><tr>
<th> Компонент</th>
<th>Назначение</th>
<th>Интеграция </th>
</tr></thead>
<tbody>
<tr>
<td> **Prometheus**</td>
<td>Сбор метрик со всех сервисов (`/metrics`)</td>
<td>Pull-модель </td>
</tr>
<tr>
<td> **Grafana**</td>
<td>Дашборды: `services-overview`, `business-metrics`, `slo-violations`</td>
<td>Предустановленные дашборды </td>
</tr>
<tr>
<td> **Loki + Promtail**</td>
<td>Централизованный сбор логов (JSON-structured)</td>
<td>LogQL для поиска </td>
</tr>
<tr>
<td> **Jaeger**</td>
<td>Distributed tracing</td>
<td>OpenTelemetry instrumentation </td>
</tr>
<tr>
<td> **Sentry**</td>
<td>Error tracking (backend + Flutter)</td>
<td>SDK на всех сервисах </td>
</tr>
<tr>
<td> **Яндекс.Метрика**</td>
<td>Бизнес-аналитика: конверсии, воронки, источники трафика</td>
<td>Установка счётчика на Web (Next.js) </td>
</tr>
</tbody>
</table>

> **Разделение:** Prometheus/Grafana — технический мониторинг (латентность, ошибки, ёмкость). Яндекс.Метрика — бизнес-аналитика (поведение пользователей, конверсия).

#### 2.6.1 Analytics Events Schema

Стандартная схема событий для продуктовой аналитики. Используется всеми сервисами (backend + frontend + mobile) для единообразного сбора данных. Согласовано с §2.9 Event Catalog (бизнес-события не дублируются) и §6.2 Data Protection (PII-фильтрация).

**Стандартная схема:**

```json
{
  "event_name": "product_clicked",
  "timestamp": "2026-06-17T10:00:00Z",
  "user_id": "uuid",
  "session_id": "uuid",
  "device_type": "web",
  "properties": {
    "product_id": "12345",
    "price": 499.90,
    "position": 3,
    "source": "search_results"
  }
}
```

**Каталог событий:**

<table>
<thead><tr>
<th> Событие</th>
<th>Когда</th>
<th>Ключевые properties</th>
<th>Sampling </th>
</tr></thead>
<tbody>
<tr>
<td> `catalog_viewed`</td>
<td>Открытие каталога</td>
<td>store_id, category_id, sorting</td>
<td>10% </td>
</tr>
<tr>
<td> `product_viewed`</td>
<td>Открытие карточки товара</td>
<td>product_id, price, position</td>
<td>10% </td>
</tr>
<tr>
<td> `product_clicked`</td>
<td>Клик по товару в списке</td>
<td>product_id, position, source (search/category/promo)</td>
<td>10% </td>
</tr>
<tr>
<td> `search_performed`</td>
<td>Поиск</td>
<td>query, results_count, filters</td>
<td>10% </td>
</tr>
<tr>
<td> `cart_updated`</td>
<td>Изменение корзины</td>
<td>action (add/remove), product_id, delta, cart_value</td>
<td>100% </td>
</tr>
<tr>
<td> `checkout_started`</td>
<td>Переход к оформлению</td>
<td>cart_value, items_count, selected_slot</td>
<td>100% </td>
</tr>
<tr>
<td> `payment_started`</td>
<td>Начало оплаты</td>
<td>method (card/sbp/cash), amount</td>
<td>100% </td>
</tr>
<tr>
<td> `payment_completed`</td>
<td>Успешная оплата</td>
<td>method, amount, payment_id</td>
<td>100% </td>
</tr>
<tr>
<td> `payment_failed`</td>
<td>Неудачная оплата</td>
<td>method, amount, error_code, error_reason</td>
<td>100% </td>
</tr>
<tr>
<td> `order_created`</td>
<td>Заказ создан</td>
<td>order_id, value, items_count, store_id</td>
<td>100% </td>
</tr>
<tr>
<td> `order_cancelled`</td>
<td>Заказ отменён</td>
<td>order_id, reason (client/no_stock/other), stage</td>
<td>100% </td>
</tr>
<tr>
<td> `promo_applied`</td>
<td>Промокод применён</td>
<td>code, discount_percent, discount_value</td>
<td>100% </td>
</tr>
<tr>
<td> `courier_assigned`</td>
<td>Курьер назначен</td>
<td>order_id, eta_minutes</td>
<td>100% </td>
</tr>
<tr>
<td> `delivery_started`</td>
<td>Курьер выехал</td>
<td>order_id, courier_id</td>
<td>100% </td>
</tr>
<tr>
<td> `delivery_completed`</td>
<td>Доставка завершена</td>
<td>order_id, on_time (bool)</td>
<td>100% </td>
</tr>
<tr>
<td> `app_opened`</td>
<td>Открытие мобильного приложения</td>
<td>app_version, platform</td>
<td>10% </td>
</tr>
<tr>
<td> `screen_viewed`</td>
<td>Просмотр экрана (mobile)</td>
<td>screen_name, referrer</td>
<td>10% </td>
</tr>
</tbody>
</table>

**PII-фильтрация:**

<table>
<thead><tr>
<th> Категория</th>
<th>Данные</th>
<th>Разрешено? </th>
</tr></thead>
<tbody>
<tr>
<td> **НЕ трекать**</td>
<td>Телефон, email, точный адрес (улица+дом), ФИО, номер карты</td>
<td>❌ Запрещено </td>
</tr>
<tr>
<td> **МОЖНО трекать**</td>
<td>user_id (UUID, анонимизированный), город, категория товара, store_id</td>
<td>✅ Разрешено </td>
</tr>
<tr>
<td> **Только с согласия**</td>
<td>Точная геолокация (lat/lng), device ID</td>
<td>⚠️ Требуется consent </td>
</tr>
</tbody>
</table>

**Интеграции:**

<table>
<thead><tr>
<th> Система</th>
<th>Назначение</th>
<th>Статус </th>
</tr></thead>
<tbody>
<tr>
<td> **Яндекс.Метрика**</td>
<td>Основная бизнес-аналитика (воронки, конверсии, отчёты)</td>
<td>MVP (Web) </td>
</tr>
<tr>
<td> **Firebase Analytics**</td>
<td>Мобильная аналитика (iOS/Android)</td>
<td>MVP </td>
</tr>
<tr>
<td> **ClickHouse**</td>
<td>Хранилище сырых событий для data team (кастомные запросы, ML)</td>
<td>V2 </td>
</tr>
<tr>
<td> **Amplitude / Mixpanel**</td>
<td>Продуктовая аналитика (retention, cohorts, A/B)</td>
<td>V2 </td>
</tr>
</tbody>
</table>

**Enforcement:**

<table>
<thead><tr>
<th> Этап</th>
<th>Что проверяем</th>
<th>Инструмент </th>
</tr></thead>
<tbody>
<tr>
<td> PR (backend)</td>
<td>Новые события зарегистрированы в каталоге</td>
<td>Code review + JSON Schema validation </td>
</tr>
<tr>
<td> PR (frontend/mobile)</td>
<td>Событие отправляется с правильными полями</td>
<td>Code review + TypeScript types </td>
</tr>
<tr>
<td> Staging</td>
<td>Валидность JSON-схемы события</td>
<td>Integration test (event emitted → schema valid) </td>
</tr>
<tr>
<td> Prod monitoring</td>
<td>Дельта событий (не упала ли какая-то воронка)</td>
<td>Grafana dashboard + alert</td>
</tr>
</tbody>
</table>

#### 2.7.1 API Versioning

- Формат URL: `/api/v1/`, `/api/v2/`
- Версия передаётся в URL path (не header) — явно видна в логах и документации
- Minor-изменения (добавление полей) — обратно совместимы, без смены версии
- Major-изменения (удаление/переименование полей, изменение семантики) — новая версия URL

#### 2.7.2 Deprecation Policy

**SLA поддержки старых версий:**

<table>
<thead><tr>
<th> Тип изменения</th>
<th>SLA поддержки после объявления deprecation </th>
</tr></thead>
<tbody>
<tr>
<td> Minor (v1.1 → v1.2)</td>
<td>3 месяца </td>
</tr>
<tr>
<td> Major (v1 → v2)</td>
<td>12 месяцев </td>
</tr>
<tr>
<td> Критические security-фиксы</td>
<td>До конца SLA </td>
</tr>
</tbody>
</table>

**Механизмы уведомления клиентов:**

<table>
<thead><tr>
<th> Канал</th>
<th>Когда</th>
<th>Для кого </th>
</tr></thead>
<tbody>
<tr>
<td> HTTP-заголовок `Sunset: <date>` (RFC 8594)</td>
<td>За 6 месяцев</td>
<td>Все API-клиенты </td>
</tr>
<tr>
<td> HTTP-заголовок `Deprecation: true`</td>
<td>С момента объявления</td>
<td>Все API-клиенты </td>
</tr>
<tr>
<td> HTTP-заголовок `Link: <url>; rel="successor-version"`</td>
<td>С момента объявления</td>
<td>Все API-клиенты </td>
</tr>
<tr>
<td> Email-уведомление</td>
<td>За 3 месяца</td>
<td>B2B-клиенты </td>
</tr>
<tr>
<td> In-app баннер</td>
<td>За 1 месяц</td>
<td>Мобильные приложения </td>
</tr>
</tbody>
</table>

**Migration Guide:**

- Для каждой major-версии — отдельный документ `docs/migrations/v1-to-v2.md`
- Changelog breaking changes
- Примеры кода «было → стало»

#### 2.7.3 Стратегия для мобильных приложений

<table>
<thead><tr>
<th> Механизм</th>
<th>Описание </th>
</tr></thead>
<tbody>
<tr>
<td> **Forced update**</td>
<td>При критических breaking changes — `X-Min-App-Version` header, блокировка старых версий </td>
</tr>
<tr>
<td> **Soft deprecation**</td>
<td>In-app баннер «Обновите приложение» для не-критических изменений </td>
</tr>
<tr>
<td> **N-2 support**</td>
<td>Поддержка двух последних major-версий (iOS/Android) </td>
</tr>
<tr>
<td> **Graceful degradation**</td>
<td>Старая версия продолжает работать, но новые фичи недоступны </td>
</tr>
</tbody>
</table>

#### 2.7.4 Feature Flags для API

- Возможность включать новые эндпоинты по одному (canary release)
- A/B-тестирование версий API
- Feature flag provider: LaunchDarkly / ConfigCat / встроенный в админку

#### 2.7.5 Error Code Standard

**Формат ответа с ошибкой:**
```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Заказ с указанным ID не найден",
    "details": { "order_id": "12345" },
    "request_id": "req_abc123"
  }
}
```

**Категории ошибок:**
<table>
<thead><tr>
<th> Диапазон</th>
<th>Категория</th>
<th>Примеры </th>
</tr></thead>
<tbody>
<tr>
<td> `AUTH_*`</td>
<td>Аутентификация/авторизация</td>
<td>`AUTH_TOKEN_EXPIRED`, `AUTH_INSUFFICIENT_ROLE` </td>
</tr>
<tr>
<td> `VAL_*`</td>
<td>Валидация</td>
<td>`VAL_MISSING_FIELD`, `VAL_INVALID_FORMAT` </td>
</tr>
<tr>
<td> `BIZ_*`</td>
<td>Бизнес-логика</td>
<td>`BIZ_PRODUCT_UNAVAILABLE`, `BIZ_ORDER_CANNOT_CANCEL` </td>
</tr>
<tr>
<td> `INT_*`</td>
<td>Интеграция</td>
<td>`INT_PAYMENT_DECLINED`, `INT_STORE_API_ERROR` </td>
</tr>
<tr>
<td> `SYS_*`</td>
<td>Системные</td>
<td>`SYS_INTERNAL_ERROR`, `SYS_TIMEOUT` </td>
</tr>
</tbody>
</table>

### 2.8 Mobile Application Architecture

Подробное описание мобильной архитектуры вынесено в отдельный ADR: **`ADR-007: Mobile Architecture`**.

Кратко: клиентские приложения на Flutter 3.x, единая кодовая база для iOS/Android. State management: Provider (пикер), BLoC + Provider (курьер), MobX (клиент). Offline: Hive (курьер), Firestore offline persistence (пикер).

### 2.9 Event Catalog

Система событий (Event-Driven через RabbitMQ). Каждое событие публикуется одним сервисом, потребляется одним или несколькими.

<table>
<thead><tr>
<th> Событие</th>
<th>Publisher</th>
<th>Consumers</th>
<th>Схема (ключевые поля) </th>
</tr></thead>
<tbody>
<tr>
<td> `order.created`</td>
<td>Order Service</td>
<td>Dispatcher, Notification, Analytics</td>
<td>`order_id`, `user_id`, `store_id`, `total`, `items[]` </td>
</tr>
<tr>
<td> `order.paid`</td>
<td>Payment Service</td>
<td>Order, Dispatcher, Notification</td>
<td>`order_id`, `payment_id`, `amount`, `method` </td>
</tr>
<tr>
<td> `order.assigned`</td>
<td>Dispatcher</td>
<td>Order, Picker, Courier, Notification</td>
<td>`order_id`, `picker_id`, `courier_id`, `eta` </td>
</tr>
<tr>
<td> `order.picking_started`</td>
<td>Picker Service</td>
<td>Order, Notification, Analytics</td>
<td>`order_id`, `picker_id`, `started_at` </td>
</tr>
<tr>
<td> `order.picking_completed`</td>
<td>Picker Service</td>
<td>Delivery, Order, Notification</td>
<td>`order_id`, `picker_id`, `items_found`, `items_substituted` </td>
</tr>
<tr>
<td> `order.in_transit`</td>
<td>Delivery Service</td>
<td>Order, Notification, Tracking</td>
<td>`order_id`, `courier_id`, `eta`, `route[]` </td>
</tr>
<tr>
<td> `order.delivered`</td>
<td>Courier App</td>
<td>Order, Payment, Notification, Analytics</td>
<td>`order_id`, `courier_id`, `pod_signature`, `pod_photo` </td>
</tr>
<tr>
<td> `order.cancelled`</td>
<td>Order Service</td>
<td>Payment, Inventory, Notification</td>
<td>`order_id`, `reason`, `refund_amount` </td>
</tr>
<tr>
<td> `payment.refunded`</td>
<td>Payment Service</td>
<td>Order, Notification, Analytics</td>
<td>`order_id`, `refund_id`, `amount` </td>
</tr>
<tr>
<td> `inventory.low`</td>
<td>Inventory Service</td>
<td>Admin, Notification</td>
<td>`store_id`, `product_id`, `quantity` </td>
</tr>
<tr>
<td> `catalog.synced`</td>
<td>Catalog Write Service</td>
<td>Inventory, Analytics</td>
<td>`chain_id`, `products_count`, `errors` </td>
</tr>
<tr>
<td> `dispatch.cycle`</td>
<td>Dispatcher</td>
<td>ETA Estimator, Delivery</td>
<td>`zone_id`, `orders[]`, `couriers[]` </td>
</tr>
</tbody>
</table>

---

### 2.10 State Machine Diagrams

Формальные State Machine Diagrams для ключевых сущностей. Каждый переход включает триггер, preconditions, postconditions, инициатора и публикуемое событие.

#### 2.10.1 Order

![Рис. 2: Order — State Machine (создан → оплачен → сборка → доставка → завершён)](exports/diagrams/diagram-02.png)

<table>
<thead><tr>
<th> Переход</th>
<th>Триггер</th>
<th>Preconditions</th>
<th>Postconditions</th>
<th>Инициатор</th>
<th>Событие </th>
</tr></thead>
<tbody>
<tr>
<td> `pending → paid`</td>
<td>`payment.succeeded` webhook</td>
<td>order.status == 'pending', payment.status == 'succeeded'</td>
<td>order.status = 'paid', payment recorded</td>
<td>Payment Service</td>
<td>`order.paid` </td>
</tr>
<tr>
<td> `pending → cancelled`</td>
<td>User clicks "Cancel"</td>
<td>order.status == 'pending'</td>
<td>order.status = 'cancelled', full refund</td>
<td>Customer</td>
<td>`order.cancelled` </td>
</tr>
<tr>
<td> `paid → picking`</td>
<td>Dispatcher assigns picker</td>
<td>order.status == 'paid', picker available</td>
<td>order.status = 'picking', picker_id set</td>
<td>Dispatcher</td>
<td>`order.picking_started` </td>
</tr>
<tr>
<td> `paid → cancelled`</td>
<td>User clicks "Cancel"</td>
<td>order.status == 'paid', picking not started</td>
<td>order.status = 'cancelled', refund minus fee</td>
<td>Customer</td>
<td>`order.cancelled` </td>
</tr>
<tr>
<td> `picking → packed`</td>
<td>Picker confirms packing</td>
<td>order.status == 'picking', all items processed</td>
<td>order.status = 'packed', packed_at set</td>
<td>Picker App</td>
<td>`order.picking_completed` </td>
</tr>
<tr>
<td> `picking → cancelled`</td>
<td>Admin cancels</td>
<td>order.status == 'picking'</td>
<td>order.status = 'cancelled', refund processed</td>
<td>Admin</td>
<td>`order.cancelled` </td>
</tr>
<tr>
<td> `packed → in_transit`</td>
<td>Courier picks up</td>
<td>order.status == 'packed', courier assigned</td>
<td>order.status = 'in_transit', picked_up_at set</td>
<td>Courier App</td>
<td>`order.in_transit` </td>
</tr>
<tr>
<td> `in_transit → delivered`</td>
<td>Courier confirms delivery</td>
<td>order.status == 'in_transit', POD captured</td>
<td>order.status = 'delivered', delivered_at set</td>
<td>Courier App</td>
<td>`order.delivered` </td>
</tr>
<tr>
<td> `in_transit → cancelled`</td>
<td>Delivery failed</td>
<td>order.status == 'in_transit', delivery failed</td>
<td>order.status = 'cancelled', full refund</td>
<td>System</td>
<td>`order.cancelled` </td>
</tr>
<tr>
<td> `delivered → refunded`</td>
<td>Return requested</td>
<td>order.status == 'delivered', within 14 days</td>
<td>order.status = 'refunded', refund processed</td>
<td>Customer</td>
<td>`payment.refunded` </td>
</tr>
</tbody>
</table>

#### 2.10.2 Payment

![Рис. 3: Payment — State Machine (ожидание → обработан → refund)](exports/diagrams/diagram-03.png)

<table>
<thead><tr>
<th> Переход</th>
<th>Триггер</th>
<th>Preconditions</th>
<th>Postconditions</th>
<th>Инициатор</th>
<th>Событие </th>
</tr></thead>
<tbody>
<tr>
<td> `pending → processing`</td>
<td>User submits payment</td>
<td>payment.status == 'pending', payment method selected</td>
<td>payment.status = 'processing', bank request sent</td>
<td>Payment Service</td>
<td>— </td>
</tr>
<tr>
<td> `processing → succeeded`</td>
<td>Bank webhook (success)</td>
<td>payment.status == 'processing', 3DSecure passed</td>
<td>payment.status = 'succeeded', order.status = 'paid'</td>
<td>T-Bank</td>
<td>`order.paid` </td>
</tr>
<tr>
<td> `processing → failed`</td>
<td>Bank webhook (decline)</td>
<td>payment.status == 'processing', bank declined</td>
<td>payment.status = 'failed', error stored</td>
<td>T-Bank</td>
<td>— </td>
</tr>
<tr>
<td> `succeeded → refunded`</td>
<td>Admin initiates refund</td>
<td>payment.status == 'succeeded', refund requested</td>
<td>payment.status = 'refunded', money returned</td>
<td>Payment Service</td>
<td>`payment.refunded` </td>
</tr>
<tr>
<td> `failed → processing`</td>
<td>User retries payment</td>
<td>payment.status == 'failed', within retry limit</td>
<td>payment.status = 'processing', new bank request</td>
<td>Payment Service</td>
<td>— </td>
</tr>
</tbody>
</table>

#### 2.10.3 Delivery

![Рис. 4: Delivery — State Machine (ожидание → в пути → доставлен → возврат)](exports/diagrams/diagram-04.png)

<table>
<thead><tr>
<th> Переход</th>
<th>Триггер</th>
<th>Preconditions</th>
<th>Postconditions</th>
<th>Инициатор</th>
<th>Событие </th>
</tr></thead>
<tbody>
<tr>
<td> `pending → assigned`</td>
<td>Dispatcher assigns courier</td>
<td>delivery.status == 'pending', courier found</td>
<td>delivery.status = 'assigned', courier_id, ETA set</td>
<td>Dispatcher</td>
<td>`order.assigned` </td>
</tr>
<tr>
<td> `assigned → picking_up`</td>
<td>Courier arrives at store</td>
<td>delivery.status == 'assigned', courier at store location</td>
<td>delivery.status = 'picking_up'</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `picking_up → in_transit`</td>
<td>Courier loads package</td>
<td>delivery.status == 'picking_up', package scanned</td>
<td>delivery.status = 'in_transit', route started</td>
<td>Courier App</td>
<td>`order.in_transit` </td>
</tr>
<tr>
<td> `in_transit → delivered`</td>
<td>Courier confirms delivery</td>
<td>delivery.status == 'in_transit', POD captured</td>
<td>delivery.status = 'delivered', delivered_at set</td>
<td>Courier App</td>
<td>`order.delivered` </td>
</tr>
<tr>
<td> `in_transit → failed`</td>
<td>Delivery timeout / customer unavailable</td>
<td>delivery.status == 'in_transit', max attempts reached</td>
<td>delivery.status = 'failed', return initiated</td>
<td>System</td>
<td>— </td>
</tr>
<tr>
<td> `failed → returned`</td>
<td>Courier returns package to store</td>
<td>delivery.status == 'failed', package intact</td>
<td>delivery.status = 'returned', stock restored</td>
<td>Courier App</td>
<td>— </td>
</tr>
</tbody>
</table>

#### 2.10.4 Courier

![Рис. 5: Courier — State Machine (свободен → назначен → занят → офлайн)](exports/diagrams/diagram-05.png)

<table>
<thead><tr>
<th> Переход</th>
<th>Триггер</th>
<th>Preconditions</th>
<th>Postconditions</th>
<th>Инициатор</th>
<th>Событие </th>
</tr></thead>
<tbody>
<tr>
<td> `offline → free`</td>
<td>Courier comes online</td>
<td>courier.status == 'offline', shift scheduled</td>
<td>courier.status = 'free', available for dispatch</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `free → busy`</td>
<td>Delivery assigned</td>
<td>courier.status == 'free', dispatch picks courier</td>
<td>courier.status = 'busy', active_delivery_id set</td>
<td>Dispatcher</td>
<td>— </td>
</tr>
<tr>
<td> `busy → free`</td>
<td>Delivery completed</td>
<td>courier.status == 'busy', delivery marked done</td>
<td>courier.status = 'free', ready for next</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `free → on_break`</td>
<td>Courier starts break</td>
<td>courier.status == 'free', break quota remaining</td>
<td>courier.status = 'on_break', break_start set</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `on_break → free`</td>
<td>Break ends</td>
<td>courier.status == 'on_break', break_duration >= min</td>
<td>courier.status = 'free'</td>
<td>System</td>
<td>— </td>
</tr>
<tr>
<td> `free → offline`</td>
<td>Courier goes offline</td>
<td>courier.status == 'free'</td>
<td>courier.status = 'offline'</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `busy → on_break`</td>
<td>Courier takes break (if allowed)</td>
<td>courier.status == 'busy', no active delivery, break quota remaining</td>
<td>courier.status = 'on_break', break_start set</td>
<td>Courier App</td>
<td>— </td>
</tr>
<tr>
<td> `busy → offline`</td>
<td>Shift ends (force)</td>
<td>courier.status == 'busy', shift ended</td>
<td>courier.status = 'offline', active_delivery_id unset</td>
<td>System</td>
<td>— </td>
</tr>
</tbody>
</table>

#### 2.10.5 Picker Task

![Рис. 6: Picker Task — State Machine (назначена → сборка → замены → завершена)](exports/diagrams/diagram-06.png)

<table>
<thead><tr>
<th> Переход</th>
<th>Триггер</th>
<th>Preconditions</th>
<th>Postconditions</th>
<th>Инициатор</th>
<th>Событие </th>
</tr></thead>
<tbody>
<tr>
<td> `assigned → started`</td>
<td>Picker opens task</td>
<td>task.status == 'assigned', picker accepted</td>
<td>task.status = 'started', started_at set</td>
<td>Picker App</td>
<td>`order.picking_started` </td>
</tr>
<tr>
<td> `started → substituted`</td>
<td>Item out of stock, alternative found</td>
<td>task.status == 'started', item unavailable, customer agreed</td>
<td>task.status = 'substituted', substitution logged</td>
<td>Picker App</td>
<td>— </td>
</tr>
<tr>
<td> `substituted → packed`</td>
<td>All items processed</td>
<td>task.status == 'substituted', remaining items picked</td>
<td>task.status = 'packed', packed_at set</td>
<td>Picker App</td>
<td>— </td>
</tr>
<tr>
<td> `started → packed`</td>
<td>All items found</td>
<td>task.status == 'started', no substitutions needed</td>
<td>task.status = 'packed', packed_at set</td>
<td>Picker App</td>
<td>`order.picking_completed` </td>
</tr>
<tr>
<td> `packed → handed_over`</td>
<td>Courier receives package</td>
<td>task.status == 'packed', courier at store</td>
<td>task.status = 'handed_over', handover_at set</td>
<td>Courier App</td>
<td>— </td>
</tr>
</tbody>
</table>

---

### 2.11 Sequence Diagrams

Sequence Diagrams для 5 критических сценариев. Участники — реальные сервисы из §2.3, события из §2.9. Сплошные стрелки (`→`) — синхронные вызовы, пунктирные (`-->>`) — асинхронные события.

#### 2.11.1 Оформление заказа

**Сценарий:** Клиент выбирает товары, оформляет заказ, оплачивает онлайн через Т-Банк.

![Рис. 7: Sequence — Оформление заказа (клиент → корзина → оплата → подтверждение)](exports/diagrams/diagram-07.png)

#### 2.11.2 Сборка с заменой товара

**Сценарий:** Пикер собирает заказ, обнаруживает отсутствующий товар, звонит клиенту, предлагает замену.

![Рис. 8: Sequence — Сборка с заменой товара (пикер → система → звонок клиенту)](exports/diagrams/diagram-08.png)

#### 2.11.3 Назначение курьера (Dispatch)

**Сценарий:** Заказ собран — диспетчер назначает ближайшего курьера, рассчитывает ETA, уведомляет клиента.

![Рис. 9: Sequence — Назначение курьера (диспетчер → OSRM → ETA → уведомление)](exports/diagrams/diagram-09.png)

#### 2.11.4 Refund

**Сценарий:** Клиент запрашивает возврат, система инициирует refund через платёжный шлюз.

![Рис. 10: Sequence — Refund (клиент → запрос → платежный шлюз → подтверждение)](exports/diagrams/diagram-10.png)

#### 2.11.5 Offline-sync курьера

**Сценарий:** Курьер теряет интернет во время доставки, отмечает доставку офлайн, данные синхронизируются позже.

![Рис. 11: Sequence — Offline-sync курьера (офлайн hold → batch sync → сервер)](exports/diagrams/diagram-11.png)

---

### 2.12 Event JSON Schemas

Стандартный envelope для всех событий и полные JSON Schema (draft-07) для каждого из 12 событий из §2.9.

#### 2.12.1 Envelope

Единая обёртка для всех событий в системе:

```json
{
  "event_id": "uuid-v4",
  "event_type": "order.created",
  "occurred_at": "2026-06-17T10:00:00Z",
  "aggregate_id": "order_12345",
  "aggregate_type": "order",
  "payload": { ... },
  "metadata": {
    "correlation_id": "uuid",
    "causation_id": "uuid",
    "user_id": "user_67890",
    "source": "order-service",
    "schema_version": "1.0"
  }
}
```

**Поля envelope:**

<table>
<thead><tr>
<th> Поле</th>
<th>Тип</th>
<th>Обязательное</th>
<th>Описание </th>
</tr></thead>
<tbody>
<tr>
<td> `event_id`</td>
<td>string (uuid)</td>
<td>✅</td>
<td>Уникальный ID события </td>
</tr>
<tr>
<td> `event_type`</td>
<td>string (enum)</td>
<td>✅</td>
<td>Тип события из §2.9 </td>
</tr>
<tr>
<td> `occurred_at`</td>
<td>string (ISO8601)</td>
<td>✅</td>
<td>Время наступления события </td>
</tr>
<tr>
<td> `aggregate_id`</td>
<td>string</td>
<td>✅</td>
<td>ID сущности (напр. order_12345) </td>
</tr>
<tr>
<td> `aggregate_type`</td>
<td>string</td>
<td>✅</td>
<td>Тип сущности (order/payment/delivery/courier) </td>
</tr>
<tr>
<td> `payload`</td>
<td>object</td>
<td>✅</td>
<td>Тело события (зависит от event_type) </td>
</tr>
<tr>
<td> `metadata.correlation_id`</td>
<td>string (uuid)</td>
<td>✅</td>
<td>Для tracing — сквозной ID всей цепочки </td>
</tr>
<tr>
<td> `metadata.causation_id`</td>
<td>string (uuid)</td>
<td>✅</td>
<td>ID события-причины (parent event) </td>
</tr>
<tr>
<td> `metadata.user_id`</td>
<td>string</td>
<td>❌</td>
<td>ID пользователя, инициировавшего действие </td>
</tr>
<tr>
<td> `metadata.source`</td>
<td>string</td>
<td>✅</td>
<td>Сервис-отправитель </td>
</tr>
<tr>
<td> `metadata.schema_version`</td>
<td>string</td>
<td>✅</td>
<td>Версия схемы (semver) </td>
</tr>
</tbody>
</table>

#### 2.12.2 Схемы событий

##### `order.created`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "user_id", "store_id", "total", "items", "delivery_slot"],
  "properties": {
    "order_id": { "type": "string", "pattern": "^order_\\d+$" },
    "user_id": { "type": "string", "pattern": "^user_\\d+$" },
    "store_id": { "type": "string", "pattern": "^store_\\d+$" },
    "total": { "type": "number", "minimum": 0, "multipleOf": 0.01 },
    "delivery_fee": { "type": "number", "minimum": 0 },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["product_id", "quantity", "price"],
        "properties": {
          "product_id": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 },
          "price": { "type": "number", "minimum": 0 }
        }
      }
    },
    "delivery_slot": {
      "type": "object",
      "required": ["start", "end"],
      "properties": {
        "start": { "type": "string", "format": "date-time" },
        "end": { "type": "string", "format": "date-time" }
      }
    },
    "payment_method": { "type": "string", "enum": ["card", "sbp", "cash", "card_courier"] }
  }
}
```

**Пример:**
```json
{
  "order_id": "order_12345",
  "user_id": "user_67890",
  "store_id": "store_42",
  "total": 1850.50,
  "delivery_fee": 99.00,
  "items": [
    {"product_id": "prod_1001", "quantity": 2, "price": 450.00},
    {"product_id": "prod_1002", "quantity": 1, "price": 350.50}
  ],
  "delivery_slot": {"start": "2026-06-17T18:00:00Z", "end": "2026-06-17T20:00:00Z"},
  "payment_method": "card"
}
```

##### `order.paid`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "payment_id", "amount", "method"],
  "properties": {
    "order_id": { "type": "string" },
    "payment_id": { "type": "string" },
    "amount": { "type": "number", "minimum": 0 },
    "method": { "type": "string", "enum": ["card", "sbp", "cash", "card_courier"] },
    "provider": { "type": "string", "enum": ["t-bank", "sbp"] },
    "paid_at": { "type": "string", "format": "date-time" }
  }
}
```

**Пример:** `{"order_id": "order_12345", "payment_id": "pay_9876", "amount": 1850.50, "method": "card", "provider": "t-bank", "paid_at": "2026-06-17T10:05:00Z"}`

##### `order.assigned`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "picker_id", "courier_id", "eta"],
  "properties": {
    "order_id": { "type": "string" },
    "picker_id": { "type": "string" },
    "courier_id": { "type": "string" },
    "eta": {
      "type": "object",
      "required": ["delivery_min", "distance_km"],
      "properties": {
        "delivery_min": { "type": "integer", "minimum": 1 },
        "distance_km": { "type": "number", "minimum": 0 }
      }
    }
  }
}
```

**Пример:** `{"order_id": "order_12345", "picker_id": "picker_55", "courier_id": "courier_88", "eta": {"delivery_min": 35, "distance_km": 4.2}}`

##### `order.picking_started`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "picker_id", "started_at"],
  "properties": {
    "order_id": { "type": "string" },
    "picker_id": { "type": "string" },
    "started_at": { "type": "string", "format": "date-time" }
  }
}
```

**Пример:** `{"order_id": "order_12345", "picker_id": "picker_55", "started_at": "2026-06-17T10:10:00Z"}`

##### `order.picking_completed`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "picker_id", "items_found", "items_substituted"],
  "properties": {
    "order_id": { "type": "string" },
    "picker_id": { "type": "string" },
    "packed_at": { "type": "string", "format": "date-time" },
    "items_found": { "type": "integer", "minimum": 0 },
    "items_substituted": { "type": "integer", "minimum": 0 },
    "substitutions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "original_product_id": { "type": "string" },
          "substitute_product_id": { "type": "string" },
          "customer_approved": { "type": "boolean" }
        }
      }
    }
  }
}
```

**Пример:** `{"order_id": "order_12345", "picker_id": "picker_55", "packed_at": "2026-06-17T10:25:00Z", "items_found": 8, "items_substituted": 1, "substitutions": [{"original_product_id": "prod_1001", "substitute_product_id": "prod_1003", "customer_approved": true}]}`

##### `order.in_transit`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "courier_id", "eta"],
  "properties": {
    "order_id": { "type": "string" },
    "courier_id": { "type": "string" },
    "eta": {
      "type": "object",
      "required": ["delivery_min", "distance_km"],
      "properties": {
        "delivery_min": { "type": "integer", "minimum": 1 },
        "distance_km": { "type": "number", "minimum": 0 }
      }
    },
    "route": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "lat": { "type": "number" },
          "lng": { "type": "number" },
          "timestamp": { "type": "string", "format": "date-time" }
        }
      }
    }
  }
}
```

**Пример:** `{"order_id": "order_12345", "courier_id": "courier_88", "eta": {"delivery_min": 18, "distance_km": 2.5}}`

##### `order.delivered`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "courier_id", "delivered_at"],
  "properties": {
    "order_id": { "type": "string" },
    "courier_id": { "type": "string" },
    "delivered_at": { "type": "string", "format": "date-time" },
    "pod_signature": { "type": "string", "description": "Base64-encoded signature image" },
    "pod_photo": { "type": "string", "description": "URL to delivery photo" },
    "payment_collected": { "type": "number", "description": "Amount collected on delivery" }
  }
}
```

**Пример:** `{"order_id": "order_12345", "courier_id": "courier_88", "delivered_at": "2026-06-17T10:50:00Z", "pod_signature": "iVBORw0KGgo...", "payment_collected": 350.00}`

##### `order.cancelled`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "reason", "cancelled_at"],
  "properties": {
    "order_id": { "type": "string" },
    "reason": { "type": "string", "enum": ["user_cancelled", "admin_cancelled", "delivery_failed", "payment_failed", "timeout"] },
    "cancelled_at": { "type": "string", "format": "date-time" },
    "refund_amount": { "type": "number", "minimum": 0 },
    "refund_status": { "type": "string", "enum": ["pending", "processed", "none"] }
  }
}
```

**Пример:** `{"order_id": "order_12345", "reason": "user_cancelled", "cancelled_at": "2026-06-17T09:30:00Z", "refund_amount": 1850.50, "refund_status": "processed"}`

##### `payment.refunded`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order_id", "refund_id", "amount", "refunded_at"],
  "properties": {
    "order_id": { "type": "string" },
    "refund_id": { "type": "string" },
    "amount": { "type": "number", "minimum": 0 },
    "refunded_at": { "type": "string", "format": "date-time" },
    "reason": { "type": "string" }
  }
}
```

**Пример:** `{"order_id": "order_12345", "refund_id": "refund_777", "amount": 1850.50, "refunded_at": "2026-06-17T11:00:00Z", "reason": "customer_return"}`

##### `inventory.low`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["store_id", "product_id", "quantity"],
  "properties": {
    "store_id": { "type": "string" },
    "product_id": { "type": "string" },
    "quantity": { "type": "integer", "minimum": 0 },
    "threshold": { "type": "integer", "minimum": 1 }
  }
}
```

**Пример:** `{"store_id": "store_42", "product_id": "prod_1001", "quantity": 3, "threshold": 10}`

##### `catalog.synced`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["chain_id", "synced_at"],
  "properties": {
    "chain_id": { "type": "string" },
    "synced_at": { "type": "string", "format": "date-time" },
    "products_count": { "type": "integer", "minimum": 0 },
    "categories_count": { "type": "integer", "minimum": 0 },
    "errors": { "type": "array", "items": { "type": "string" } },
    "duration_seconds": { "type": "integer", "minimum": 0 }
  }
}
```

**Пример:** `{"chain_id": "lenta", "synced_at": "2026-06-17T06:00:00Z", "products_count": 15234, "categories_count": 87, "errors": [], "duration_seconds": 145}`

##### `dispatch.cycle`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["zone_id", "cycle_id", "orders"],
  "properties": {
    "zone_id": { "type": "string" },
    "cycle_id": { "type": "string" },
    "orders": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["order_id", "store_id", "destination"],
        "properties": {
          "order_id": { "type": "string" },
          "store_id": { "type": "string" },
          "destination": {
            "type": "object",
            "properties": {
              "lat": { "type": "number" },
              "lng": { "type": "number" },
              "address": { "type": "string" }
            }
          },
          "weight_kg": { "type": "number", "maximum": 80 }
        }
      }
    },
    "available_couriers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "courier_id": { "type": "string" },
          "current_location": { "type": "object", "properties": { "lat": { "type": "number" }, "lng": { "type": "number" } } },
          "status": { "type": "string", "enum": ["free", "busy"] }
        }
      }
    }
  }
}
```

**Пример:** `{"zone_id": "zone_central", "cycle_id": "cycle_20260617_1845", "orders": [{"order_id": "order_12345", "store_id": "store_42", "destination": {"lat": 55.7558, "lng": 37.6173, "address": "ул. Тверская, 1"}, "weight_kg": 12.5}], "available_couriers": [{"courier_id": "courier_88", "current_location": {"lat": 55.7600, "lng": 37.6200}, "status": "free"}]}`

#### 2.12.3 Матрица соответствия

<table>
<thead><tr>
<th> Событие</th>
<th>Envelope event_type</th>
<th>Агрегат</th>
<th>Payload required fields</th>
<th>PII в payload </th>
</tr></thead>
<tbody>
<tr>
<td> order.created</td>
<td>`order.created`</td>
<td>order</td>
<td>6</td>
<td>❌ (user_id только ID) </td>
</tr>
<tr>
<td> order.paid</td>
<td>`order.paid`</td>
<td>order</td>
<td>4</td>
<td>❌ </td>
</tr>
<tr>
<td> order.assigned</td>
<td>`order.assigned`</td>
<td>order</td>
<td>4</td>
<td>❌ </td>
</tr>
<tr>
<td> order.picking_started</td>
<td>`order.picking_started`</td>
<td>order</td>
<td>3</td>
<td>❌ </td>
</tr>
<tr>
<td> order.picking_completed</td>
<td>`order.picking_completed`</td>
<td>order</td>
<td>4</td>
<td>❌ </td>
</tr>
<tr>
<td> order.in_transit</td>
<td>`order.in_transit`</td>
<td>delivery</td>
<td>3</td>
<td>❌ </td>
</tr>
<tr>
<td> order.delivered</td>
<td>`order.delivered`</td>
<td>delivery</td>
<td>3</td>
<td>❌ </td>
</tr>
<tr>
<td> order.cancelled</td>
<td>`order.cancelled`</td>
<td>order</td>
<td>3</td>
<td>❌ </td>
</tr>
<tr>
<td> payment.refunded</td>
<td>`payment.refunded`</td>
<td>payment</td>
<td>4</td>
<td>❌ </td>
</tr>
<tr>
<td> inventory.low</td>
<td>`inventory.low`</td>
<td>inventory</td>
<td>3</td>
<td>❌ </td>
</tr>
<tr>
<td> catalog.synced</td>
<td>`catalog.synced`</td>
<td>catalog</td>
<td>2</td>
<td>❌ </td>
</tr>
<tr>
<td> dispatch.cycle</td>
<td>`dispatch.cycle`</td>
<td>dispatch</td>
<td>3</td>
<td>❌ </td>
</tr>
</tbody>
</table>

---

### 2.13 Idempotency Policy

Политика идемпотентности для всех mutating-запросов. Предотвращает дубли заказов и двойные списания при повторных отправках запросов (retry, network issues, mobile offline).

#### 2.13.1 Общие правила

<table>
<thead><tr>
<th> Правило</th>
<th>Значение </th>
</tr></thead>
<tbody>
<tr>
<td> Header</td>
<td>`Idempotency-Key` </td>
</tr>
<tr>
<td> Формат</td>
<td>UUID v4 </td>
</tr>
<tr>
<td> Обязателен для</td>
<td>Все POST/PUT/PATCH запросы (кроме аддитивных операций — см. таблицу) </td>
</tr>
<tr>
<td> TTL ключа</td>
<td>24 часа (настраивается) </td>
</tr>
<tr>
<td> Привязка</td>
<td>`user_id` + `Idempotency-Key` (один пользователь не может использовать чужой ключ) </td>
</tr>
<tr>
<td> Повторный запрос с тем же ключом</td>
<td>Тот же HTTP-код и тело ответа </td>
</tr>
<tr>
<td> Хранилище</td>
<td>Redis: `idempotency:{user_id}:{key}` → `{status_code, response_body, created_at}` </td>
</tr>
</tbody>
</table>

#### 2.13.2 Таблица идемпотентности по эндпоинтам

<table>
<thead><tr>
<th> Endpoint</th>
<th>Idempotent?</th>
<th>TTL</th>
<th>Почему </th>
</tr></thead>
<tbody>
<tr>
<td> `POST /orders`</td>
<td>✅ Да</td>
<td>24h</td>
<td>Предотвращение дублей заказов </td>
</tr>
<tr>
<td> `POST /payments/init`</td>
<td>✅ Да</td>
<td>24h</td>
<td>Предотвращение двойных списаний </td>
</tr>
<tr>
<td> `POST /payments/webhook`</td>
<td>✅ Да</td>
<td>72h</td>
<td>Bank retry — расширенный TTL </td>
</tr>
<tr>
<td> `POST /carts/items`</td>
<td>✅ Да (по природе)</td>
<td>—</td>
<td>Additive operation — повторный запрос с тем же body не создаёт дубль, а увеличивает quantity. Не требует заголовка Idempotency-Key </td>
</tr>
<tr>
<td> `POST /notifications/send`</td>
<td>✅ Да</td>
<td>1h</td>
<td>Предотвращение двойных SMS </td>
</tr>
<tr>
<td> `PATCH /orders/{id}/cancel`</td>
<td>✅ Да</td>
<td>24h</td>
<td>Предотвращение двойной отмены </td>
</tr>
<tr>
<td> `POST /refunds`</td>
<td>✅ Да</td>
<td>72h</td>
<td>Финансовая операция, расширенный TTL </td>
</tr>
<tr>
<td> `POST /deliveries/sync`</td>
<td>✅ Да</td>
<td>48h</td>
<td>Offline sync курьера </td>
</tr>
</tbody>
</table>

#### 2.13.3 Edge cases

<table>
<thead><tr>
<th> Ситуация</th>
<th>Поведение </th>
</tr></thead>
<tbody>
<tr>
<td> Ключ уже существует, запрос ещё в обработке</td>
<td>`409 Conflict` — клиент ждёт и ретраит </td>
</tr>
<tr>
<td> TTL истёк</td>
<td>Новый запрос обрабатывается как первый </td>
</tr>
<tr>
<td> Ключ валиден, но тело запроса отличается</td>
<td>`422 Unprocessable Entity` — конфликт данных </td>
</tr>
<tr>
<td> Повторный запрос после успеха</td>
<td>`200 OK` с тем же телом ответа (из кэша Redis) </td>
</tr>
<tr>
<td> Redis недоступен</td>
<td>Fail open (пропускаем проверку) + alarm в мониторинг </td>
</tr>
</tbody>
</table>

#### 2.13.4 Пример реализации (Rails middleware)

```ruby
class IdempotencyMiddleware
  def initialize(app, redis = Redis.new)
    @app = app
    @redis = redis
  end

  def call(env)
    key = env['HTTP_IDEMPOTENCY_KEY']
    user_id = env['HTTP_X_USER_ID']
    cache_key = "idempotency:#{user_id}:#{key}"

    if key && user_id
      cached = @redis.get(cache_key)
      if cached
        data = JSON.parse(cached)
        return [data['status'], data['headers'], [data['body']]]
      end

      status, headers, body = @app.call(env)
      @redis.setex(cache_key, 86_400, {status: status, headers: headers, body: body.join}.to_json)
      [status, headers, body]
    else
      @app.call(env)
    end
  end
end
```

#### 2.13.5 Пример реализации (Go middleware)

```go
type cachedResponse struct {
    Status  int    `json:"status"`
    Headers map[string]string `json:"headers,omitempty"`
    Body    string `json:"body"`
}

func IdempotencyMiddleware(rdb *redis.Client) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            key := r.Header.Get("Idempotency-Key")
            userID := r.Header.Get("X-User-Id")
            if key == "" || userID == "" {
                next.ServeHTTP(w, r)
                return
            }

            ctx := r.Context()
            cacheKey := fmt.Sprintf("idempotency:%s:%s", userID, key)
            if cached, err := rdb.Get(ctx, cacheKey).Result(); err == nil {
                var resp cachedResponse
                json.Unmarshal([]byte(cached), &resp)
                for k, v := range resp.Headers {
                    w.Header().Set(k, v)
                }
                w.WriteHeader(resp.Status)
                w.Write([]byte(resp.Body))
                return
            }

            recorder := &statusRecorder{ResponseWriter: w, status: 200}
            next.ServeHTTP(recorder, r)

            data, _ := json.Marshal(cachedResponse{
                Status: recorder.status,
                Headers: recorder.Header(),
                Body:   recorder.body.String(),
            })
            rdb.Set(ctx, cacheKey, data, 24*time.Hour)
        })
    }
}
```

---

### 2.14 Data Migration Strategy

Стратегия миграции данных с монолита на микросервисную архитектуру (Strangler-Fig). Это самый рисковый этап плана (см. ПЛАН_ОПТИМИЗАЦИИ, §5–§7: модульная миграция, canary-release, демонтаж монолита). Согласовано с §2.1 Architecture Style (Strangler-Fig) и §5.7 Backup & DR (бэкапы перед каждым шагом cut-over).

#### 2.14.1 Порядок миграции сервисов

Миграция выполняется от наименее рискованного к наиболее рискованному. Каждый сервис проходит этапы: Double Write → Validation → Cut-over → Monolith decommission.

![Рис. 12: Порядок миграции сервисов — Auth → Notifications → Catalog → Orders → Payments → Delivery → Dispatch](exports/diagrams/diagram-12.png)

<table>
<thead><tr>
<th> Приоритет</th>
<th>Сервис</th>
<th>Риск</th>
<th>Обоснование </th>
</tr></thead>
<tbody>
<tr>
<td> 1</td>
<td>Catalog</td>
<td>Низкий</td>
<td>Read-only данные, нет мутаций от клиентов. Ошибка не приведёт к financial loss </td>
</tr>
<tr>
<td> 2</td>
<td>User & Auth</td>
<td>Низкий</td>
<td>Независимый домен, минимум связей с другими таблицами </td>
</tr>
<tr>
<td> 3</td>
<td>Inventory</td>
<td>Средний</td>
<td>Связан с Catalog, но SKU стабильны. Риск: расхождение остатков </td>
</tr>
<tr>
<td> 4</td>
<td>Order + Payment</td>
<td>Высокий</td>
<td>Финансовые данные, Event Sourcing, самая сложная миграция. Любая ошибка = потеря денег </td>
</tr>
<tr>
<td> 5</td>
<td>Delivery + Dispatcher</td>
<td>Средний</td>
<td>Зависит от Order. Активные доставки нельзя потерять </td>
</tr>
<tr>
<td> 6</td>
<td>Notification, Analytics</td>
<td>Низкий</td>
<td>Не критично для бизнеса. Можно мигрировать последними </td>
</tr>
</tbody>
</table>

#### 2.14.2 Стратегия двойной записи (Double Write)

На этапе Double Write каждый сервис пишет одновременно в старую (монолит) и новую (микросервис) БД. Консистентность обеспечивается через Transactional Outbox:

![Рис. 13: Double Write — синхронная запись в старую и новую БД + Transactional Outbox](exports/diagrams/diagram-13.png)

**Reconciliation job:**

- Запускается каждые 15 минут
- Сравнивает count, checksum, сумму ключевых полей между новой и старой БД
- При расхождении > 0.1% — автоматический алерт в PagerDuty/Slack
- При расхождении > 1% — автоматическая блокировка cut-over

```sql
-- Пример reconciliation-запроса:
SELECT COUNT(*), SUM(amount) FROM new_orders.orders WHERE created_at > now() - interval '15 minutes'
UNION ALL
SELECT COUNT(*), SUM(amount) FROM old_monolith.orders WHERE created_at > now() - interval '15 minutes';
```

#### 2.14.3 Cut-over критерии

Cut-over (переключение трафика на новый сервис) выполняется только при выполнении всех условий:

<table>
<thead><tr>
<th> Критерий</th>
<th>Метрика</th>
<th>Как проверяем </th>
</tr></thead>
<tbody>
<tr>
<td> Расхождение данных</td>
<td>0 расхождений за 7 дней</td>
<td>Reconciliation job </td>
</tr>
<tr>
<td> Нагрузочное тестирование</td>
<td>p95 < 500ms при 2x RPS</td>
<td>Load test в staging </td>
</tr>
<tr>
<td> Contract-тесты</td>
<td>100% green</td>
<td>Pact / Spring Cloud Contract в CI </td>
</tr>
<tr>
<td> Rollback-план</td>
<td>Протестирован</td>
<td>Dry-run в staging </td>
</tr>
<tr>
<td> Graceful degradation</td>
<td>Старый сервис живёт в read-only</td>
<td>Feature flag `use_new_{service}` в LaunchDarkly </td>
</tr>
</tbody>
</table>

**Процедура cut-over:**

1. **Полный бэкап** старой и новой БД перед каждым шагом (см. §5.7 Backup & DR)
2. Включить feature flag `use_new_{service}` для 1% пользователей → 24h мониторинга
3. Расширить до 10% → 48h мониторинга
4. Расширить до 50% → 72h мониторинга
5. 100% — старый сервис в read-only на 7 дней (откат возможен без потери данных)
6. Демонтаж старого сервиса после 7 дней без расхождений

> **Согласование с ПЛАН_ОПТИМИЗАЦИИ:** порядок миграции соответствует §5 (Модульная миграция бизнес-логики), процедура canary-rollout — §6 (Canary-Release), полный переход и демонтаж — §7 (Полный переход и демонтаж старого монолита).

#### 2.14.4 Rollback-план

Для каждого сервиса определён порядок отката:

<table>
<thead><tr>
<th> Сервис</th>
<th>Действие при откате</th>
<th>Что делаем с новыми данными </th>
</tr></thead>
<tbody>
<tr>
<td> Catalog</td>
<td>Выключить `use_new_catalog` → трафик на монолит</td>
<td>Новые данные копируются в монолит через reverse sync </td>
</tr>
<tr>
<td> User & Auth</td>
<td>Выключить `use_new_user` → трафик на монолит</td>
<td>Новые сессии инвалидируются, пользователи переносятся reverse sync </td>
</tr>
<tr>
<td> Inventory</td>
<td>Выключить `use_new_inventory` → монолит</td>
<td>Reverse sync + ручная сверка остатков </td>
</tr>
<tr>
<td> Order + Payment</td>
<td>Выключить `use_new_order` → новые заказы на монолит. **Активные заказы** в новом сервисе доводятся до завершения</td>
<td>Event Sourcing позволяет восстановить все события </td>
</tr>
<tr>
<td> Delivery</td>
<td>Выключить `use_new_delivery` → новые назначения на монолит. Активные доставки остаются в новом сервисе</td>
<td>Reverse sync для завершённых доставок </td>
</tr>
</tbody>
</table>

**Reverse replication:**

![Рис. 14: Reverse replication — синхронизация данных из новой БД обратно в старую](exports/diagrams/diagram-14.png)

#### 2.14.5 Миграция исторических данных

**Backfill:**

- Исторические данные переносятся batch-скриптами до начала Double Write
- Каждый batch: 10 000 записей, пауза 1 секунда между batch
- Ограничение по времени: не более 4 часов downtime (ночное окно)

**Валидация после миграции:**

<table>
<thead><tr>
<th> Проверка</th>
<th>Что проверяем</th>
<th>Допуск </th>
</tr></thead>
<tbody>
<tr>
<td> Row count</td>
<td>Количество записей совпадает</td>
<td>100% </td>
</tr>
<tr>
<td> Control sum</td>
<td>SUM ключевых числовых полей</td>
<td>100% </td>
</tr>
<tr>
<td> Checksum</td>
<td>CRC32/MD5 конкатенации всех полей</td>
<td>100% </td>
</tr>
<tr>
<td> Referential integrity</td>
<td>FK не нарушены</td>
<td>0 нарушений </td>
</tr>
<tr>
<td> Sample check</td>
<td>Выборочная сверка 1% записей вручную</td>
<td>0 ошибок </td>
</tr>
</tbody>
</table>

**Downtime окно:**

- Catalog, User & Auth: zero-downtime (Double Write с первой записи)
- Inventory: zero-downtime
- Order + Payment: zero-downtime (Event Sourcing гарантирует консистентность)
- Исторические данные: downtime до 4 часов в ночное окно (02:00–06:00 MSK)

#### 2.14.6 Таблица рисков и митигаций

<table>
<thead><tr>
<th> Риск</th>
<th>Вероятность</th>
<th>Влияние</th>
<th>Митигация </th>
</tr></thead>
<tbody>
<tr>
<td> Расхождение данных при Double Write</td>
<td>Medium</td>
<td>High</td>
<td>Reconciliation каждые 15 мин, автоматический алерт </td>
</tr>
<tr>
<td> Потеря заказа при cut-over</td>
<td>Low</td>
<td>Critical</td>
<td>Event Sourcing + feature flag rollout </td>
</tr>
<tr>
<td> Отказ нового сервиса под нагрузкой</td>
<td>Medium</td>
<td>High</td>
<td>Load test до 2x RPS перед cut-over </td>
</tr>
<tr>
<td> Reverse sync не успевает за новыми данными</td>
<td>Low</td>
<td>Medium</td>
<td>Batch-режим + priority queue </td>
</tr>
<tr>
<td> Человеческая ошибка при переключении</td>
<td>Medium</td>
<td>Medium</td>
<td>Runbook + автоматизация через CI/CD </td>
</tr>
<tr>
<td> Блокировка старой БД при backfill</td>
<td>Medium</td>
<td>Medium</td>
<td>Batch с паузами, мониторинг lock-ов </td>
</tr>
</tbody>
</table>

---

### 2.15 Rate Limits & Quotas

Политика rate limiting для защиты от злоупотреблений и равномерного распределения ресурсов. Согласовано с §1.3 NFR (RPS 50→500→5000), §1.5 Error Handling (матрица таймаутов) и §6.2 Data Protection.

#### 2.15.1 Таблица лимитов по эндпоинтам

<table>
<thead><tr>
<th> Endpoint</th>
<th>Limit</th>
<th>Window</th>
<th>Burst</th>
<th>Почему </th>
</tr></thead>
<tbody>
<tr>
<td> `GET /catalog/*`</td>
<td>300</td>
<td>per user / min</td>
<td>50</td>
<td>Read-heavy — каталог грузится часто </td>
</tr>
<tr>
<td> `POST /orders`</td>
<td>5</td>
<td>per user / min</td>
<td>2</td>
<td>Защита от дублей заказов </td>
</tr>
<tr>
<td> `POST /auth/sms`</td>
<td>3</td>
<td>per phone / hour</td>
<td>1</td>
<td>Защита от SMS-спама </td>
</tr>
<tr>
<td> `POST /payments/*`</td>
<td>10</td>
<td>per user / min</td>
<td>2</td>
<td>Финтех-защита </td>
</tr>
<tr>
<td> `GET /orders/history`</td>
<td>60</td>
<td>per user / min</td>
<td>10</td>
<td>История заказов — частый просмотр </td>
</tr>
<tr>
<td> `POST /notifications/*`</td>
<td>20</td>
<td>per user / min</td>
<td>5</td>
<td>Защита от спам-рассылок </td>
</tr>
<tr>
<td> `POST /auth/register`</td>
<td>5</td>
<td>per IP / hour</td>
<td>2</td>
<td>Защита от накрутки аккаунтов </td>
</tr>
<tr>
<td> `PATCH /orders/{id}/cancel`</td>
<td>3</td>
<td>per order / min</td>
<td>1</td>
<td>Предотвращение race condition </td>
</tr>
<tr>
<td> `POST /refunds`</td>
<td>3</td>
<td>per user / day</td>
<td>1</td>
<td>Финансовая операция </td>
</tr>
<tr>
<td> `POST /deliveries/sync`</td>
<td>60</td>
<td>per courier / min</td>
<td>10</td>
<td>Offline sync — может быть burst </td>
</tr>
</tbody>
</table>

#### 2.15.2 Лимиты по ролям

<table>
<thead><tr>
<th> Роль</th>
<th>Множитель</th>
<th>Базовый лимит (пример) </th>
</tr></thead>
<tbody>
<tr>
<td> B2C (обычный пользователь)</td>
<td>×1</td>
<td>5 POST/orders/min </td>
</tr>
<tr>
<td> B2B (корпоративные клиенты)</td>
<td>×5</td>
<td>25 POST/orders/min </td>
</tr>
<tr>
<td> Admin (менеджеры)</td>
<td>×10</td>
<td>50 POST/orders/min </td>
</tr>
<tr>
<td> Service-to-service</td>
<td>Отдельные лимиты</td>
<td>По согласованию, whitelist IP </td>
</tr>
<tr>
<td> Courier App</td>
<td>×3</td>
<td>180 POST/deliveries/sync/min </td>
</tr>
</tbody>
</table>

#### 2.15.3 HTTP-ответ при превышении лимита

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718640000
Content-Type: application/json

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Превышен лимит запросов. Попробуйте через 30 секунд",
    "details": {
      "limit": 5,
      "window": "1 minute",
      "retry_after_seconds": 30
    },
    "request_id": "req_def456"
  }
}
```

Заголовки соответствуют RFC 6585 / draft-ietf-httpapi-ratelimit-headers.

#### 2.15.4 Реализация

<table>
<thead><tr>
<th> Компонент</th>
<th>Технология</th>
<th>Алгоритм </th>
</tr></thead>
<tbody>
<tr>
<td> API Gateway</td>
<td>Nginx `limit_req` zone</td>
<td>Token bucket (на уровне gateway — первая линия защиты) </td>
</tr>
<tr>
<td> Service-level</td>
<td>Redis + middleware</td>
<td>Sliding window log (на уровне сервиса — точные лимиты по user_id) </td>
</tr>
<tr>
<td> Распределённый счётчик</td>
<td>Redis INCR + EXPIRE</td>
<td>Atomic операции, TTL = размер окна </td>
</tr>
</tbody>
</table>

**Схема работы:**

![Рис. 15: Rate Limits — схема работы Nginx + Redis (sliding window, burst, лимиты по ролям)](exports/diagrams/diagram-15.png)

**Whitelist:**

- Внутренние сервисы (service-to-service) — обходят rate limiting через header `X-Internal-Service: <secret>`
- Мониторинг (Prometheus, Sentry) — whitelist по IP

#### 2.15.5 Burst-политика

<table>
<thead><tr>
<th> Сценарий</th>
<th>Механизм</th>
<th>Параметры </th>
</tr></thead>
<tbody>
<tr>
<td> Распродажа (Black Friday)</td>
<td>Заранее увеличить burst-лимиты в 2× через админку</td>
<td>Feature flag `burst_mode_bf` </td>
</tr>
<tr>
<td> DDoS-атака</td>
<td>Включить строгий режим (лимиты ÷10)</td>
<td>Feature flag `strict_rate_limit` </td>
</tr>
<tr>
<td> Расширение пользовательской базы</td>
<td>Пересчёт лимитов при росте MAU > 20%</td>
<td>Ежеквартальный review </td>
</tr>
<tr>
<td> Ошибка мониторинга</td>
<td>Отдельный лимит для `/health` и `/metrics`: 60/min</td>
<td>Не блокировать внутренние проверки </td>
</tr>
</tbody>
</table>

---
**Источник:** Раздел 5.4 + пункт 5 общего списка.

*Визуальная ER-диаграмма и ссылки на SQL-схемы.*

Полные DDL-схемы вынесены в отдельные файлы:

- [migrations/catalog.sql](migrations/catalog.sql) — §3.2 Catalog Schema
- [migrations/orders_payments.sql](migrations/orders_payments.sql) — §3.3 Orders & Payments
- [migrations/users_auth.sql](migrations/users_auth.sql) — §3.4 Users & Auth
- [migrations/delivery_dispatch.sql](migrations/delivery_dispatch.sql) — §3.5 Delivery & Dispatch
- [migrations/notifications_promotions.sql](migrations/notifications_promotions.sql) — §3.6 Notifications & Promotions
- [db/schema.rb](db/schema.rb) — сводная схема

### 3.2 Catalog Schema (Архитектура хранения каталога)
**Источник:** Раздел 5.4 исходного документа.

```sql
-- Сеть (Лента, Metro, Вкусвилл...)
CREATE TABLE chains (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Конкретный магазин сети
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    chain_id INTEGER REFERENCES chains(id),
    name TEXT NOT NULL,
    address TEXT,
    location GEOGRAPHY(POINT),
    working_hours JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

-- Зона доставки магазина (полигон на карте)
CREATE TABLE delivery_zones (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    polygon GEOGRAPHY(POLYGON),
    min_order_amount NUMERIC,
    delivery_fee NUMERIC
);

-- Товар (единица ассортимента сети)
CREATE TABLE chain_products (
    id SERIAL PRIMARY KEY,
    chain_id INTEGER REFERENCES chains(id),
    sku TEXT,
    barcode TEXT,
    name TEXT NOT NULL,
    brand TEXT,
    category_path TEXT[],
    unit TEXT,
    price NUMERIC,
    old_price NUMERIC,
    image_url TEXT,
    attributes JSONB,
    is_alcohol BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(chain_id, sku)
);

-- Цена товара в конкретном магазине
CREATE TABLE store_prices (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    chain_product_id INTEGER REFERENCES chain_products(id),
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    quantity INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, chain_product_id)
);

-- Категория в каталоге платформы (наши, не сети)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    price_from NUMERIC,         -- минимальная цена товара в категории (для фильтрации)
    price_to NUMERIC            -- максимальная цена товара в категории
);

-- Привязка товара сети к категории платформы
CREATE TABLE product_category_mappings (
    id SERIAL PRIMARY KEY,
    chain_product_id INTEGER REFERENCES chain_products(id),
    category_id INTEGER REFERENCES categories(id),
    UNIQUE(chain_product_id, category_id)
);

-- Фильтры категории (динамические)
CREATE TABLE category_filters (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    filter_name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE filter_values (
    id SERIAL PRIMARY KEY,
    filter_id INTEGER REFERENCES category_filters(id),
    value_name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);
```

### 3.3 Orders & Payments Schema
**Источник:** BP-03, BP-04, BP-07 исходного документа.

```sql
-- Корзина (временное хранение, Redis или PG)
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    store_id INTEGER REFERENCES stores(id),
    items JSONB NOT NULL DEFAULT '[]',
    promo_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Заказ
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    store_id INTEGER REFERENCES stores(id),
    status TEXT NOT NULL DEFAULT 'pending',
    -- Статусы: pending → paid → picking → packed → delivering → delivered
    --           cancelled, refunded
    total NUMERIC NOT NULL,
    delivery_fee NUMERIC NOT NULL DEFAULT 0,
    service_fee NUMERIC NOT NULL DEFAULT 0,
    weight_kg NUMERIC,
    delivery_address TEXT NOT NULL,
    delivery_lat NUMERIC,
    delivery_lng NUMERIC,
    payment_method TEXT NOT NULL,
    delivery_slot_date DATE,
    delivery_slot_start TIME,
    delivery_slot_end TIME,
    comment TEXT,
    substituted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_store_id ON orders(store_id);

-- Позиции заказа
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES chain_products(id),
    quantity NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    substituted BOOLEAN DEFAULT FALSE,
    substituted_from_id INTEGER REFERENCES order_items(id),
    picked BOOLEAN DEFAULT FALSE,
    UNIQUE(order_id, product_id)
);

-- Платежи
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    -- Статусы: pending → succeeded → failed → refunded
    provider TEXT NOT NULL,
    provider_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Возвраты
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    amount NUMERIC NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event store (аудит заказа, Event Sourcing)
CREATE TABLE order_events (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    event_type TEXT NOT NULL,
    -- 'order.created', 'payment.received', 'picker.assigned',
    -- 'picking.started', 'picking.completed', 'courier.assigned',
    -- 'delivery.started', 'delivery.completed', 'order.cancelled'
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_order_events_order_id ON order_events(order_id);
```

### 3.4 Users & Auth Schema
**Источник:** BP-01, Раздел 5.13 исходного документа.

```sql
CREATE TYPE user_role AS ENUM ('customer', 'picker', 'courier', 'manager', 'super_admin');

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    email TEXT,
    name TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    -- ПДн шифруются (AES-256) на уровне приложения
    encrypted_phone TEXT,
    encrypted_email TEXT,
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Сессии (refresh token rotation)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT UNIQUE NOT NULL,
    device_info TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Audit log (критические действия)
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action TEXT NOT NULL,
    -- 'user.login', 'order.cancel', 'order.status_change',
    -- 'user.role_change', 'payment.refund', 'admin.action'
    entity_type TEXT,
    entity_id INTEGER,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

### 3.5 Delivery & Dispatch Schema
**Источник:** BP-06, BP-13 исходного документа.

```sql
-- Курьер
CREATE TABLE couriers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'offline',
    -- Статусы: offline, free, busy, on_break
    current_location GEOGRAPHY(POINT),
    last_location_update TIMESTAMPTZ,
    vehicle_type TEXT DEFAULT 'car',
    zone_id INTEGER REFERENCES delivery_zones(id),
    max_weight_kg NUMERIC DEFAULT 80,
    shift_start TIME,
    shift_end TIME,
    rating NUMERIC DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_couriers_status ON couriers(status);
CREATE INDEX idx_couriers_location ON couriers USING GIST(current_location);

-- Доставка
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER UNIQUE REFERENCES orders(id),
    courier_id INTEGER REFERENCES couriers(id),
    status TEXT NOT NULL DEFAULT 'pending',
    -- Статусы: pending → assigned → picking_up → in_transit → delivered
    --           failed, returned
    assigned_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    eta_seconds INTEGER,
    eta_updated_at TIMESTAMPTZ,
    distance_meters INTEGER,
    courier_note TEXT,
    client_signature TEXT,
    photo_pod_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_deliveries_courier_id ON deliveries(courier_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- B2B компании
CREATE TABLE b2b_companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    inn TEXT UNIQUE NOT NULL,
    kpp TEXT,
    legal_address TEXT,
    actual_address TEXT,
    credit_limit NUMERIC,
    payment_deferral_days INTEGER DEFAULT 0,
    contract_number TEXT,
    contract_date DATE,
    edo_provider TEXT, -- 'diadoc' / 'sbis'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индивидуальные цены для B2B
CREATE TABLE b2b_prices (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES b2b_companies(id),
    product_id INTEGER REFERENCES chain_products(id),
    price NUMERIC NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE,
    UNIQUE(company_id, product_id, valid_from)
);

-- B2B заказы
CREATE TABLE b2b_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER UNIQUE REFERENCES orders(id),
    company_id INTEGER REFERENCES b2b_companies(id),
    po_number TEXT,
    delivery_note TEXT,
    invoice_url TEXT,
    upd_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 Notifications & Promotions Schema
**Источник:** BP-08, BP-09 исходного документа.

```sql
-- Уведомления
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    channel TEXT NOT NULL, -- 'push', 'sms', 'email', 'telegram'
    event_type TEXT NOT NULL,
    -- 'order.created', 'payment.succeeded', 'delivery.assigned',
    -- 'delivery.delivered', 'promo.received', 'order.reminder'
    title TEXT,
    body TEXT NOT NULL,
    payload JSONB,
    status TEXT NOT NULL DEFAULT 'pending',
    -- Статусы: pending → sent → delivered → failed
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Промокоды
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'percent', 'fixed', 'free_delivery'
    value NUMERIC NOT NULL,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    min_order_amount NUMERIC,
    max_discount NUMERIC,
    category_ids INTEGER[],
    first_order_only BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Использование промокодов
CREATE TABLE promo_code_uses (
    id SERIAL PRIMARY KEY,
    promo_code_id INTEGER REFERENCES promo_codes(id),
    order_id INTEGER REFERENCES orders(id),
    user_id INTEGER REFERENCES users(id),
    discount_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Баллы лояльности
CREATE TABLE loyalty_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    balance NUMERIC NOT NULL DEFAULT 0,
    lifetime_earned NUMERIC DEFAULT 0,
    lifetime_spent NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Транзакции баллов
CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type TEXT NOT NULL, -- 'earn', 'spend', 'expire', 'refund'
    amount NUMERIC NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Functional Requirements (Функциональные требования)

Каждый процесс описан по шаблону: триггер → шаги → данные → UI → интеграции → бизнес-правила → технические заметки → оценка.

**Источник:** Раздел 2.2 исходного документа.

### 4.1 Customer Domain (Клиент)

**Источник:** Раздел 2.2 исходного документа.

#### BP-01: Регистрация и аутентификация (14 чел.-дней)

**User Story:**
Как новый клиент,
Я хочу зарегистрироваться по номеру телефона через SMS-код,
Чтобы начать заказывать без запоминания паролей.

**Acceptance Criteria:**
Дано: Я нахожусь на экране регистрации
Когда: Я ввожу действительный номер телефона +7XXXXXXXXXX
Тогда: Система отправляет 4-значный SMS-код в течение 10 секунд
И Код истекает через 5 минут

Дано: Я ввёл неправильный SMS-код 3 раза
Когда: Я пытаюсь ввести 4-й раз
Тогда: Мой номер блокируется на 30 минут
И Я вижу чёткое сообщение со временем разблокировки

Дано: Я вернувшийся пользователь с существующим аккаунтом
Когда: Я ввожу свой номер телефона
Тогда: Система распознаёт мой аккаунт и выполняет вход после SMS-подтверждения
И Мне не нужно повторно вводить данные профиля

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Пользователь открывает приложение / сайт

**Бизнес-шаги:**

1. **Ввод номера телефона** — Пользователь вводит номер в поле ввода (формат: +7XXXXXXXXXX)
2. **Отправка SMS с кодом** — Система генерирует 4-значный код, отправляет через SMS-провайдера (код жив 5 минут, 3 попытки ввода)
3. **Подтверждение кода** — Пользователь вводит код из SMS (при 3 неверных — блокировка на 30 мин)
4. **Создание/поиск профиля** — Если номер новый → создаётся профиль, если существующий → вход
5. **Выдача токена** — Система выдаёт JWT access + refresh токены (access — 15 мин, refresh — 30 дней)

**Данные процесса:**

- `users`: id, phone, name, email, role, created_at, updated_at
- `sessions`: id, user_id, refresh_token, expires_at, device_info

**UI / Интерфейсы:**

- Экран ввода номера
- Экран ввода SMS-кода
- Экран профиля (после регистрации)

**Интеграции:**

- SMS-провайдер (телефон, текст сообщения)

**Бизнес-правила:**

- Если пользователь не завершил регистрацию (не ввёл код) — номер считается незанятым
- Один номер — один аккаунт
- Админы создаются только через бэк-офис

**Технические заметки:**

- JWT access token (15 мин) + refresh token (30 дней, rotation)
- Rate limit: 3 запроса SMS/мин на номер
- Блокировка номера на 30 мин после 3 неверных попыток ввода кода

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>5 </td>
</tr>
<tr>
<td> Frontend</td>
<td>3 </td>
</tr>
<tr>
<td> Mobile</td>
<td>4 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**14** </td>
</tr>
</tbody>
</table>

---

#### BP-02: Каталог и поиск товаров (28 чел.-дней)

**User Story:**
Как покупатель,
Я хочу просматривать товары по категориям, искать по названию и применять фильтры,
Чтобы быстро находить нужные мне товары.

**Acceptance Criteria:**
Дано: Я нахожусь на странице каталога
Когда: Я выбираю категорию
Тогда: Я вижу постраничный список товаров в этой категории
И Каждая карточка товара показывает название, цену, вес и изображение

Дано: Я ввожу поисковый запрос
Когда: Система выполняет поиск по названию товара и бренду
Тогда: Я вижу соответствующие результаты в течение 2 секунд
И Неподходящие товары исключаются

Дано: Я применяю фильтр (например, бренд или ценовой диапазон)
Когда: Каталог обновляется
Тогда: Показываются только товары, соответствующие фильтру
И Опции фильтра динамически обновляются на основе доступных товаров

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Пользователь открывает каталог / вводит поисковый запрос

**Бизнес-шаги:**

1. **Выбор магазина** — Пользователь вводит адрес → система показывает доступные магазины (магазины определяются по зоне доставки адреса)
2. **Открытие каталога** — Пользователь выбирает категорию из списка (категории — дерево, 3 уровня: корневая → подкатегория → товары)
3. **Загрузка товаров** — Система выполняет запрос к БД / кэшу (пагинация)
4. **Фильтрация** — Пользователь выбирает фильтры (тип, бренд, цена, жирность и т.д.) (фильтры зависят от категории, динамические)
5. **Поиск** — Пользователь вводит текст поиска (поиск по названию, бренду)
6. **Отображение** — Система показывает карточки товаров с ценой и фото (фото с Selectel CDN)

**Данные процесса:**

- `categories`: id, parent_id, name, icon_path, sort_order
- `category_filters`: id, category_id, filter_name (например «Вид овоща», «Жирность», «Бренд»)
- `filter_values`: id, filter_id, value_name (например «Томаты», «Valio», «20%»)
- `products`: id, name, sku, barcode, price, old_price, category_id, images, attributes (JSONB)
- `stores`: id, name, chain_id, address, coordinates, working_hours
- `store_inventory`: store_id, product_id, quantity

**Структура фильтров:**

- Фильтры привязаны к категории, а не глобальные
- Пример для «Молоко и сливки»: Тип (молоко/сливки/козье), Обработка (стерилизованное/УВТ/пастеризованное), Жирность (0–40%), Фермерский продукт, Бренд
- Пример для «Овощи»: Вид овоща (томаты/перец/лук/...), Томаты (сливовидные/черри/...), Бренд

**Источник данных о товарах:**

- Цены и ассортимент получаются от сетей супермаркетов (API или парсинг)
- Актуальность остатков — не гарантирована, пикер проверяет в магазине

**UI / Интерфейсы:**

- Главная страница каталога (корневые категории с иконками)
- Список товаров (плитка/список, фото, цена, вес)
- Детальная карточка товара
- Поисковая строка
- Фильтры: сайдбар / выезжающая панель

**Бизнес-правила:**

- Цена = базовая цена сети - скидка (если есть акция/промокод)
- Наличие — не гарантируется до фактической сборки пикером
- Если товара нет в магазине — пикер звонит клиенту с вариантами замены
- Алкоголь и сигареты не доставляются (законодательный запрет)

**Технические заметки:**

- Фото товаров хранятся на Selectel CDN
- Пагинация списка товаров
- Фильтры динамические, зависят от категории
- Данные о ценах и ассортименте — внешние, от сетей супермаркетов (API или парсинг)

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>10 </td>
</tr>
<tr>
<td> Frontend</td>
<td>6 </td>
</tr>
<tr>
<td> Mobile</td>
<td>8 </td>
</tr>
<tr>
<td> QA</td>
<td>4 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**28** </td>
</tr>
</tbody>
</table>

---

#### BP-03: Оформление заказа (Корзина → Заказ) (34 чел.-дней)

**User Story:**
Как покупатель,
Я хочу добавлять товары в корзину, выбирать параметры доставки и оформлять заказ,
Чтобы мои продукты были доставлены по моему адресу.

**Acceptance Criteria:**
Дано: У меня есть товары в корзине
Когда: Я перехожу к оформлению заказа
Тогда: Я могу выбрать адрес доставки, временной слот и способ оплаты
И Я вижу итоговую сумму, включая стоимость доставки

Дано: Я ввёл действительный промокод
Когда: Я применяю его
Тогда: Скидка отражается в итоговой сумме заказа
И Сумма со скидкой показана чётко

Дано: Я нажимаю «Оформить заказ»
Когда: Система создаёт заказ
Тогда: Статус заказа устанавливается «Ожидает оплаты» (онлайн) или «Принят» (наличные)
И Я получаю подтверждение на экране

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Пользователь выбирает товары и переходит к оформлению

**Бизнес-шаги:**

1. **Выбор магазина** — Система автоматически выбирает магазин по адресу (клиент может сменить магазин вручную)
2. **Добавление товаров** — Пользователь выбирает товары из каталога (можно добавить в заказ после оформления, пока сборка не началась)
3. **Применение промокода / баллов** — Пользователь вводит промокод (скидка не суммируется с другими акциями)
4. **Выбор временного слота** — Пользователь выбирает дату (сегодня/завтра/+3 дня) и интервал (слоты зависят от магазина и загрузки курьеров)
5. **Выбор адреса доставки** — Пользователь вводит или выбирает сохранённый (геокодирование, проверка попадания в зону доставки)
6. **Выбор способа оплаты** — Пользователь выбирает онлайн / СБП / картой курьеру / наличные
7. **Подтверждение** — Пользователь нажимает «Оформить заказ» (рассчитывается стоимость сборки и доставки)
8. **Создание заказа** — Система переводит статус в «Ожидает оплаты» (для онлайн) или «Принят» (для наличных)

**Особенность:** нет резервирования товаров при добавлении в корзину. Товар резервируется только после создания заказа. Актуальное наличие проверяет пикер в магазине.

**Данные процесса:**

- `carts`: id, user_id, store_id, items (JSONB), created_at, updated_at
- `orders`: id, user_id, store_id, status, total, delivery_fee, service_fee, delivery_address, payment_method, delivery_slot, weight, comment, created_at
- `order_items`: id, order_id, product_id, quantity, price, substituted (если замена), substituted_from_id
- `promo_codes`: id, code, type (percent/fixed/delivery), value, max_uses, used_count, min_order_amount, expires_at
- `loyalty_points`: id, user_id, balance

**UI / Интерфейсы:**

- Экран корзины (товары, количество, сумма, промокод)
- Экран оформления (адрес, слот, оплата)
- Экран подтверждения заказа
- Опция «Можно раньше» — согласие на более раннюю доставку

**Интеграции:**

- Геокодер (Яндекс.Карты) — адрес → координаты, проверка зоны доставки
- Telegram bot поддержки — изменение заказа

**Бизнес-правила:**

- Максимальный вес заказа: 80 кг
- Доставка бесплатна от определённой суммы (настраивается для каждого магазина)
- Можно заказать на сегодня, завтра или на 3 дня вперёд
- После оформления можно добавить товары кнопкой «В заказ» (до начала сборки)
- Время доставки: 10:00–22:00 (МСК)
- Стоимость сборки и доставки рассчитывается перед подтверждением
- Скидка по промокоду не суммируется с другими акциями

**Технические заметки:**

- Корзина хранится в JSONB, товары не резервируются до создания заказа
- Геокодирование через Яндекс.Карты
- Telegram bot для поддержки
- Вес заказа ограничен 80 кг

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>12 </td>
</tr>
<tr>
<td> Frontend</td>
<td>8 </td>
</tr>
<tr>
<td> Mobile</td>
<td>10 </td>
</tr>
<tr>
<td> QA</td>
<td>4 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**34** </td>
</tr>
</tbody>
</table>

---

#### BP-04: Оплата заказа (26 чел.-дней)

**User Story:**
Как покупатель,
Я хочу оплатить заказ онлайн банковской картой или через СБП,
Чтобы заказ был подтверждён и обработан.

**Acceptance Criteria:**
Дано: Я выбираю онлайн-оплату картой
Когда: Я перенаправляюсь на платёжный шлюз Т-Банка
Тогда: Мои данные карты вводятся на странице банка (не на нашем сервере)
И После успешного 3DSecure статус заказа меняется на «Оплачен»

Дано: Банк отклоняет мой платёж
Когда: Я получаю уведомление об ошибке
Тогда: Заказ остаётся в статусе «Ожидает оплаты»
И Я могу выбрать другой способ оплаты или повторить попытку

Дано: Я выбираю оплату наличными при доставке
Когда: Курьер прибывает
Тогда: Я могу оплатить наличными и получить сдачу
И Заказ отмечается как доставленный

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Заказ создан со статусом «Ожидает оплаты»

**Бизнес-шаги:**

1. **Перенаправление на платёжный шлюз** — Система формирует ссылку на оплату (разные ссылки для разных банков)
2. **Ввод данных карты** — Пользователь вводит номер, срок, CVV (данные не проходят через наш сервер)
3. **Обработка платежа** — Банк списывает средства (3DSecure при необходимости)
4. **Callback от банка** — Система получает уведомление об успехе/отказе (webhook + polling)
5. **Обновление статуса заказа** — Успех → «Оплачен», отказ → ошибка пользователю

**Данные процесса:**

- `payments`: id, order_id, amount, status, provider, provider_payment_id, created_at
- `refunds`: id, payment_id, amount, reason, status

**Интеграции:**

- **Т-Банк (Тинькофф)** — сумма, order_id, success_url, fail_url → payment_url (основной шлюз)
- **СБП** — QR-код генерируется курьером при получении (вторичный)
- Карта курьеру — POS-терминал курьера (offline)
- Наличные — при получении (offline)

**Подтверждено:**
> «Для оплаты необходимо ввести реквизиты карты. Для этого мы перенаправим вас на платёжный шлюз банка Тинькофф. Соединение с платёжным шлюзом и передача информации осуществляется в защищённом режиме с использованием протокола шифрования SSL.»
> «Во время доставки курьер создаст для вас QR-код. Считайте его смартфоном и подтвердите операцию в приложении вашего банка.»

**Бизнес-правила:**

- Онлайн-оплата: перенаправление на шлюз Т-Банка, 3DSecure
- СБП: QR-код от курьера при получении, оплата через приложение банка
- Карта курьеру: POS-терминал на месте
- Наличные: оплата при получении, курьер выдаёт сдачу
- Электронный чек приходит на телефон/email
- Добавление карты: холд 1 руб. для проверки платежеспособности
- Полная стоимость списывается после получения и проверки заказа
- Refund: полный или частичный (по запросу менеджера)

**Технические заметки:**

- Webhook + polling для получения callback от банка
- Данные карты не проходят через сервер (PCI DSS compliance)
- Поддержка 3DSecure

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>15 </td>
</tr>
<tr>
<td> Frontend</td>
<td>3 </td>
</tr>
<tr>
<td> Mobile</td>
<td>3 </td>
</tr>
<tr>
<td> QA</td>
<td>5 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**26** </td>
</tr>
</tbody>
</table>

---

#### BP-10: Личный кабинет и история заказов (13 чел.-дней)

**User Story:**
Как покупатель,
Я хочу просматривать свой профиль, историю заказов и управлять адресами,
Чтобы отслеживать свою активность и поддерживать информацию в актуальном состоянии.

**Acceptance Criteria:**
Дано: Я авторизован и нахожусь на странице профиля
Когда: Я просматриваю историю заказов
Тогда: Я вижу постраничный список всех моих заказов со статусом, датой и суммой
И Я могу фильтровать по статусу заказа

Дано: Я хочу отредактировать свои личные данные
Когда: Я изменяю имя или email
Тогда: Изменения сохраняются немедленно
И Мой профиль отображает обновлённую информацию

Дано: У меня нет прошлых заказов
Когда: Я открываю историю заказов
Тогда: Я вижу сообщение, что история заказов пуста
И Кнопку призыва к действию для начала покупок

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Пользователь заходит в профиль

**Бизнес-шаги:**

1. **Просмотр/редактирование профиля** — Пользователь просматривает и редактирует имя, телефон, email
2. **Просмотр истории заказов** — Пользователь просматривает список заказов с пагинацией и фильтром по статусу
3. **Просмотр деталей заказа** — Пользователь просматривает товары, статус, трекинг
4. **Управление адресами** — Пользователь просматривает и управляет сохранёнными адресами доставки
5. **Избранное / Wishlist** — Пользователь управляет списком избранных товаров

**Данные процесса:**

- `users`: id, phone, name, email, role, created_at, updated_at (профиль)
- `orders`: id, user_id, store_id, status, total, delivery_address, delivery_slot, created_at (история)
- `addresses`: id, user_id, address, coordinates, label, is_default
- `wishlist`: id, user_id, product_id, created_at

**UI / Интерфейсы:**

- Страница профиля (имя, телефон, email)
- Список заказов (пагинация, фильтр по статусу)
- Детали заказа (товары, статус, трекинг)
- Сохранённые адреса доставки
- Избранное / Wishlist

**Бизнес-правила:**

- Пользователь может редактировать только свои данные
- История заказов доступна за всё время
- Удаление аккаунта — через поддержку

**Технические заметки:**

- Пагинация списка заказов
- Фильтрация по статусу заказа

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>4 </td>
</tr>
<tr>
<td> Frontend</td>
<td>3 </td>
</tr>
<tr>
<td> Mobile</td>
<td>4 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**13** </td>
</tr>
</tbody>
</table>

---

### 4.2 Picker Domain (Пикер)

**Источник:** Раздел 2.2 исходного документа.

#### BP-05: Сборка и упаковка заказа (21 чел.-дней)

**User Story:**
Как пикер,
Я хочу получать задания на сборку, сканировать товары, обрабатывать замены и упаковывать заказы,
Чтобы клиенты получали точные и свежие продукты.

**Acceptance Criteria:**
Дано: Я получаю новое задание на сборку в приложении пикера
Когда: Я открываю заказ
Тогда: Я вижу список товаров с названием, количеством и расположением в магазине
И Я могу сканировать штрихкоды для подтверждения каждого товара

Дано: Товара нет в наличии
Когда: Я отмечаю его как недоступный
Тогда: Система предлагает до 5 альтернативных товаров из той же категории
И Я могу позвонить клиенту для подтверждения замены

Дано: Я собрал и упаковал все товары
Когда: Я подтверждаю готовность заказа
Тогда: Статус меняется на «Готов к доставке»
И Заказ появляется в очереди курьера

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Заказ оплачен / подтверждён

**Бизнес-шаги:**

1. **Поступление заказа пикеру** — Система отправляет заказ в приложение пикера (FIFO)
2. **Сборка товаров в зале** — Пикер идёт по списку, отбирает товары с полок (выбирает самые свежие, целые яйца, лучшие овощи/фрукты)
3. **Проверка наличия** — Пикер сверяет товар с заказом (если товара нет → звонит клиенту, предлагает замену)
4. **Замена товара** — Пикер предлагает альтернативу, клиент соглашается или отказывается (замена фиксируется в системе)
5. **Упаковка** — Пикер фасует по пакетам, термосумкам, контейнерам (соблюдение товарного соседства: мясо отдельно, химия отдельно)
6. **Передача курьеру** — Упакованный заказ передаётся курьеру (статус → «Передан в доставку»)

**Особенность:** сборка происходит в торговом зале супермаркета (не на складе). Пикеры работают непосредственно в гипермаркетах.

**Сценарий замены товара (поэтапно):**

1. **Обнаружение отсутствия** — Пикер нажимает «Нет в наличии» (система проверяет альтернативы в этом магазине)
2. **Поиск альтернатив** — Система ищет товары той же категории, того же бренда, аналогичной цены (приоритет: тот же бренд → та же категория → ближайшая цена)
3. **Предложение замен** — Система показывает пикеру список альтернатив до 5 (каждая с ценой, весом, фото)
4. **Звонок клиенту** — Пикер звонит клиенту через встроенный звонок (скрытый номер)
5. **Выбор альтернативы** — Клиент соглашается на одну из предложенных или просит другую
6. **Фиксация замены** — Замена записывается в `order_items.substituted_from_id` (цена замены может отличаться)
7. **Отказ от замены** — Клиент отказывается от товара (товар исключается из заказа, стоимость пересчитывается)

**Особенности замены:**

- Если клиент не берёт трубку — пикер оставляет товар в заказе (без замены), клиент может отказаться при получении
- Замена возможна только на товары в наличии в этом магазине (проверка по последней синхронизации)
- Цена замены фиксируется в момент согласия клиента (не меняется при пересчёте корзины)

**Данные процесса:**

- `orders`: id, user_id, store_id, status, total, items (JSONB)
- `order_items`: id, order_id, product_id, quantity, price, substituted, substituted_from_id
- `store_inventory`: store_id, product_id, quantity

**UI (внутреннее приложение пикера):**

- Список заказов на сборку
- Детали заказа со списком товаров
- Сканер штрихкодов
- Интерфейс замены товара (выбор альтернативы, звонок клиенту)
- Подтверждение упаковки

**Бизнес-правила:**

- Пикер отбирает товары максимально свежие (молоко/яйца — из глубины полки)
- При отсутствии товара → обязательный звонок клиенту
- Упаковка: термосумки для заморозки, отдельно для химии, хрупкое отдельно
- Опция «Меньше пакетов» — экологичная упаковка

**Технические заметки (архитектура приложения пикера):**

- **Архитектура:** Feature-first (models/screens/state/widgets)
- **State management:** Provider
- **Build flavors:** dev, dev_gooods, prod, prod_gooods
- **Real-time:** Cloud Firestore listeners (push)
- **Offline:** Firestore offline persistence
- **Сканер штрихкодов:** Scandit (scandit_flutter_datacapture_barcode)
- **Локальное хранение:** Firestore cache (SQLite)
- **Backend:** Firebase (Auth, Firestore, Crashlytics, Analytics, App Check)
- **CI/CD:** GitHub Actions — dev на tag push, prod вручную

**Сценарии работы пикера в офлайне:**

1. Нет интернета в подвале супермаркета — последний загруженный заказ остаётся на экране, сканер работает локально, отметки о сборке ставятся в local queue
2. Восстановление связи — queue синхронизируется с сервером (batch update), дубли разрешаются по updated_at
3. Замена товара — пикер звонит клиенту напрямую (голосовая связь, не требует интернета), после подтверждения вводит замену — данные попадают в queue

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend (API для пикера)</td>
<td>8 </td>
</tr>
<tr>
<td> Mobile (приложение пикера)</td>
<td>10 </td>
</tr>
<tr>
<td> QA</td>
<td>3 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**21** </td>
</tr>
</tbody>
</table>

---

### 4.3 Courier Domain (Курьер)

**Источник:** Раздел 2.2 исходного документа.

#### BP-06: Доставка заказа (29 чел.-дней)

**User Story:**
Как курьер,
Я хочу получать задания на доставку с навигацией, принимать оплату и подтверждать доставку,
Чтобы заказы доставлялись клиентам вовремя.
Как клиент,
Я хочу отслеживать свою доставку в реальном времени,
Чтобы знать, когда ожидать мой заказ.

**Acceptance Criteria:**
Дано: Я курьер, которому назначена новая доставка
Когда: Я просматриваю задание в приложении курьера
Тогда: Я вижу магазин для получения, адрес клиента, ETA и вес заказа
И Я могу построить маршрут до обеих точек

Дано: Я прибываю по адресу клиента
Когда: Клиент принимает заказ
Тогда: Я могу зафиксировать оплату (карта/наличные/SBP QR)
И Захватить подпись клиента как подтверждение доставки

Дано: Я теряю интернет-соединение во время доставки
Когда: Я завершаю доставку
Тогда: Обновление статуса ставится в локальную очередь
И Автоматически синхронизируется при восстановлении соединения

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Заказ собран и упакован пикером

**Бизнес-шаги:**

1. **Назначение курьера** — Система выбирает свободного автокурьера, ближайшего к магазину (курьер на личном авто, права кат. B, знание города)
2. **Получение заказа** — Курьер забирает упакованный заказ у пикера (проверка веса, макс. 80 кг)
3. **Построение маршрута** — Курьер строит маршрут в приложении (интеграция с картами)
4. **Доставка** — Курьер привозит заказ клиенту (клиент проверяет заказ)
5. **Приём оплаты** — Если не онлайн — курьер принимает оплату картой/наличными/СБП (СБП: курьер показывает QR-код)
6. **Завершение** — Система переводит статус в «Доставлен», деньги списаны

**Данные процесса:**

- `deliveries`: id, order_id, courier_id, status, assigned_at, picked_at, delivered_at
- `couriers`: id, user_id, status (free/busy), zone_id, vehicle_type, current_location (POINT)
- `delivery_zones`: id, store_id, polygon (GEOJSON), delivery_fee, min_order_amount

**UI / Интерфейсы:**

- **Приложение курьера (Android/iOS):** список заказов, навигация, сканер, приём оплаты, история
- **Трекинг для клиента:** отслеживание статуса (сборка → доставка)
- **Опция «Можно раньше»:** клиент готов принять заказ раньше выбранного слота

**Интеграции:**

- Карты (Яндекс / Google) — маршрут, навигация
- Т-Банк / СБП — приём оплаты курьером

**Технические заметки (алгоритм назначения курьера):**

**Математическая модель (Multi-objective optimization):**

<table>
<thead><tr>
<th> Цель (objective)</th>
<th>Что минимизируем</th>
<th>Вес </th>
</tr></thead>
<tbody>
<tr>
<td> Время доставки</td>
<td>Суммарное время всех маршрутов</td>
<td>Высокий </td>
</tr>
<tr>
<td> SLA</td>
<td>Отклонение от обещанного временного слота</td>
<td>Высокий </td>
</tr>
<tr>
<td> Дистанция</td>
<td>Общий пробег всех курьеров</td>
<td>Средний </td>
</tr>
<tr>
<td> Disruption</td>
<td>Количество изменений в уже построенных маршрутах</td>
<td>Низкий </td>
</tr>
<tr>
<td> Fairness</td>
<td>Равномерность загрузки курьеров</td>
<td>Средний </td>
</tr>
<tr>
<td> Zone familiarity</td>
<td>Назначение курьеру заказов в знакомом районе</td>
<td>Низкий </td>
</tr>
</tbody>
</table>

**Алгоритм:**

1. **Batching** — каждые 15–60 секунд собираем пул новых заказов (100–1000+)
2. **Cheapest Insertion Heuristic** — для каждого нового заказа находим оптимальное место в маршруте каждого курьера (минимальное увеличение времени/дистанции)
3. **2-opt local search** — после вставки всех заказов улучшаем маршруты перестановками (разворот подмаршрутов)
4. **Constraint satisfaction** — проверка: вместимость авто, смены курьеров (не более 8 ч), дедлайны окон доставки, география (зона доставки)

**Реализация:** service `delivery-dispatcher` с очередью RabbitMQ, идемпотентное назначение (каждый заказ назначается ровно один раз).

**Технические заметки (расчёт ETA доставки):**

**Гибридный подход (2 фазы):**

**Фаза 1 — OSRM (базовый маршрут):**
POST /table?sources={магазин}&destinations={адрес_клиента} → distance_m, duration_s (базовое время без учёта трафика)

**Фаза 2 — ML-коррекция (XGBoost / Ridge Regression):**

<table>
<thead><tr>
<th> Признак (feature)</th>
<th>Источник</th>
<th>Пример </th>
</tr></thead>
<tbody>
<tr>
<td> `osrm_distance_m`</td>
<td>OSRM Table API</td>
<td>5230 </td>
</tr>
<tr>
<td> `osrm_duration_s`</td>
<td>OSRM Table API</td>
<td>780 </td>
</tr>
<tr>
<td> `departure_hour`</td>
<td>Время выезда курьера</td>
<td>18 </td>
</tr>
<tr>
<td> `weekday`</td>
<td>День недели (0=Пн)</td>
<td>5 </td>
</tr>
<tr>
<td> `is_weekend`</td>
<td>Выходной</td>
<td>1 </td>
</tr>
<tr>
<td> `is_peak_morning`</td>
<td>08:00–10:00</td>
<td>0 </td>
</tr>
<tr>
<td> `is_peak_evening`</td>
<td>17:00–20:00</td>
<td>1 </td>
</tr>
<tr>
<td> `weather`</td>
<td>OpenWeather API</td>
<td>«rain» </td>
</tr>
<tr>
<td> `traffic_density`</td>
<td>Яндекс.Пробки / Google Traffic</td>
<td>7/10 </td>
</tr>
<tr>
<td> `festival`</td>
<td>Календарь праздников</td>
<td>0 </td>
</tr>
<tr>
<td> `rain_factor`</td>
<td>Сила дождя (0–1)</td>
<td>0.7 </td>
</tr>
<tr>
<td> `service_time_min`</td>
<td>Время передачи/проверки заказа</td>
<td>3 </td>
</tr>
<tr>
<td> `vehicle_type`</td>
<td>Тип авто курьера</td>
<td>«sedan» </td>
</tr>
</tbody>
</table>

**Результаты моделей:**
<table>
<thead><tr>
<th> Модель</th>
<th>MAE (мин)</th>
<th>RMSE (мин)</th>
<th>R² </th>
</tr></thead>
<tbody>
<tr>
<td> OSRM baseline</td>
<td>4.8</td>
<td>5.9</td>
<td>— </td>
</tr>
<tr>
<td> XGBoost</td>
<td>3.10</td>
<td>3.84</td>
<td>0.8317 </td>
</tr>
<tr>
<td> Ridge Regression (traffic-adjusted)</td>
<td>1.88</td>
<td>—</td>
<td>0.977 </td>
</tr>
</tbody>
</table>

**Реализация:** микросервис `eta-estimator` — получает события `delivery.assigned`, запрашивает OSRM + погоду, возвращает скорректированное ETA. Кэш: 15 мин для одинаковых пар (магазин, адрес). ETA пересчитывается каждые 5 минут во время доставки (если курьер отклонился от маршрута или изменился трафик).

**Технические заметки (offline-first приложение курьера):**

<table>
<thead><tr>
<th> Компонент</th>
<th>Решение</th>
<th>Зачем </th>
</tr></thead>
<tbody>
<tr>
<td> State management</td>
<td>Provider + BLoC</td>
<td>Provider для простых состояний (UI), BLoC для сложных (синхронизация, навигация) </td>
</tr>
<tr>
<td> Локальное хранение</td>
<td>Hive CE (hive_ce) + SharedPreferences + flutter_secure_storage</td>
<td>Hive — быстрая NoSQL БД на диске, работает без сети </td>
</tr>
<tr>
<td> Sync queue</td>
<td>Smart Sync Queue (модуль StoreToOffline/)</td>
<td>Очередь изменений: когда нет сети — кладём в Hive, при появлении — отправляем batch </td>
</tr>
<tr>
<td> Карты и навигация</td>
<td>Google Maps + Google Directions API + flutter_polyline_points</td>
<td>Off-route detection с визуальным + звуковым алертом, Live GPS с гироскопом </td>
</tr>
<tr>
<td> Офлайн-карты</td>
<td>Не поддерживается (MVP)</td>
<td>Кэширование тайлов (V2): MBTiles + flutter_map </td>
</tr>
<tr>
<td> Оплата без интернета</td>
<td>Holds в локальной queue</td>
<td>Курьер нажимает «Оплачено» → запись в Hive → при появлении сети отправляется в платёжный шлюз </td>
</tr>
<tr>
<td> Документы (POD)</td>
<td>Digital signature + photo capture</td>
<td>Подпись клиента и фото заказа сохраняются локально, синхронизируются batch </td>
</tr>
<tr>
<td> Backend</td>
<td>Odoo JSON-RPC</td>
<td>Референс использует Odoo; для нас — API на Rails / Go </td>
</tr>
</tbody>
</table>

**Сценарии работы курьера в офлайне:**

1. Нет сети в подъезде/лифте — заказ открыт, навигация по кэшированным данным, отметка «доставлен» ставится в queue
2. Пропала связь при приёме оплаты — hold в Hive, после восстановления — отправка в платёжный шлюз с проверкой дубликатов по order_id + amount
3. Длительный офлайн (например метро) — queue растёт локально, при появлении сети — batch upload с дедупликацией по updated_at

**Бизнес-правила:**

- Курьер — автокурьер (личное авто, права кат. B)
- Максимальный вес заказа: 80 кг
- Часы доставки: 10:00–22:00 (МСК)
- Заказы принимаются на сегодня, завтра и на 3 дня вперёд
- Стоимость доставки рассчитывается в корзине (может быть бесплатной от суммы)
- Если товар повреждён при доставке — возврат/замена через поддержку

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>10 </td>
</tr>
<tr>
<td> Mobile (курьер)</td>
<td>12 </td>
</tr>
<tr>
<td> Frontend (трекинг)</td>
<td>3 </td>
</tr>
<tr>
<td> QA</td>
<td>4 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**29** </td>
</tr>
</tbody>
</table>

---

### 4.4 Admin Domain (Администратор)

**Источник:** Раздел 2.2 исходного документа.

#### BP-07: Возврат и отмена заказа (14 чел.-дней)

**User Story:**
Как покупатель,
Я хочу отменить заказ или вернуть товары,
Чтобы получить возврат средств, когда что-то пошло не так.

**Acceptance Criteria:**
Дано: Мой заказ ещё собирается
Когда: Я запрашиваю отмену
Тогда: Заказ отменяется немедленно
И Полная сумма возвращается в течение 24 часов

Дано: Мой заказ уже доставлен
Когда: Я запрашиваю возврат в течение 14 дней
Тогда: Курьер забирает возвращаемые товары
И Возврат средств обрабатывается через исходный способ оплаты

Дано: Мой заказ находится в доставке
Когда: Я запрашиваю отмену
Тогда: Отмена обрабатывается с удержанием сервисного сбора
И Оставшаяся сумма возвращается

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Клиент хочет отменить заказ / вернуть товар

**Бизнес-шаги:**

1. **Запрос отмены** — Пользователь нажимает «Отменить заказ» (можно отменить, если статус ≠ «Передан в доставку»)
2. **Проверка возможности отмены** — Система проверяет статус заказа
3. **Отмена / Возврат** — Система переводит статус в «Отменён», инициируется refund (refund через тот же платёжный метод)
4. **Уведомление** — Система отправляет письмо/push об отмене
5. **Возврат товара (если передан курьеру)** — Курьер забирает товар (курьер получает задачу на возврат)

**Бизнес-правила:**

- До сборки: отмена мгновенно, возврат средств в течение 24 ч
- После сборки, до доставки: отмена возможна, но комиссия
- После доставки: возврат в течение 14 дней по закону о защите прав потребителей
- Возврат товара ненадлежащего качества: курьер забирает товар, деньги возвращаются
- Поддержка: Telegram-бот или телефон
- Возврат средств — через тот же платёжный метод, которым оплачивали

**Технические заметки:**

- Refund инициируется через тот же платёжный провайдер
- Курьер получает задачу на возврат через приложение курьера

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>6 </td>
</tr>
<tr>
<td> Frontend</td>
<td>2 </td>
</tr>
<tr>
<td> Mobile</td>
<td>3 </td>
</tr>
<tr>
<td> QA</td>
<td>3 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**14** </td>
</tr>
</tbody>
</table>

---

#### BP-08: Управление промокодами и акциями (10 чел.-дней)

**User Story:**
Как маркетинг-менеджер,
Я хочу создавать промокоды с пользовательскими правилами и ограничениями,
Чтобы запускать целевые акции для привлечения клиентов.

**Acceptance Criteria:**
Дано: Я нахожусь в разделе управления промокодами админки
Когда: Я создаю новый промокод
Тогда: Я могу задать тип (процент/фикс/доставка), значение, минимальную сумму заказа, макс. количество использований и дату истечения
И Промокод сохраняется и доступен для использования

Дано: Клиент вводит просроченный промокод
Когда: Промокод проверяется
Тогда: Система отклоняет его с чётким сообщением «Срок действия промокода истёк»
И Скидка не применяется

Дано: Промокод достиг лимита использований
Когда: Клиент пытается применить его
Тогда: Система отклоняет его с сообщением «Достигнут лимит использований промокода»
И Скидка не применяется

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Администратор создаёт акцию

**Бизнес-шаги:**

1. **Создание акции** — Админ заполняет форму: тип, размер, условия
2. **Применение в корзине** — При вводе промокода — пересчёт суммы (скидка не суммируется с другими акциями)

**Данные процесса:**

- `promo_codes`: id, code, type (percent/fixed/delivery), value, max_uses, used_count, min_order_amount, expires_at

**UI / Интерфейсы:**

- Форма создания промокода в админ-панели
- Отображение применения промокода в корзине

**Бизнес-правила:**

- Типы: процентная (например 10%), фиксированная (например 500 руб), бесплатная доставка
- Ограничения: минимальная сумма заказа, категории товаров, макс. количество использований
- Программа лояльности: начисление баллов за заказы, списание баллов при оплате
- Промокод на первый заказ — скидка для новых пользователей
- Скидка в день рождения
- Ограничение: скидки не суммируются с другими акциями

**Технические заметки:**

- Проверка промокода при каждом применении (срок действия, лимит использований)
- Интеграция с корзиной для пересчёта суммы

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>5 </td>
</tr>
<tr>
<td> Frontend</td>
<td>3 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**10** </td>
</tr>
</tbody>
</table>

---

#### BP-15: Dispute & Chargeback Workflow (18 чел.-дней)

**User Story:**
Как покупатель,
Я хочу оспорить проблему с моим заказом, когда что-то пошло не так,
Чтобы получить возврат средств или замену без хлопот.

Как менеджер поддержки,
Я хочу просматривать и разрешать споры эффективно,
Чтобы минимизировать финансовые потери от chargeback.

**Acceptance Criteria:**

Дано: Клиент получил неверный/повреждённый товар или не получил доставку
Когда: Он создаёт спор через приложение или чат поддержки
Тогда: Система создаёт запись спора со статусом `pending`
И Автоматическая проверка начинается немедленно

Дано: Спор проходит авто-разрешение (чёткие доказательства)
Когда: Система находит, что курьер фото-подтвердил доставку
Тогда: Спор авто-отклоняется с объяснением клиенту

Дано: Клиент подаёт 3 спора в течение 30 дней
Когда: Создаётся 3-й спор
Тогда: Учётная запись клиента временно блокируется
И Все активные споры передаются на ручную проверку

**Workflow:**

![Рис. 16: Dispute & Chargeback — Workflow (спор создан → расследование → решение → refund)](exports/diagrams/diagram-16.png)

**Типы споров:**

<table>
<thead><tr>
<th> Тип</th>
<th>Пример</th>
<th>Авто-решение?</th>
<th>SLA </th>
</tr></thead>
<tbody>
<tr>
<td> Товар не доставлен</td>
<td>Курьер отметил доставку, но клиент не получил</td>
<td>✅ Да (проверка POD-фото + GPS трек)</td>
<td>< 1 час </td>
</tr>
<tr>
<td> Товар повреждён</td>
<td>Битая упаковка, испорченный продукт</td>
<td>❌ Нет (нужно фото от клиента)</td>
<td>< 24 часа </td>
</tr>
<tr>
<td> Товар не соответствует описанию</td>
<td>Не тот вес, срок годности истёк</td>
<td>❌ Нет (ручная проверка)</td>
<td>< 24 часа </td>
</tr>
<tr>
<td> Несанкционированная транзакция</td>
<td>Клиент утверждает, что не платил</td>
<td>⚠️ Частично (проверка device fingerprint)</td>
<td>< 72 часа </td>
</tr>
<tr>
<td> Двойное списание</td>
<td>Два списания за один заказ</td>
<td>✅ Да (проверка payment_id)</td>
<td>< 1 час </td>
</tr>
</tbody>
</table>

**Таблица ответственности:**

<table>
<thead><tr>
<th> Ситуация</th>
<th>Кто несёт ответственность</th>
<th>Финансовые последствия </th>
</tr></thead>
<tbody>
<tr>
<td> Товар не собран / не найден в магазине</td>
<td>Пикер / Магазин</td>
<td>Агрегатор взыскивает с магазина </td>
</tr>
<tr>
<td> Товар повреждён при сборке</td>
<td>Пикер</td>
<td>Стоимость товара списывается с пикера (после 3 инцидентов) </td>
</tr>
<tr>
<td> Товар повреждён при доставке</td>
<td>Курьер</td>
<td>Стоимость товара + штраф курьеру </td>
</tr>
<tr>
<td> Товар не доставлен (потерян)</td>
<td>Агрегатор</td>
<td>Полный refund клиенту за счёт агрегатора </td>
</tr>
<tr>
<td> Фрод со стороны клиента</td>
<td>Клиент</td>
<td>Блокировка аккаунта, chargeback оспаривается в банке </td>
</tr>
<tr>
<td> Ошибка платежного шлюза</td>
<td>Банк / Платёжный провайдер</td>
<td>Агрегатор оспаривает chargeback </td>
</tr>
</tbody>
</table>

**Блокировка клиентов (anti-fraud):**

<table>
<thead><tr>
<th> Порог</th>
<th>Действие</th>
<th>Автоматически? </th>
</tr></thead>
<tbody>
<tr>
<td> 3 disputes за 30 дней</td>
<td>Временная блокировка (7 дней)</td>
<td>✅ Да </td>
</tr>
<tr>
<td> 5 disputes за 90 дней</td>
<td>Перманентная блокировка</td>
<td>✅ Да + ручной review </td>
</tr>
<tr>
<td> Повторные chargeback > 2</td>
<td>Блокировка новой регистрации с тем же phone/IP</td>
<td>✅ Да </td>
</tr>
<tr>
<td> Pattern: множество мелких заказов с dispute</td>
<td>Блокировка + передача в security</td>
<td>⚠️ Требуется подтверждение </td>
</tr>
</tbody>
</table>

**SLA:**

<table>
<thead><tr>
<th> Этап</th>
<th>SLA</th>
<th>Ответственный </th>
</tr></thead>
<tbody>
<tr>
<td> Авто-решение (достаточно данных)</td>
<td>Мгновенно</td>
<td>Система </td>
</tr>
<tr>
<td> Ручной разбор (стандартный)</td>
<td>< 24 часа</td>
<td>Support-менеджер </td>
</tr>
<tr>
<td> Ручной разбор (финансовый спор)</td>
<td>< 4 часа</td>
<td>Финансовый менеджер </td>
</tr>
<tr>
<td> Ответ на chargeback от банка</td>
<td>< 72 часа</td>
<td>Финансовый + Legal </td>
</tr>
<tr>
<td> Refund после решения</td>
<td>< 2 часа</td>
<td>Payment Service </td>
</tr>
</tbody>
</table>

**Финансовые последствия:**

- Chargeback fee от банка: 500–1500 руб за один chargeback
- Fee распределяется по таблице ответственности:
  - Если вина агрегатора — fee за счёт агрегатора
  - Если вина магазина — fee выставляется магазину
  - Если фрод клиента — fee за счёт клиента (блокировка + взыскание через коллектор при сумме > 5000 руб)

> **Согласование:** BP-15 связан с BP-07 (возврат и отмена), §6.3 Legal Requirements (ЗоЗПП, 152-ФЗ), и §4.9 Customer Support Workflow. Процесс chargeback требует интеграции с банковским API (см. §2.5 Store API Integration Details).

---

**User Story:**
Как администратор/менеджер,
Я хочу управлять заказами, товарами, пользователями и просматривать аналитику из единой панели,
Чтобы эффективно управлять платформой.

**Acceptance Criteria:**
Дано: Я вхожу в панель администратора с учётными данными админа
Когда: Я перехожу в раздел Заказы
Тогда: Я вижу список всех заказов с фильтрами по статусу, дате и клиенту
И Я могу просматривать детали заказа, изменять статус и добавлять комментарии

Дано: Мне нужно добавить новый товар
Когда: Я заполняю форму товара с названием, ценой, изображениями и категорией
Тогда: Товар сохраняется и появляется в каталоге клиента в течение 5 минут
И Я могу дополнительно импортировать товары через CSV/Excel

Дано: Я захожу в раздел управления пользователями
Когда: Я ищу пользователя по телефону или имени
Тогда: Я вижу профиль пользователя, историю заказов и статус аккаунта
И Я могу заблокировать/разблокировать пользователя или изменить его роль

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Менеджер заходит в админку

**Бизнес-шаги:**

- **Управление заказами:** список, фильтры, просмотр, изменение статуса, комментирование
- **Управление товарами:** CRUD, импорт/экспорт (CSV/Excel), управление ценами
- **Управление пользователями:** список, блокировка, смена роли
- **Управление промокодами:** создание, статистика использований
- **Управление курьерами:** назначение зон, просмотр рейтинга
- **Аналитика:** дашборды (выручка, заказы, конверсия)

**Данные процесса:**

- `orders`, `products`, `users`, `promo_codes`, `couriers` — полный CRUD

**UI / Интерфейсы:**

- Веб-админка с разделением на модули (заказы, товары, пользователи, промокоды, курьеры, аналитика)
- Таблицы с фильтрами, поиском, пагинацией
- Формы создания/редактирования
- Дашборды с графиками

**Бизнес-правила:**

- Доступ только для пользователей с ролью admin/manager
- Аудит действий (лог изменений)

**Технические заметки:**

- Импорт/экспорт товаров через CSV/Excel
- Разграничение прав доступа (admin vs manager)
- Логирование всех действий

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>15 </td>
</tr>
<tr>
<td> Frontend</td>
<td>20 </td>
</tr>
<tr>
<td> QA</td>
<td>5 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**40** </td>
</tr>
</tbody>
</table>

---

#### BP-12: Аналитика и дашборды (15 чел.-дней)

**User Story:**
Как бизнес-аналитик,
Я хочу просматривать ключевые метрики и тренды на дашборде,
Чтобы принимать бизнес-решения на основе данных.

**Acceptance Criteria:**
Дано: Я открываю дашборд аналитики
Когда: Я выбираю диапазон дат
Тогда: Я вижу DAU/MAU, выручку, средний чек и воронку конверсии
И Все графики загружаются в течение 3 секунд

Дано: Я хочу проанализировать эффективность доставки
Когда: Я просматриваю операционный дашборд
Тогда: Я вижу среднее время сборки, среднее время доставки и загрузку курьеров
И Я могу детализировать по магазину или периоду времени

Дано: Нет данных за выбранный период
Когда: Дашборд загружается
Тогда: Я вижу сообщение «Нет данных за этот период»
И Пустые графики с подсказкой изменить фильтр

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Запрос аналитика / руководителя

**Бизнес-шаги:**

1. **Выбор периода** — Пользователь выбирает период (день/неделя/месяц)
2. **Загрузка метрик** — Система агрегирует данные по заказам, пользователям, выручке
3. **Отображение дашборда** — Система показывает ключевые метрики и графики

**Метрики:**

- DAU/MAU, конверсия шагов воронки
- Выручка (день/неделя/месяц), средний чек
- Топ товаров, топ категорий
- Количество заказов по статусам
- Среднее время сборки, среднее время доставки

**UI / Интерфейсы:**

- Дашборды с графиками и таблицами
- Фильтры по дате, магазину, категории

**Технические заметки:**

- Агрегация данных для отчётов
- Кэширование результатов для быстрой загрузки

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>8 </td>
</tr>
<tr>
<td> Frontend</td>
<td>5 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**15** </td>
</tr>
</tbody>
</table>

---

### 4.5 B2B Domain (Корпоративные заказы)

**Источник:** Раздел 2.2 исходного документа.

#### BP-13: B2B — Корпоративные заказы (27 чел.-дней)

**User Story:**
Как B2B-клиент,
Я хочу размещать оптовые заказы с корпоративными ценами и отсрочкой платежа,
Чтобы эффективно пополнять запасы офиса.

**Acceptance Criteria:**
Дано: Я зарегистрирован как юридическое лицо
Когда: Я вхожу в B2B-портал
Тогда: Я вижу персонализированные цены для моей компании
И Я могу создать заказ с более высокой минимальной суммой, чем B2C

Дано: Я размещаю B2B-заказ
Когда: Заказ отправлен
Тогда: Назначенный менеджер проверяет и подтверждает его
И Я получаю счёт на оплату с отсрочкой платежа

Дано: У моей компании подписан договор
Когда: Мне нужны закрывающие документы
Тогда: Система генерирует УПД через ЭДО (Диадок/СБИС)
И Документы отправляются электронно

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Представитель юрлица оформляет заказ для офиса

**Отличия от B2C:**

<table>
<thead><tr>
<th> Аспект</th>
<th>B2C</th>
<th>B2B </th>
</tr></thead>
<tbody>
<tr>
<td> Заказчик</td>
<td>Физлицо</td>
<td>Юрлицо (компания) </td>
</tr>
<tr>
<td> Оплата</td>
<td>Онлайн / при получении</td>
<td>Безналичный расчёт, счёт, отсрочка платежа </td>
</tr>
<tr>
<td> Документы</td>
<td>Электронный чек (54-ФЗ)</td>
<td>Счёт, акт, накладная, УПД (через ЭДО) </td>
</tr>
<tr>
<td> Доставка</td>
<td>Квартира / дом</td>
<td>Офис, ресепшн, склад </td>
</tr>
<tr>
<td> Объём</td>
<td>1–80 кг</td>
<td>До паллеты / несколько заказов одновременно </td>
</tr>
<tr>
<td> Повторение</td>
<td>Разовые</td>
<td>Регулярные (ежедневно / еженедельно) </td>
</tr>
<tr>
<td> Персонализация</td>
<td>Нет</td>
<td>Свой ассортимент, согласованные цены </td>
</tr>
</tbody>
</table>

**Бизнес-шаги:**

1. **Регистрация юрлица** — Менеджер заполняет карточку: название, ИНН, КПП, юр./факт. адрес (договор оферты, подписание через ЭДО)
2. **Назначение персональных цен** — Менеджер согласовывает цены на определённые товары (фиксированные цены на 3–6 месяцев)
3. **Создание заказа** — Представитель выбирает товары из каталога (возможно, свой ассортимент) (минимальная сумма выше, чем в B2C)
4. **Подтверждение** — Менеджер проверяет заказ и подтверждает сборку
5. **Доставка** — Курьер доставляет в офис, получает подпись ответственного лица (акт приёма-передачи)
6. **Оплата** — Бухгалтерия выставляет счёт, оплата по безналу (3–30 дней) (отсрочка после утверждения кредитного лимита)
7. **Закрытие** — Менеджер оформляет УПД через ЭДО (Диадок / СБИС) (электронная подпись)

**Данные процесса:**

- `b2b_companies`: id, name, inn, kpp, legal_address, actual_address, credit_limit, payment_deferral_days, contract_number, contract_date, edo_provider (diadoc/sbis)
- `b2b_prices`: id, company_id, product_id, price, valid_from, valid_until
- `b2b_orders`: id, order_id, company_id, po_number (номер заказа компании), delivery_note

**UI / Интерфейсы:**

- **Личный кабинет юрлица:** свой каталог с ценами, история заказов, счета, закрывающие документы
- **Менеджер в админке:** управление компаниями, договорами, ценами, подтверждение заказов

**Интеграции:**

- **ЭДО (Диадок / СБИС)** — УПД, счета, акты
- **Бухгалтерия (1С)** — выгрузка счетов, актов сверки

**Бизнес-правила:**

- Только для юрлиц с подписанным договором оферты
- Персональные цены фиксируются на 3–6 месяцев
- Минимальная сумма заказа выше, чем в B2C
- Отсрочка платежа после утверждения кредитного лимита
- Закрывающие документы через ЭДО

**Технические заметки:**

- Интеграция с ЭДО (Диадок / СБИС) для обмена документами
- Интеграция с 1С для бухгалтерского учёта
- Разграничение каталога и цен для каждого юрлица

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>15 </td>
</tr>
<tr>
<td> Frontend</td>
<td>8 </td>
</tr>
<tr>
<td> QA</td>
<td>4 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**27** </td>
</tr>
</tbody>
</table>

---

### 4.6 Cross-Cutting Domains (Сквозные)

**Источник:** Раздел 2.2 исходного документа.

#### BP-09: Уведомления (Push / SMS / Email) (9 чел.-дней)

**User Story:**
Как клиент,
Я хочу получать уведомления о статусе заказа,
Чтобы оставаться в курсе без постоянной проверки приложения.

**Acceptance Criteria:**
Дано: Происходит событие заказа (создан, оплачен, собран, доставлен)
Когда: У меня включены push-уведомления
Тогда: Я получаю push-уведомление с соответствующим обновлением статуса
И Сообщение содержит номер заказа и текущий статус

Дано: Доставка назначена и курьер в пути
Когда: Система отправляет уведомление
Тогда: Я получаю SMS с ETA курьера
И Push-уведомление с той же информацией

Дано: Я не хочу получать рекламные уведомления
Когда: Я отключаю рекламные уведомления в настройках
Тогда: Я перестаю получать рекламные push-сообщения
Но всё ещё получаю уведомления, связанные с заказом

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Событие в системе (заказ создан, оплачен, доставлен)

**События и каналы:**

<table>
<thead><tr>
<th> Событие</th>
<th>Каналы</th>
<th>Шаблон </th>
</tr></thead>
<tbody>
<tr>
<td> `order.created`</td>
<td>Push, Email</td>
<td>«Заказ №{id} принят, начали сборку» </td>
</tr>
<tr>
<td> `order.picker_started`</td>
<td>Push</td>
<td>«Пикер начал собирать заказ» </td>
</tr>
<tr>
<td> `order.substitution`</td>
<td>Звонок пикера</td>
<td>Пикер звонит, если товара нет в наличии </td>
</tr>
<tr>
<td> `payment.succeeded`</td>
<td>Push</td>
<td>«Заказ №{id} оплачен» </td>
</tr>
<tr>
<td> `delivery.assigned`</td>
<td>Push, SMS</td>
<td>«Курьер выехал, ETA {time}» </td>
</tr>
<tr>
<td> `delivery.delivered`</td>
<td>Push, Email</td>
<td>«Заказ №{id} доставлен. Спасибо!» </td>
</tr>
<tr>
<td> `promo.received`</td>
<td>Push</td>
<td>«Вам начислен промокод {code}» </td>
</tr>
<tr>
<td> `order.reminder`</td>
<td>Push</td>
<td>«Не забудьте подтвердить заказ на завтра» </td>
</tr>
</tbody>
</table>

**Бизнес-правила:**

- Push-уведомления для мобильных клиентов
- Email для юридически значимых событий (чек, отмена)
- SMS для критичных уведомлений (курьер выехал)
- Звонок пикера — только при отсутствии товара (замена)

**Технические заметки:**

- Push через Firebase Cloud Messaging (FCM)
- Email через SMTP-провайдер
- SMS через SMS-провайдер
- Шаблонизация сообщений

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend</td>
<td>5 </td>
</tr>
<tr>
<td> Mobile (push)</td>
<td>2 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**9** </td>
</tr>
</tbody>
</table>

---

#### BP-14: Dynamic Pricing (динамическое ценообразование) (15 чел.-дней)

**User Story:**
Как менеджер по ценообразованию,
Я хочу настраивать правила динамического ценообразования на основе спроса, погоды и других факторов,
Чтобы стоимость доставки оптимизировала выручку и загрузку курьеров.

**Acceptance Criteria:**
Дано: Клиент просматривает оформление заказа
Когда: Система рассчитывает стоимость доставки
Тогда: Стоимость включает динамические множители на основе текущих условий (время, погода, загрузка курьеров)
И Итоговая цена отображается перед подтверждением заказа

Дано: Погода суровая (снег, дождь, мороз ниже -15°C)
Когда: Запускается механизм динамического ценообразования
Тогда: Стоимость доставки умножается на погодный коэффициент (до 1.5x)
Но Никогда не превышает 2x от базовой цены

Дано: Государственный праздник с высоким спросом
Когда: Клиент оформляет заказ
Тогда: Праздничный множитель (до 1.8x) применяется к стоимости доставки
И Клиент видит причину наценки

**Ссылки:**
→ State Machine: [§2.10 State Machine Diagrams](#210-state-machine-diagrams)
→ Sequence Diagram: [§2.11 Sequence Diagrams](#211-sequence-diagrams)
→ API endpoint: [§2.7 API Versioning & Error Code Standard](#27-api-versioning--error-code-standard)

**Триггер:** Изменение внешних факторов (пиковые часы, погода, праздники, загрузка курьеров)

**Факторы влияния на цену:**

<table>
<thead><tr>
<th> Фактор</th>
<th>Источник данных</th>
<th>Влияние </th>
</tr></thead>
<tbody>
<tr>
<td> Загрузка курьеров</td>
<td>Dispatch service (свободные / все курьеры)</td>
<td>Чем меньше свободных — тем выше цена доставки </td>
</tr>
<tr>
<td> Время суток</td>
<td>Системное время</td>
<td>Пик 17:00–20:00 (вечерний час пик) — надбавка </td>
</tr>
<tr>
<td> День недели</td>
<td>Календарь</td>
<td>Пятница, суббота — надбавка; будни — базовая цена </td>
</tr>
<tr>
<td> Погода</td>
<td>OpenWeather API</td>
<td>Дождь, снег, мороз (< -15°C) — надбавка 20–50% </td>
</tr>
<tr>
<td> Праздники</td>
<td>Календарь праздников</td>
<td>Новый год, 8 марта, 14 февраля — надбавка </td>
</tr>
<tr>
<td> Расстояние</td>
<td>OSRM (до магазина → до клиента)</td>
<td>Чем дальше — тем дороже доставка </td>
</tr>
<tr>
<td> Вес заказа</td>
<td>Order service</td>
<td>> 50 кг — надбавка за логистику </td>
</tr>
<tr>
<td> История клиента</td>
<td>Analytics</td>
<td>Лояльные клиенты (10+ заказов) — скидка </td>
</tr>
</tbody>
</table>

**Математическая модель:**
```
base_delivery_fee = zone.base_fee
multipliers = [
  courier_availability_factor,    # 0.8–2.0
  time_factor,                     # 1.0 (день) / 1.3 (пик)
  weather_factor,                  # 1.0 (ясно) / 1.5 (снегопад)
  holiday_factor,                  # 1.0 (будни) / 1.8 (Новый год)
  distance_factor,                 # 1.0 (3 км) / 1.5 (10 км)
  weight_factor                    # 1.0 (< 30 кг) / 1.3 (> 50 кг)
]
final_fee = base_delivery_fee * product(multipliers)
```

**Бизнес-правила:**

- Dynamic Pricing влияет **только на стоимость сборки и доставки**, не на цены товаров в каталоге. Цены товаров фиксированы ритейлером и не могут быть изменены платформой без согласования.
- Максимальная надбавка к стоимости доставки — 2× от базового тарифа доставки (не от цены товаров)
- Клиент видит финальную стоимость доставки до оформления (в корзине)
- Клиент может отложить заказ на час — цена может измениться в обе стороны
- Если не уверены — выпускать как MVP с фиксированной ценой доставки, добавить в V2/V3

**Технические заметки:**

- ML-модель для расчёта мультипликаторов
- Интеграция с OpenWeather API для данных о погоде
- Интеграция с OSRM для расчёта расстояния
- Интеграция с Dispatch service для загрузки курьеров

**Оценка:**

<table>
<thead><tr>
<th> Команда</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Backend (ML модель + API)</td>
<td>10 </td>
</tr>
<tr>
<td> Frontend (отображение динамической цены)</td>
<td>3 </td>
</tr>
<tr>
<td> QA</td>
<td>2 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**15** </td>
</tr>
</tbody>
</table>

### 4.7 Feature Map (Карта функциональных требований)

![Feature Map](exports/diagrams/feature-map.png)

- **Регистрация и безопасность**
  - Вход по телефону
  - SMS-подтверждение
  - Роли: клиент/пикер/курьер/админ/суперадмин
  - JWT access + refresh токены
  - Rate limiting
  - Audit log
- **Каталог**
  - Выбор магазина по адресу
  - Категории (3 уровня)
  - Поиск (Elasticsearch)
  - Динамические фильтры (по категории)
  - Карточка товара
  - Нормализация данных сетей
  - Маппинг категорий сети → платформа
  - Адаптеры сетей (Лента, METRO, Вкусвилл и др.)
  - Синхронизация цен/остатков (шедулер)
- **Корзина**
  - Добавление товаров
  - Промокоды и баллы
  - Dynamic Pricing (надбавка за время/погоду/загрузку)
  - Пересчёт стоимости
  - Оформление
- **Заказы**
  - Создание
  - Статусы (оплачен → сборка → доставка → завершён)
  - Добавление товаров после оформления
  - История
  - Замена товара (пикер → звонок → альтернатива)
  - Возврат и отмена (до/после сборки, комиссия)
  - Event Sourcing (цепочка событий заказа)
- **Доставка**
  - Временные слоты (3 дня вперёд)
  - Dispatch (multi-objective optimization): Cheapest Insertion + 2-opt, 6 целей, Constraint satisfaction
  - ETA (OSRM + ML гибрид): OSRM маршрут → XGBoost коррекция, 13 признаков, пересчёт каждые 5 мин
  - Трекинг для клиента
  - Опция «Можно раньше»
- **Платежи**
  - Т-Банк (онлайн, 3DSecure), СБП (QR от курьера), Карта курьеру (POS-терминал), Наличные
  - Refund (полный/частичный)
  - Чек (54-ФЗ, ОФД)
- **Уведомления**
  - Push (FCM), SMS, Email, Telegram
  - События: заказ создан, сборка начата, курьер выехал, доставлен
- **Админка**
  - Управление заказами, товарами, пользователями, промокодами, курьерами/пикерами, магазинами/зонами
  - Управление сетями-адаптерами (вкл/выкл)
  - Audit log
- **B2B**
  - Корпоративные заказы в офис, регулярные поставки
  - Индивидуальные цены по договору, отсрочка платежа (3–30 дней)
  - ЭДО (Диадок / СБИС, УПД), счета и закрывающие документы
- **Dynamic Pricing**
  - Факторы: загрузка курьеров, время, погода, расстояние, вес
  - Формула: base_fee × product(multipliers), Max надбавка: 2×
  - Отображение в корзине до подтверждения
- **Приложение пикера**
  - Список заказов (FIFO), сканер штрихкодов (Scandit)
  - Замены товаров, звонок клиенту (скрытый номер)
  - Offline-режим (Firestore cache), Smart Sync Queue (batch upload)
  - Подтверждение упаковки
- **Приложение курьера**
  - Навигация с multi-stop маршрутом, Offline-режим (Hive + Smart Sync)
  - Off-route detection, приём оплаты (офлайн hold → sync)
  - Digital Signature (POD), Photo POD, сканер, статусы доставки
- **Инфраструктура**
  - CI/CD (GitHub Actions, testcontainers), Docker Compose → Kubernetes
  - Мониторинг (Prometheus + Grafana + Loki + Jaeger), Sentry
  - Feature flags (Flipper / LaunchDarkly), Rollback (git revert + rolling update)
- **Тестирование**
  - Unit (mockery + testify), Integration (testcontainers), Contract (Pact CDC)
  - E2E (Cypress + K6), Load (K6: stress, soak, spike), Security (SonarCloud + Trivy + Aikido)
- **Аналитика**
  - Дашборды (Grafana), Отчёты (выручка, заказы, конверсия)
  - Метрики (DAU/MAU, время сборки, ETA, топ товаров)

---

### 4.8 Cross-Cutting: Offline Strategy

Система должна работать в условиях нестабильного соединения — ключевое требование для пикеров (подвалы магазинов) и курьеров (тоннели, отдалённые районы).

<table>
<thead><tr>
<th> Сценарий</th>
<th>Компонент</th>
<th>Стратегия </th>
</tr></thead>
<tbody>
<tr>
<td> **Пикер: нет интернета в магазине**</td>
<td>Picker App (Flutter + Firestore)</td>
<td>Firestore offline persistence — последний загруженный заказ на экране, сканер работает локально, отметки в local queue. При восстановлении — batch sync с сервером, разрешение конфликтов по `updated_at` </td>
</tr>
<tr>
<td> **Курьер: нет связи в пути**</td>
<td>Courier App (Flutter + Hive)</td>
<td>Hive — локальное хранилище маршрута, статусов, фото. Smart Sync Queue — batch upload при появлении сети. Off-route detection работает на локальных данных </td>
</tr>
<tr>
<td> **Сервер: потеря связи с магазином**</td>
<td>Catalog Sync Service</td>
<td>Последние известные цены/остатки остаются в кэше (Redis). Шедулер повторяет запрос с exponential backoff (30s → 5min → 15min → 1h) </td>
</tr>
<tr>
<td> **Клиент: обрыв при оплате**</td>
<td>Payment Service</td>
<td>Идемпотентность платежей (idempotency_key). При обрыве — проверка статуса через GET /payments/{id}. Hold на карте снимается через 24ч если не подтверждён </td>
</tr>
<tr>
<td> **Клиент: прерванное оформление заказа**</td>
<td>Cart Service</td>
<td>Корзина живёт в Redis с TTL 24ч. При reconnect — восстановление корзины по session_id </td>
</tr>
<tr>
<td> **Отправка уведомлений**</td>
<td>Notification Service</td>
<td>Dead letter queue для недоставленных push/SMS. Retry 3 раза с интервалом. После 3-х неудач — fallback на SMS </td>
</tr>
</tbody>
</table>

### 4.9 Customer Support Workflow

<table>
<thead><tr>
<th> Аспект</th>
<th>Описание </th>
</tr></thead>
<tbody>
<tr>
<td> **Каналы связи**</td>
<td>Чат в приложении, Telegram-бот (MVP), телефон (через API телефонии) </td>
</tr>
<tr>
<td> **Типовые обращения**</td>
<td>Замена товара не согласована, задержка доставки, неверная позиция, возврат средств, проблема с промокодом </td>
</tr>
<tr>
<td> **Инструмент поддержки**</td>
<td>Админ-панель (BP-11): просмотр заказа, история событий, отправка сообщения клиенту, ручное изменение статуса, оформление возврата </td>
</tr>
<tr>
<td> **SLA ответа**</td>
<td>Первый ответ: < 15 мин (часы работы 9:00–22:00). Критичные (ошибка оплаты): < 5 мин </td>
</tr>
<tr>
<td> **Эскалация**</td>
<td>1-я линия: чат/Telegram → бот отвечает автоматически по FAQ. 2-я линия: менеджер в админке. 3-я линия: технический специалист (DEV) </td>
</tr>
<tr>
<td> **Интеграции**</td>
<td>Email/SMS для offline-клиентов. Telegram Bot API. API телефонии для звонков (через скрытый номер) </td>
</tr>
</tbody>
</table>

---

## 5. Infrastructure & DevOps (Инфраструктура)

### 5.1 Environments (Окружения)
**Источник:** Раздел 5.10.1 исходного документа.

<table>
<thead><tr>
<th> Окружение</th>
<th>Цель</th>
<th>Развёртывание</th>
<th>База данных</th>
<th>Доступ </th>
</tr></thead>
<tbody>
<tr>
<td> **dev**</td>
<td>Разработка, feature-ветки</td>
<td>Docker Compose на машине разработчика</td>
<td>PostgreSQL + Redis (локальные)</td>
<td>Разработчики </td>
</tr>
<tr>
<td> **staging**</td>
<td>Интеграционное тестирование</td>
<td>GitHub Actions → Docker Compose на Selectel VM</td>
<td>PostgreSQL + Redis + ES (shared staging)</td>
<td>Команда + QA </td>
</tr>
<tr>
<td> **prod**</td>
<td>Продуктив</td>
<td>GitHub Actions → Docker Compose / K8s</td>
<td>PostgreSQL (RDS/Self-hosted) + Redis Cluster + ES</td>
<td>Продуктив </td>
</tr>
</tbody>
</table>

### 5.2 CI/CD Pipeline
**Источник:** Раздел 5.10.2 исходного документа.

![Рис. 17: CI/CD Pipeline — PR → проверки → сборка → registry → staging → E2E → approval → prod](exports/diagrams/diagram-17.png)

**Ключевые правила:**

- Ветка `main` всегда зелёная — все проверки обязательны
- Feature-флаги для включения/выключения фич без деплоя
- Rollback: `git revert` + деплой предыдущего Docker-образа
- Production deploy — только с manual approval
- Миграции БД — через `strong_migrations` (Rails) или `golang-migrate`, обратно-совместимые

### 5.3 Deployment & Release Strategy
**Источник:** Раздел 5.15 исходного документа.

**Цикл релиза:**
<table>
<thead><tr>
<th> Этап</th>
<th>Длительность</th>
<th>Подробности </th>
</tr></thead>
<tbody>
<tr>
<td> **Feature development**</td>
<td>1–2 недели</td>
<td>Feature branch → PR → code review → тесты </td>
</tr>
<tr>
<td> **Staging validation**</td>
<td>1–2 дня</td>
<td>QA-тестирование на staging, авто-тесты </td>
</tr>
<tr>
<td> **Release candidate**</td>
<td>—</td>
<td>Создание тега `v{major}.{minor}.{patch}` </td>
</tr>
<tr>
<td> **Production deploy**</td>
<td>rolling update</td>
<td>Без downtime, по одному сервису </td>
</tr>
<tr>
<td> **Post-deploy monitoring**</td>
<td>1 час</td>
<td>Наблюдение за ошибками (Sentry) + метриками (Grafana) </td>
</tr>
<tr>
<td> **Hotfix**</td>
<td>< 1 часа</td>
<td>Ветка от `main` → тесты → деплой </td>
</tr>
</tbody>
</table>

**Feature flags:**

- Использовать `Flipper` (Rails) / `LaunchDarkly` для включения/выключения фич без деплоя
- Пример: `feature_b2b_orders` — включает B2B-интерфейс в админке
- Флаг живёт не дольше 2 спринтов → удаляется после стабилизации

**Rollback:**

1. `git revert <sha>` на `main`
2. CI билдит предыдущий образ
3. Rolling update сервиса
4. Проверка метрик (Grafana + Sentry)
5. Уведомление команды

**Деплой мобильных приложений:**
<table>
<thead><tr>
<th> Платформа</th>
<th>Staging</th>
<th>Production </th>
</tr></thead>
<tbody>
<tr>
<td> **iOS**</td>
<td>TestFlight (внутреннее тестирование)</td>
<td>App Store Review (1–3 дня) </td>
</tr>
<tr>
<td> **Android**</td>
<td>Internal Testing Track (Google Play)</td>
<td>Production Track </td>
</tr>
<tr>
<td> **Huawei AppGallery**</td>
<td>—</td>
<td>Ручная выгрузка `.apk` </td>
</tr>
<tr>
<td> **RuStore**</td>
<td>—</td>
<td>Ручная выгрузка </td>
</tr>
</tbody>
</table>

### 5.4 Monitoring & Alerting
**Источник:** Раздел 5.7.5 исходного документа.

- Prometheus + Grafana (метрики, дашборды)
- Loki + Promtail (логи)
- Jaeger (tracing, критичные сценарии)
- Sentry (error tracking, алерт на каждый новый error type)
- Uptime Kuma (healthcheck)

### 5.5 Performance & SLAs
**Источник:** Раздел 5.11 исходного документа.

<table>
<thead><tr>
<th> Метрика</th>
<th>Цель (SLO)</th>
<th>Измерение </th>
</tr></thead>
<tbody>
<tr>
<td> **Время ответа API каталога**</td>
<td>p95 < 500ms</td>
<td>Prometheus + Grafana </td>
</tr>
<tr>
<td> **Время ответа API заказа**</td>
<td>p95 < 200ms</td>
<td>Prometheus </td>
</tr>
<tr>
<td> **Доступность (Uptime)**</td>
<td>99.9% (исключая плановые окна)</td>
<td>Uptime Kuma / Grafana </td>
</tr>
<tr>
<td> **Количество заказов/день**</td>
<td>MVP: 100; V2: 1000; V3: 10000</td>
<td>Business metrics </td>
</tr>
<tr>
<td> **Время сборки заказа**</td>
<td>< 30 мин (среднее)</td>
<td>Picker app → Backend </td>
</tr>
<tr>
<td> **Время доставки**</td>
<td>< 60 мин (город)</td>
<td>Courier app → Backend </td>
</tr>
<tr>
<td> **Допустимый downtime**</td>
<td>< 1 час / месяц</td>
<td>PagerDuty / Oncall </td>
</tr>
<tr>
<td> **RPS (каталог)**</td>
<td>MVP: 50; V2: 500; V3: 5000</td>
<td>K6 + Prometheus </td>
</tr>
<tr>
<td> **RPS (оформление)**</td>
<td>MVP: 5; V2: 50; V3: 500</td>
<td>K6 </td>
</tr>
</tbody>
</table>

**Бюджет ошибок (Error Budget):** 99.9% uptime = 43 мин/месяц downtime. Если бюджет исчерпан — новые деплои блокируются до выяснения причины.

### 5.6 Incident Response

<table>
<thead><tr>
<th> Severity</th>
<th>Определение</th>
<th>Реакция</th>
<th>Время реакции </th>
</tr></thead>
<tbody>
<tr>
<td> **P0 (Critical)**</td>
<td>Система не работает: платёжный шлюз недоступен, каталог не грузится, все заказы встали</td>
<td>Немедленный созвон команды. Rollback последнего деплоя. Информирование в Slack #incident</td>
<td>< 5 мин </td>
</tr>
<tr>
<td> **P1 (Major)**</td>
<td>Серьёзная деградация: медленный каталог, ошибки оплаты у 10%+ пользователей</td>
<td>Дежурный подключается. Фикс в течение часа. Hotfix через CI</td>
<td>< 15 мин </td>
</tr>
<tr>
<td> **P2 (Minor)**</td>
<td>Частичная деградация: не грузятся фото, медленный поиск</td>
<td>Фикс в рамках текущего или следующего спринта</td>
<td>< 4 ч </td>
</tr>
<tr>
<td> **P3 (Cosmetic)**</td>
<td>Косметические баги: кривой шрифт, опечатка</td>
<td>В бэклог, приоритет ниже фич</td>
<td>Следующий спринт </td>
</tr>
</tbody>
</table>

**Инструменты:** Sentry (алерт на каждый новый error type), Uptime Kuma (healthcheck), Grafana (SLO violation alert)

### 5.7 Backup & Disaster Recovery

<table>
<thead><tr>
<th> Параметр</th>
<th>Значение </th>
</tr></thead>
<tbody>
<tr>
<td> **RPO (потери данных)**</td>
<td>≤ 1 час (PgBouncer + WAL streaming) </td>
</tr>
<tr>
<td> **RTO (восстановление)**</td>
<td>≤ 4 часа (из бэкапа на новый сервер) </td>
</tr>
<tr>
<td> **Частота бэкапов**</td>
<td>Полный: ежедневно в 03:00. WAL: каждые 15 мин. Логи: ежедневно </td>
</tr>
<tr>
<td> **Хранение**</td>
<td>Полные: 30 дней. WAL: 7 дней. Снимки перед релизом: 90 дней </td>
</tr>
<tr>
<td> **Шифрование бэкапов**</td>
<td>AES-256 (GPG), ключи в GitHub Secrets </td>
</tr>
<tr>
<td> **Restore-тест**</td>
<td>Автоматический restore на staging каждую неделю (GitHub Actions) </td>
</tr>
<tr>
<td> **DR-план**</td>
<td>Selectel → резервный регион. DNS-переключение через Cloudflare. Восстановление: Terraform apply → restore DB → verify healthcheck </td>
</tr>
<tr>
<td> **Критические данные**</td>
<td>Таблицы заказов (`orders`, `payments`, `deliveries`), пользователи (`users`), конфигурация адаптеров (`chains`) </td>
</tr>
</tbody>
</table>

### 5.8 FinOps (Оптимизация расходов на облако)

Подробнее — в [finops.md](finops.md).

### 5.9 Service Readiness Checklist

Перед запуском каждого нового сервиса в production:

- [ ] Healthcheck endpoint (`/health` + `/ready`)
- [ ] Prometheus metrics (`/metrics`)
- [ ] Sentry SDK (error tracking)
- [ ] Structured logging (JSON, correlation_id)
- [ ] Graceful shutdown (SIGTERM → drain connections → exit)
- [ ] Rate limiting (100 req/s per instance)
- [ ] Resource limits (CPU/memory requests + limits)
- [ ] Readiness/liveness probes (K8s) или healthcheck (Docker Compose)
- [ ] Backup: WAL archiving + PgBouncer
- [ ] Runbook: как деплоить, как откатывать, как диагностировать
- [ ] On-call: кто дежурный, куда слать алерт
- [ ] Тесты: unit + integration + contract
- [ ] API documentation (Swagger/OpenAPI для REST endpoints)

### 5.10 Vendor Lock-in & Exit Strategy

Матрица зависимостей от внешних провайдеров, уровень lock-in и план выхода для каждого критического сервиса. Согласовано с §2.2 Technology Stack, §1.4 External Integrations и §5.7 Backup & DR.

**Матрица зависимостей:**

<table>
<thead><tr>
<th> Сервис / Провайдер</th>
<th>Тип</th>
<th>Риск lock-in</th>
<th>Альтернатива</th>
<th>Время миграции</th>
<th>Сложность </th>
</tr></thead>
<tbody>
<tr>
<td> **Selectel Cloud**</td>
<td>IaaS (VM, S3, DB)</td>
<td>Средний — открытые форматы (KVM, S3 API), но нет автоматического экспорта оркестрации</td>
<td>Yandex Cloud, VK Cloud</td>
<td>2–4 недели</td>
<td>Средняя </td>
</tr>
<tr>
<td> **Т-Банк API**</td>
<td>Платёжный шлюз</td>
<td>Высокий — собственная SDK, 54-ФЗ касса</td>
<td>СБП (Сбер, ВТБ), ЮKassa, Yandex Pay</td>
<td>4–8 недель</td>
<td>Высокая </td>
</tr>
<tr>
<td> **RabbitMQ**</td>
<td>Message broker</td>
<td>Средний — AMQP 0-9-1, но Kafka/Pulsar требуют переписывания consumers</td>
<td>Apache Kafka, Apache Pulsar, NATS</td>
<td>6–12 недель</td>
<td>Высокая </td>
</tr>
<tr>
<td> **Elasticsearch**</td>
<td>Поиск / аналитика</td>
<td>Средний — Elasticsearch API, есть OpenSearch (форк)</td>
<td>OpenSearch, Meilisearch (V3)</td>
<td>4–8 недель</td>
<td>Средняя </td>
</tr>
<tr>
<td> **Redis**</td>
<td>Кэш / очереди</td>
<td>Низкий — открытый протокол, есть совместимые аналоги (KeyDB, Dragonfly)</td>
<td>KeyDB, Dragonfly, Valkey</td>
<td>1–2 недели</td>
<td>Низкая </td>
</tr>
<tr>
<td> **PostgreSQL**</td>
<td>Основная БД</td>
<td>Низкий — открытый стандарт, любой cloud-PaaS</td>
<td>RDS (AWS, Yandex), TimescaleDB</td>
<td>1–2 недели</td>
<td>Низкая </td>
</tr>
<tr>
<td> **Firebase (FCM, Firestore)**</td>
<td>Push, offline sync</td>
<td>Высокий — проприетарные API</td>
<td>Self-hosted: Appwrite, Supabase, собственный WebSocket gateway</td>
<td>8–16 недель</td>
<td>Высокая </td>
</tr>
<tr>
<td> **Яндекс.Метрика**</td>
<td>Аналитика</td>
<td>Низкий — события дублируются в ClickHouse (V2), можно переключить дашборды</td>
<td>Amplitude, PostHog (self-hosted), ClickHouse + Grafana</td>
<td>2–4 недели</td>
<td>Средняя </td>
</tr>
<tr>
<td> **Sentry**</td>
<td>Error tracking</td>
<td>Низкий — self-hosted версия существует</td>
<td>Self-hosted Sentry, GlitchTip</td>
<td>1–2 недели</td>
<td>Низкая </td>
</tr>
<tr>
<td> **OSRM**</td>
<td>Маршрутизация</td>
<td>Средний — OSM данные + OSRM open-source, но требуется собственный сервер</td>
<td>GraphHopper (self-hosted), Yandex.Maps API</td>
<td>4–6 недель</td>
<td>Средняя </td>
</tr>
<tr>
<td> **Яндекс.Карты / Google Maps**</td>
<td>Геокодер / отображение</td>
<td>Высокий — привязка пользователей к UI</td>
<td>2GIS, OSM + Leaflet (self-hosted tiles)</td>
<td>6–10 недель</td>
<td>Средняя </td>
</tr>
<tr>
<td> **CDN (Selectel / Cloudflare)**</td>
<td>Доставка контента</td>
<td>Низкий — статика, смена CNAME</td>
<td>Любой CDN (Cloudflare, VK CDN, Qiwi CDN)</td>
<td>1–2 дня</td>
<td>Низкая </td>
</tr>
</tbody>
</table>

**План выхода по категориям риска:**

<table>
<thead><tr>
<th> Уровень</th>
<th>Критерий</th>
<th>Действия </th>
</tr></thead>
<tbody>
<tr>
<td> **CRITICAL**</td>
<td>Блокирует приём платежей или работу платформы</td>
<td>Parallel run 4 нед, cut-over за 1 день, откат за 4 часа, validation каждого 10-го заказа </td>
</tr>
<tr>
<td> **HIGH**</td>
<td>Существенно влияет на UX или стоимость</td>
<td>Data export заранее, parallel run 2 нед, A/B тест на 10% трафика </td>
</tr>
<tr>
<td> **MEDIUM**</td>
<td>Можно терпеть 2–4 мес</td>
<td>Плавная миграция без downtime, feature flag </td>
</tr>
<tr>
<td> **LOW**</td>
<td>Замена за 1–2 дня</td>
<td>Простая смена конфига </td>
</tr>
</tbody>
</table>

**Contractual safeguards (рекомендации для договоров):**

- **SLA:** не ниже 99.9%, с компенсацией (5–30% за каждый час простоя)
- **Data export:** право на выгрузку всех данных в открытом формате (JSON, CSV, NDJSON) в любое время
- **Price lock:** фиксация цен на 12–24 мес, уведомление за 90 дней о повышении
- **Exit support:** обязательство провайдера предоставлять доступ к данным 30–90 дней после расторжения
- **Code escrow:** для критических SDK (Т-Банк) — требование передать SDK в escrow или заменить на OpenAPI-спецификацию

### 5.11 Multi-Region & Disaster Recovery

Развитие существующего DR-плана (§5.7 Backup & Disaster Recovery) до multi-region архитектуры. Согласовано с §2.4 Infrastructure & Deployment и §5.7.

**Эволюция по этапам:**

<table>
<thead><tr>
<th> Этап</th>
<th>Модель</th>
<th>PostgreSQL</th>
<th>Redis</th>
<th>RabbitMQ</th>
<th>S3 </th>
</tr></thead>
<tbody>
<tr>
<td> **MVP**</td>
<td>Active-Passive (Selectel MSK + холодный standby в другой зоне)</td>
<td>Асинхронная streaming replication</td>
<td>Replication (master → replica)</td>
<td>—</td>
<td>— </td>
</tr>
<tr>
<td> **V2**</td>
<td>Active-Passive (MSK active + SPB warm standby)</td>
<td>Синхронная streaming replication (synchronous_commit = on)</td>
<td>Sentinel failover</td>
<td>Shovel (однонаправленный)</td>
<td>Cross-region replication (S3 → S3) </td>
</tr>
<tr>
<td> **V3**</td>
<td>Active-Active (MSK + SPB + EKB)</td>
<td>Logical replication (bidirectional, conflict resolution)</td>
<td>Active-Active Redis (CRDT)</td>
<td>Federation (multi-directional)</td>
<td>Cross-region replication (active-active) </td>
</tr>
</tbody>
</table>

**Geo-routing:**

<table>
<thead><tr>
<th> Компонент</th>
<th>MVP</th>
<th>V2</th>
<th>V3 </th>
</tr></thead>
<tbody>
<tr>
<td> **DNS**</td>
<td>Cloudflare — один A-запись, ручное переключение</td>
<td>Cloudflare — geo-weighted, автоматический healthcheck</td>
<td>Cloudflare — Anycast, автоматический failover </td>
</tr>
<tr>
<td> **API Gateway**</td>
<td>Единый endpoint</td>
<td>Единый endpoint + geo-DNS</td>
<td>API Gateway в каждом регионе, global load balancer </td>
</tr>
<tr>
<td> **Статика (CDN)**</td>
<td>Selectel CDN</td>
<td>Selectel + Cloudflare (multi-CDN)</td>
<td>Multi-CDN с автоматическим переключением </td>
</tr>
<tr>
<td> **Пользователь**</td>
<td>Всегда MSK</td>
<td>По геолокации: MSK / SPB</td>
<td>По геолокации + latency: ближайший регион </td>
</tr>
</tbody>
</table>

**Data synchronization:**

<table>
<thead><tr>
<th> Компонент</th>
<th>MVP (Active-Passive)</th>
<th>V2 (Warm Standby)</th>
<th>V3 (Active-Active) </th>
</tr></thead>
<tbody>
<tr>
<td> **PostgreSQL**</td>
<td>Асинхронная streaming replication. RPO < 1 ч, RTO < 4 ч</td>
<td>Синхронная replication (synchronous_commit = remote_write). RPO = 0, RTO < 15 мин</td>
<td>Logical replication с conflict resolution (last-writer-wins + application-level merge). RPO < 1 с </td>
</tr>
<tr>
<td> **Redis**</td>
<td>Master → Replica (keepalive). Потеря кэша при failover</td>
<td>Sentinel: автоматический failover, loss < 1 мин</td>
<td>Active-Active (CRDT-based: Redis Enterprise / KeyDB) </td>
</tr>
<tr>
<td> **RabbitMQ**</td>
<td>— (очереди не реплицируются)</td>
<td>Shovel: однонаправленная пересылка сообщений из MSK → SPB</td>
<td>Federation: все очереди доступны во всех регионах </td>
</tr>
<tr>
<td> **S3 (Selectel)**</td>
<td>—</td>
<td>bucket → bucket (однонаправленно, раз в час)</td>
<td>Cross-region replication (непрерывная, master-master) </td>
</tr>
<tr>
<td> **Elasticsearch**</td>
<td>—</td>
<td>—</td>
<td>Cross-cluster replication (CCR, follower → leader) </td>
</tr>
</tbody>
</table>

**Failover procedure:**

<table>
<thead><tr>
<th> Этап</th>
<th>Действие</th>
<th>Автоматизация</th>
<th>Time budget </th>
</tr></thead>
<tbody>
<tr>
<td> **Detection**</td>
<td>Healthcheck провалился (3/3 попытки, 5s timeout)</td>
<td>Uptime Kuma → PagerDuty → Slack #incident</td>
<td>< 30 с </td>
</tr>
<tr>
<td> **Decision**</td>
<td>Дежурный подтверждает failover (или auto-failover при P0)</td>
<td>Slack approve / auto-trigger</td>
<td>< 2 мин </td>
</tr>
<tr>
<td> **DNS switch**</td>
<td>Cloudflare: CNAME → standby регион (TTL = 60 с)</td>
<td>Terraform / Cloudflare API + GitHub Actions</td>
<td>< 2 мин </td>
</tr>
<tr>
<td> **DB promote**</td>
<td>PostgreSQL: `pg_ctl promote` на standby → новый master</td>
<td>Ansible playbook</td>
<td>< 5 мин </td>
</tr>
<tr>
<td> **App deploy**</td>
<td>Docker Compose → standby region, указать новый DB host</td>
<td>GitHub Actions (reusable workflow)</td>
<td>< 5 мин </td>
</tr>
<tr>
<td> **Validation**</td>
<td>Healthcheck `/health` + `/ready` + synthetic order creation</td>
<td>Automated test suite</td>
<td>< 3 мин </td>
</tr>
<tr>
<td> **Total RTO**</td>
<td>—</td>
<td>—</td>
<td>**< 15 мин (V2+)** </td>
</tr>
</tbody>
</table>

**Regional dependencies:**

<table>
<thead><tr>
<th> Сервис</th>
<th>Обязателен в каждом регионе</th>
<th>Может быть global </th>
</tr></thead>
<tbody>
<tr>
<td> PostgreSQL (shard региона)</td>
<td>✅ Все данные региона</td>
<td>— </td>
</tr>
<tr>
<td> Redis (кэш региона)</td>
<td>✅ Кэш региона</td>
<td>— </td>
</tr>
<tr>
<td> API Gateway</td>
<td>✅ Входная точка</td>
<td>— </td>
</tr>
<tr>
<td> Auth service</td>
<td>✅ JWT верификация</td>
<td>Можно shared (центральный JWKS) </td>
</tr>
<tr>
<td> Catalog service</td>
<td>✅ Данные сетей региона</td>
<td>Метаданные — global </td>
</tr>
<tr>
<td> Order service</td>
<td>✅ Данные региона</td>
<td>— </td>
</tr>
<tr>
<td> Payment service</td>
<td>❌ Централизован</td>
<td>✅ Global (один экземпляр для всех) </td>
</tr>
<tr>
<td> Search (ES)</td>
<td>❌</td>
<td>✅ Global — кросс-региональный поиск </td>
</tr>
<tr>
<td> Admin panel</td>
<td>❌</td>
<td>✅ Global — единая точка управления </td>
</tr>
<tr>
<td> CDN</td>
<td>❌</td>
<td>✅ Global — статика едина </td>
</tr>
<tr>
<td> Queue (RabbitMQ)</td>
<td>❌ До V3</td>
<td>✅ Global (Federation V3) </td>
</tr>
</tbody>
</table>

**Runbook (MVP failover):**

```bash
# 1. Проверить, что standby жив
ssh deploy@standby-selectel "pg_isready -h localhost"

# 2. Promote standby → master
ssh deploy@standby-selectel "pg_ctl promote -D /var/lib/postgresql/data"

# 3. Обновить DNS
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/$RECORD" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "STANDBY_IP", "ttl": 60}'

# 4. Перезапустить приложения в standby-region с новым DB_HOST
gh workflow run deploy.yml -f region=standby -f db_host=localhost

# 5. Проверить healthcheck
curl -f https://api.igoods.ru/health && echo "OK"
```

### 6.1 Authentication & Authorization
**Источник:** Раздел 5.13.1 исходного документа.

<table>
<thead><tr>
<th> Роль</th>
<th>Доступ</th>
<th>Привилегии </th>
</tr></thead>
<tbody>
<tr>
<td> **Клиент**</td>
<td>Web / Mobile</td>
<td>Каталог, корзина, заказы, личный кабинет, промокоды </td>
</tr>
<tr>
<td> **Пикер**</td>
<td>Picker App</td>
<td>Список заказов (только назначенные), сканер, замена товара, отметки сборки </td>
</tr>
<tr>
<td> **Курьер**</td>
<td>Courier App</td>
<td>Назначенные доставки, навигация, приём оплаты, фото, подпись </td>
</tr>
<tr>
<td> **Менеджер (Admin)**</td>
<td>Admin Panel</td>
<td>Заказы (все), товары, пользователи, курьеры, промокоды, аналитика </td>
</tr>
<tr>
<td> **Супер-админ**</td>
<td>Admin Panel (full)</td>
<td>Всё + управление ролями, доступ к логам, audit trail </td>
</tr>
<tr>
<td> **DevOps**</td>
<td>Инфраструктура</td>
<td>Доступ к серверам, CI/CD, мониторинг, БД (read-only) </td>
</tr>
</tbody>
</table>

### 6.2 Data Protection
**Источник:** Раздел 5.13.2 исходного документа.

<table>
<thead><tr>
<th> Область</th>
<th>Политика </th>
</tr></thead>
<tbody>
<tr>
<td> **Аутентификация**</td>
<td>JWT access (15 мин) + refresh (30 дней, rotation); возможность принудительного завершения всех сессий </td>
</tr>
<tr>
<td> **Rate limiting**</td>
<td>100 req/min на пользователя; 1000 req/min на IP (Nginx `limit_req`) </td>
</tr>
<tr>
<td> **Шифрование**</td>
<td>TLS 1.3 для всех внешних соединений; шифрование ПДн в БД (AES-256); пароли — bcrypt </td>
</tr>
<tr>
<td> **Безопасность API**</td>
<td>CSRF-токены (Web); API-ключи для внешних интеграций; CORS — только домены приложения </td>
</tr>
<tr>
<td> **Аудит**</td>
<td>`audit_log` — кто, когда, что сделал с заказом/пользователем/товаром. Хранить 1 год </td>
</tr>
<tr>
<td> **Секреты**</td>
<td>`.env` Vault / GitHub Secrets (не в репозитории); ротация ключей каждые 90 дней </td>
</tr>
<tr>
<td> **Мониторинг безопасности**</td>
<td>Sentry (error tracking) + Aikido (SAST, dependency scan, secret leaks) на каждый PR </td>
</tr>
</tbody>
</table>

### 6.3 Compliance Matrix (Юридические требования)

Матрица соответствия законодательству РФ. Согласовано с BP-07 (возврат), BP-15 (dispute), §6.2 Data Protection, §1.1.3 География (РФ → российские законы), §8.3 Roadmap (MVP/V2/V3).

<table>
<thead><tr>
<th> Требование</th>
<th>Закон</th>
<th>MVP?</th>
<th>Что реализуем</th>
<th>Ответственный</th>
<th>Ссылка в SRS</th>
<th>Статус </th>
</tr></thead>
<tbody>
<tr>
<td> Согласие на обработку ПДн</td>
<td>152-ФЗ</td>
<td>✅ Да</td>
<td>Чекбокс при регистрации + политика конфиденциальности</td>
<td>Backend + Frontend + Legal</td>
<td>BP-01</td>
<td>To Do </td>
</tr>
<tr>
<td> Шифрование ПДн (phone, email)</td>
<td>152-ФЗ</td>
<td>✅ Да</td>
<td>AES-256 для столбцов phone, email</td>
<td>Backend</td>
<td>§3.4</td>
<td>To Do </td>
</tr>
<tr>
<td> Уведомление Роскомнадзора</td>
<td>152-ФЗ</td>
<td>✅ Да</td>
<td>Подача уведомления до запуска</td>
<td>Legal</td>
<td>—</td>
<td>To Do </td>
</tr>
<tr>
<td> Право на удаление данных</td>
<td>152-ФЗ</td>
<td>✅ Да</td>
<td>Кнопка «Удалить аккаунт» в ЛК + background job</td>
<td>Backend + Frontend</td>
<td>BP-10</td>
<td>To Do </td>
</tr>
<tr>
<td> Локализация ПДн на территории РФ</td>
<td>152-ФЗ ст.18</td>
<td>✅ Да</td>
<td>БД на Selectel (Москва/СПБ), резервный регион</td>
<td>DevOps</td>
<td>§5.7</td>
<td>To Do </td>
</tr>
<tr>
<td> Фискальный чек (продажа/возврат)</td>
<td>54-ФЗ</td>
<td>✅ Да</td>
<td>ОФД-интеграция, ФФД 1.2, отправка чека (SMS/Email/QR)</td>
<td>Backend</td>
<td>§2.5</td>
<td>To Do </td>
</tr>
<tr>
<td> Информация о товаре (состав, вес, срок)</td>
<td>ЗоЗПП</td>
<td>✅ Да</td>
<td>Карточка товара с обязательными полями</td>
<td>Backend + Catalog</td>
<td>BP-02</td>
<td>To Do </td>
</tr>
<tr>
<td> Возврат 14 дней (надлежащего качества)</td>
<td>ЗоЗПП</td>
<td>✅ Да</td>
<td>UI возврата в ЛК + процесс в BP-07</td>
<td>Backend + Frontend</td>
<td>BP-07</td>
<td>To Do </td>
</tr>
<tr>
<td> Возврат брака (ненадлежащее качество)</td>
<td>ЗоЗПП</td>
<td>✅ Да</td>
<td>Полный refund + процесс в BP-15</td>
<td>Backend + Frontend</td>
<td>BP-15</td>
<td>To Do </td>
</tr>
<tr>
<td> Маркировка «Честный знак»</td>
<td>ЦРПТ (173-ФЗ)</td>
<td>❌ Нет</td>
<td>Не включаем маркированные товары в MVP</td>
<td>—</td>
<td>—</td>
<td>N/A </td>
</tr>
<tr>
<td> Алкоголь (ЕГАИС)</td>
<td>171-ФЗ</td>
<td>❌ Нет</td>
<td>Алкоголь не доставляем</td>
<td>—</td>
<td>—</td>
<td>N/A </td>
</tr>
<tr>
<td> Онлайн-кассы для агента</td>
<td>54-ФЗ (агентская схема)</td>
<td>❌ V2</td>
<td>Если агрегатор работает как агент (перепоручает приём денег)</td>
<td>Backend + Legal</td>
<td>—</td>
<td>V2 </td>
</tr>
<tr>
<td> СУБД из реестра отечественного ПО</td>
<td>import substitution</td>
<td>❌ V3</td>
<td>Переход на PostgreSQL (уже) или Postgres Pro</td>
<td>DevOps</td>
<td>—</td>
<td>V3 </td>
</tr>
</tbody>
</table>

**Риски несоответствия:**

<table>
<thead><tr>
<th> Требование</th>
<th>Штраф / Последствие</th>
<th>Вероятность</th>
<th>Митигация </th>
</tr></thead>
<tbody>
<tr>
<td> Утечка ПДн без уведомления РКН</td>
<td>До 500 000 руб (КоАП 13.11) + блокировка сайта</td>
<td>Low (при соблюдении §6.2)</td>
<td>Шифрование, audit log, DPA с провайдерами </td>
</tr>
<tr>
<td> Отсутствие онлайн-чека</td>
<td>До 30 000 руб за чек (54-ФЗ ст.14.5) — на каждую операцию</td>
<td>Medium</td>
<td>ОФД-интеграция с первым релизом </td>
</tr>
<tr>
<td> Несоблюдение ЗоЗПП (невозврат)</td>
<td>Штраф до 50 000 руб + судебные иски от клиентов</td>
<td>Low</td>
<td>BP-07 + BP-15 покрывают все сценарии </td>
</tr>
<tr>
<td> Дискриминация пользователей без аккаунта (заказ без регистрации)</td>
<td>Штраф до 500 000 руб (ФЗ-250, антимонопольное)</td>
<td>Low</td>
<td>Гостевой заказ — опционально, V2 </td>
</tr>
<tr>
<td> Блокировка за обработку ПДн вне РФ</td>
<td>Блокировка сайта Роскомнадзором на территории РФ</td>
<td>Low (БД в Selectel)</td>
<td>Подтвердить локализацию БД </td>
</tr>
</tbody>
</table>

**Roadmap соответствия:**

<table>
<thead><tr>
<th> Этап</th>
<th>Срок</th>
<th>Что включаем </th>
</tr></thead>
<tbody>
<tr>
<td> **MVP**</td>
<td>Запуск</td>
<td>152-ФЗ (согласие, шифрование, уведомление), 54-ФЗ (чеки), ЗоЗПП (возврат, информация о товаре) </td>
</tr>
<tr>
<td> **V2**</td>
<td>+6 мес</td>
<td>Честный знак (если ассортимент расширится), агентская схема (54-ФЗ), интеграция с ЭДО </td>
</tr>
<tr>
<td> **V3**</td>
<td>+12 мес</td>
<td>Импортозамещение ПО, сертификация ФСТЭК (при госзакупках), B2B ЭДО </td>
</tr>
</tbody>
</table>

### 6.4 Accessibility (Доступность)

Базовые требования (MVP):

<table>
<thead><tr>
<th> Требование</th>
<th>Реализация </th>
</tr></thead>
<tbody>
<tr>
<td> **Контрастность**</td>
<td>Минимум 4.5:1 для текста, 3:1 для крупного текста </td>
</tr>
<tr>
<td> **Навигация с клавиатуры**</td>
<td>Все интерактивные элементы доступны с Tab/Enter </td>
</tr>
<tr>
<td> **Скринридеры**</td>
<td>`alt` на всех изображениях товаров, ARIA-атрибуты на динамическом контенте </td>
</tr>
<tr>
<td> **Размер текста**</td>
<td>Увеличение до 200% без потери функциональности (rem-единицы) </td>
</tr>
<tr>
<td> **Цветовая слепота**</td>
<td>Статусы заказа: иконка + текст + цвет (не только цвет) </td>
</tr>
</tbody>
</table>

**Проверка:** Axe DevTools (Web — каждый PR).

---

### 6.5 Fraud Detection Requirements

Базовая система фрод-мониторинга для защиты от мошеннических транзакций с первого дня. Фрод в e-commerce составляет 1–3% оборота. Согласовано с BP-15 (Dispute & Chargeback) и §6.1 (Authentication & Authorization).

#### 6.5.1 Сигналы (правила)

**Velocity checks:**

<table>
<thead><tr>
<th> Правило</th>
<th>Порог</th>
<th>Окно</th>
<th>Действие </th>
</tr></thead>
<tbody>
<tr>
<td> Max заказов с одного аккаунта</td>
<td>5</td>
<td>1 час</td>
<td>Флаг → manual review </td>
</tr>
<tr>
<td> Max заказов с одной карты</td>
<td>3</td>
<td>24 часа</td>
<td>Флаг → manual review </td>
</tr>
<tr>
<td> Max регистраций с одного IP</td>
<td>10</td>
<td>1 час</td>
<td>Флаг → блокировка IP </td>
</tr>
<tr>
<td> Max попыток ввода SMS-кода</td>
<td>5</td>
<td>15 минут</td>
<td>Флаг → временная блокировка телефона </td>
</tr>
</tbody>
</table>

**Geo-anomaly:**

<table>
<thead><tr>
<th> Сигнал</th>
<th>Описание</th>
<th>Действие </th>
</tr></thead>
<tbody>
<tr>
<td> Адрес доставки в регионе A, IP из региона B</td>
<td>Несоответствие геолокации</td>
<td>Флаг (score +10) </td>
</tr>
<tr>
<td> Карта выпущена в регионе C, заказ из региона D</td>
<td>Cross-region payment</td>
<td>Флаг (score +15) </td>
</tr>
<tr>
<td> IP через VPN/Tor</td>
<td>Высокорисковый прокси</td>
<td>Флаг (score +25) </td>
</tr>
</tbody>
</table>

**Device fingerprinting:**

<table>
<thead><tr>
<th> Сигнал</th>
<th>Описание</th>
<th>Действие </th>
</tr></thead>
<tbody>
<tr>
<td> Один device ID → более 3 аккаунтов за 24ч</td>
<td>Множественные регистрации</td>
<td>Флаг (score +30) </td>
</tr>
<tr>
<td> Эмулятор / VM (Android i386, browser headless)</td>
<td>Подозрительное окружение</td>
<td>Флаг (score +20) </td>
</tr>
<tr>
<td> Сброшенный fingerprint (новый каждый запрос)</td>
<td>Попытка обхода</td>
<td>Флаг (score +15) </td>
</tr>
</tbody>
</table>

**Behavioral signals:**

<table>
<thead><tr>
<th> Сигнал</th>
<th>Порог</th>
<th>Действие </th>
</tr></thead>
<tbody>
<tr>
<td> Время от регистрации до оплаты</td>
<td>< 10 секунд</td>
<td>Флаг (score +20) </td>
</tr>
<tr>
<td> Сумма заказа — круглое число</td>
<td>Кратно 1000, 5000, 10000</td>
<td>Флаг (score +5) </td>
</tr>
<tr>
<td> Повторные отказы в оплате (3+) → другая карта</td>
<td>Смена карты после decline</td>
<td>Флаг (score +30) </td>
</tr>
<tr>
<td> Количество позиций в заказе</td>
<td>> 20 разных SKU</td>
<td>Флаг (score +10, проверка на перепродажу) </td>
</tr>
</tbody>
</table>

#### 6.5.2 Scoring-модель

Каждый сигнал добавляет score. Итоговый score = сумма баллов.

<table>
<thead><tr>
<th> Score</th>
<th>Действие</th>
<th>Пример </th>
</tr></thead>
<tbody>
<tr>
<td> 0–30</td>
<td>**Пропустить**</td>
<td>Обычный заказ, небольшое отклонение </td>
</tr>
<tr>
<td> 31–60</td>
<td>**Manual review**</td>
<td>Заказ помещается в очередь на проверку менеджером; клиенту — "заказ на проверке" </td>
</tr>
<tr>
<td> 61–80</td>
<td>**Дополнительная верификация**</td>
<td>Запрос SMS-кода подтверждения; при оплате — принудительный 3DS </td>
</tr>
<tr>
<td> 81–100</td>
<td>**Auto-decline + блокировка**</td>
<td>Заказ отклоняется, аккаунт временно блокируется, уведомление службы безопасности </td>
</tr>
</tbody>
</table>

**Пример расчёта:**

- Новый аккаунт (device fingerprint: 3+ аккаунтов) → +30
- Заказ на 10 000 руб (круглая сумма) → +5
- IP из Турции, адрес в Москве → +25 (geo-anomaly)
- **Итого: 60** → Manual review

#### 6.5.3 Workflow проверки

![Рис. 18: Fraud Detection — Workflow проверки (правила → скоринг → блокировка / ручная проверка)](exports/diagrams/diagram-18.png)

#### 6.5.4 Интеграции

<table>
<thead><tr>
<th> Источник</th>
<th>Данные</th>
<th>Статус</th>
<th>Примечание </th>
</tr></thead>
<tbody>
<tr>
<td> Внутренние (наши сервисы)</td>
<td>История заказов, device fingerprint, геолокация</td>
<td>MVP</td>
<td>Основной источник </td>
</tr>
<tr>
<td> Платежный шлюз (Т-Банк)</td>
<td>3DS результат, BIN-проверка</td>
<td>MVP</td>
<td>Стандартная проверка карты </td>
</tr>
<tr>
<td> Dadata / ФНС</td>
<td>Валидация адреса доставки</td>
<td>MVP</td>
<td>Блокировка несуществующих адресов </td>
</tr>
<tr>
<td> Внешние фрод-сервисы (V2)</td>
<td>Score от Kaspersky / Group-IB</td>
<td>V2</td>
<td>Дополнительный слой </td>
</tr>
<tr>
<td> Кредитные истории (V3)</td>
<td>Проверка через БКИ</td>
<td>V3</td>
<td>Для B2B с отсрочкой платежа </td>
</tr>
</tbody>
</table>

#### 6.5.5 Feedback loop

<table>
<thead><tr>
<th> Действие</th>
<th>Периодичность</th>
<th>Описание </th>
</tr></thead>
<tbody>
<tr>
<td> Разметка confirmed fraud</td>
<td>Ежедневно</td>
<td>Менеджер размечает отклонённые заказы: `confirmed_fraud` / `false_positive` </td>
</tr>
<tr>
<td> Пересчёт порогов</td>
<td>Раз в месяц</td>
<td>Анализ ROC-кривой: корректировка порогов score для минимизации false positive </td>
</tr>
<tr>
<td> Обновление device fingerprint DB</td>
<td>Непрерывно</td>
<td>Блокировка новых эмуляторов / VM по сигнатурам </td>
</tr>
<tr>
<td> Отчёт для бизнеса</td>
<td>Раз в неделю</td>
<td>Сколько фрода отловлено, сколько пропущено, сумма предотвращённых потерь </td>
</tr>
</tbody>
</table>

#### 6.5.6 Метрики эффективности

<table>
<thead><tr>
<th> Метрика</th>
<th>Цель</th>
<th>Формула </th>
</tr></thead>
<tbody>
<tr>
<td> Detection rate (DR)</td>
<td>> 80%</td>
<td>confirmed_fraud / total_fraud × 100% </td>
</tr>
<tr>
<td> False positive rate (FPR)</td>
<td>< 5%</td>
<td>false_positive / total_alerts × 100% </td>
</tr>
<tr>
<td> Manual review time</td>
<td>< 30 мин</td>
<td>Среднее время проверки одного заказа </td>
</tr>
<tr>
<td> Chargeback ratio</td>
<td>< 0.5%</td>
<td>chargebacks / total_orders × 100% </td>
</tr>
</tbody>
</table>

---

**Источник:** Раздел 5.9 исходного документа.

### 7.1 Test Levels

<table>
<thead><tr>
<th> Уровень</th>
<th>Что тестируем</th>
<th>Инструменты</th>
<th>Цель </th>
</tr></thead>
<tbody>
<tr>
<td> **Unit**</td>
<td>Use cases, business rules, DB queries</td>
<td>RSpec (Rails), `testify` (Go), `mockery` (mock generation)</td>
<td>Каждый use case изолированно, mock всех внешних зависимостей </td>
</tr>
<tr>
<td> **Integration**</td>
<td>Реальный сервис с реальными зависимостями</td>
<td>`testcontainers` (PostgreSQL, Redis, RabbitMQ в Docker)</td>
<td>Проверка, что сервис корректно работает с БД, брокером, кэшем </td>
</tr>
<tr>
<td> **Contract**</td>
<td>API между сервисами</td>
<td>Pact (CDC) или Spring Cloud Contract</td>
<td>Сервис A → Сервис B: контракт на формат запроса/ответа </td>
</tr>
<tr>
<td> **E2E**</td>
<td>Полный сценарий через все сервисы</td>
<td>Cypress (Web), K6 (API), Detox (Mobile)</td>
<td>Оформление заказа → оплата → сборка → доставка </td>
</tr>
<tr>
<td> **Load**</td>
<td>RPS, latency, memory under load</td>
<td>K6 (скачать скрипты: `search_only.js`, `trip_matching.js`, `stress_test.js`, `soak_test.js`)</td>
<td>Выдержит ли система 100 заказов/день? 1000? 10000? </td>
</tr>
<tr>
<td> **Security**</td>
<td>SAST, dependency scan, secrets</td>
<td>SonarCloud, Trivy, Aikido (каждом PR)</td>
<td>Утечки секретов, CVE в зависимостях </td>
</tr>
</tbody>
</table>

### 7.2 Инфраструктура тестирования

<table>
<thead><tr>
<th> Компонент</th>
<th>Решение </th>
</tr></thead>
<tbody>
<tr>
<td> **CI-пайплайн**</td>
<td>GitHub Actions: lint → unit → integration → E2E (параллельно) </td>
</tr>
<tr>
<td> **Testcontainers**</td>
<td>Docker-контейнеры для каждой интеграции: PostgreSQL, Redis, RabbitMQ, EventStoreDB </td>
</tr>
<tr>
<td> **Mock generation**</td>
<td>`mockery` для Go, `rspec-mocks` + `factory_bot` для Rails </td>
</tr>
<tr>
<td> **Тестовые данные**</td>
<td>`factory_bot` (Rails), `testdata` (Go), seeds для E2E </td>
</tr>
<tr>
<td> **Code coverage**</td>
<td>SimpleCov (Rails), `go test -cover` (Go), миморальный порог 80% </td>
</tr>
<tr>
<td> **Quality gate**</td>
<td>SonarCloud блокирует PR при падении coverage или новых когнитивных сложностях </td>
</tr>
</tbody>
</table>

### 7.3 Critical E2E Scenarios

1. **Оформление заказа:** выбор магазина → каталог → корзина → слот → оплата онлайн → статус «Оплачен»
2. **Сборка:** заказ появляется у пикера → пикер отмечает товары → замена → упаковка → «Передан курьеру»
3. **Доставка:** назначение курьера → построение маршрута → статус «В пути» → ETA → «Доставлен»
4. **Отмена:** отмена до сборки → возврат средств; отмена после сборки → комиссия
5. **Промокод:** ввод → пересчёт суммы → применение → отмена применения
6. **Добавление в заказ после оформления:** новый товар → обновление корзины пикера → сборка

### 7.4 Load Testing Targets

<table>
<thead><tr>
<th> Сценарий</th>
<th>Целевые метрики </th>
</tr></thead>
<tbody>
<tr>
<td> **100 одновременных пользователей просматривают каталог**</td>
<td>p95 < 500ms </td>
</tr>
<tr>
<td> **10 заказов/мин**</td>
<td>Order Service p95 < 200ms, 0 ошибок </td>
</tr>
<tr>
<td> **Dispatch: 1000 заказов за цикл (30 сек)**</td>
<td>Алгоритм укладывается в 5 секунд </td>
</tr>
<tr>
<td> **ETA estimator: 100 запросов/сек**</td>
<td>p95 < 300ms </td>
</tr>
</tbody>
</table>

---

## 8. Project Estimation & Roadmap (Оценка и план)

### 8.1 Effort Estimation by BP

Полная таблица оценок вынесена в [ESTIMATION.md](ESTIMATION.md).

> **Итого:** ~350 человеко-дней (≈ 17–18 месяцев работы команды из 3–4 человек)
> С поправкой на риски (×1.2 интеграции ×1.3 новизна) = **546 чел.-дней** (~27 месяцев / 3 dev)

### 8.2 Store Integration Costs
**Источник:** Раздел 5.8 исходного документа.

<table>
<thead><tr>
<th> Компонент</th>
<th>Дней </th>
</tr></thead>
<tbody>
<tr>
<td> Модель данных: сети, магазины, зоны, товары, цены</td>
<td>5 </td>
</tr>
<tr>
<td> Интеграция с 1-й сетью (API/парсинг + нормализация)</td>
<td>15 </td>
</tr>
<tr>
<td> Каждая следующая сеть (тиражирование)</td>
<td>8 </td>
</tr>
<tr>
<td> Система синхронизации: шедулер, обновление цен/остатков</td>
<td>10 </td>
</tr>
<tr>
<td> Каталог: категории, фильтры, поиск (Elasticsearch)</td>
<td>10 </td>
</tr>
<tr>
<td> API каталога с учётом магазина пользователя</td>
<td>8 </td>
</tr>
<tr>
<td> Админка: управление сетями, маппинг категорий</td>
<td>8 </td>
</tr>
<tr>
<td> **Итого**</td>
<td>**64** </td>
</tr>
</tbody>
</table>

### 8.3 MVP vs V2 vs V3 Roadmap

#### 8.3.1 MoSCoW-приоритизация внутри MVP

<table>
<thead><tr>
<th> Приоритет</th>
<th>Фичи</th>
<th>Оценка (чел.-дней) </th>
</tr></thead>
<tbody>
<tr>
<td> **M — Must have** (без этого продукт не работает)</td>
<td>Регистрация по телефону (BP-01), Каталог с 1 сетью (BP-02), Корзина → Оформление → Оплата (Т-Банк) (BP-03 + BP-04), Приложение пикера (базовое: сканер, замена, упаковка) (BP-05), Приложение курьера (базовое: навигация, приём оплаты) (BP-06), Админка (базовое: заказы, товары, пользователи) (BP-11), Инфраструктура (Docker Compose + CI/CD MVP)</td>
<td>210 </td>
</tr>
<tr>
<td> **S — Should have** (важно, но можно в V1.1)</td>
<td>Возврат и отмена (BP-07), Уведомления push/SMS (BP-09), Личный кабинет и история (BP-10), Промокоды (BP-08), Аналитика базовая (BP-12), S3/CDN для изображений</td>
<td>70 </td>
</tr>
<tr>
<td> **C — Could have** (если успеваем)</td>
<td>Базовый поиск через PG ILIKE (не ES), Telegram-бот поддержки, Опция «Можно раньше», Трекинг для клиента (базовый: статусы)</td>
<td>30 </td>
</tr>
<tr>
<td> **W — Won't have** (V2)</td>
<td>Dynamic Pricing, B2B, Elasticsearch, Мониторинг (Prometheus), Huawei/RuStore, B2B</td>
<td>40 </td>
</tr>
<tr>
<td> **MVP total**</td>
<td></td>
<td>**~310** </td>
</tr>
</tbody>
</table>

#### 8.3.2 Дорожная карта по этапам

<table>
<thead><tr>
<th> Этап</th>
<th>Длительность</th>
<th>Ключевые фичи</th>
<th>Оценка </th>
</tr></thead>
<tbody>
<tr>
<td> **MVP**</td>
<td>6–8 мес</td>
<td>1 сеть (Лента), регистрация, каталог, корзина, Т-Банк, пикер/курьер базовые, админка, Docker Compose</td>
<td>~310 чел.-дней </td>
</tr>
<tr>
<td> **V1.x**</td>
<td>+2–3 мес</td>
<td>Доработки MVP: возвраты, уведомления, промокоды, аналитика</td>
<td>+70 </td>
</tr>
<tr>
<td> **V2**</td>
<td>+4–6 мес</td>
<td>2–3 сети (METRO, Вкусвилл), СБП, Prometheus+Grafana, Sentry, Elasticsearch, B2B, Push, Huawei/RuStore</td>
<td>+120 </td>
</tr>
<tr>
<td> **V3**</td>
<td>+6–12 мес</td>
<td>K8s, Dynamic Pricing, OSRM+ML ETA, dispatch engine, Честный знак, лояльность, баллы</td>
<td>+150 </td>
</tr>
</tbody>
</table>

---

## 9. Appendices (Приложения)

### 9.1 О документе: Discovery-фаза

Настоящий документ — результат **Discovery-фазы** (исследовательского этапа перед разработкой). Discovery проведён для всесторонней оценки идеи, снижения рисков и формирования единого видения продукта у всех стейкхолдеров.

<table>
<thead><tr>
<th> Аспект</th>
<th>Описание </th>
</tr></thead>
<tbody>
<tr>
<td> **Цель**</td>
<td>Оценить коммерческий потенциал, сформировать общее видение, выявить риски, заложить основу для планирования </td>
</tr>
<tr>
<td> **Что сделано**</td>
<td>Анализ рынка и конкурентов, исследование ЦА (B2C + B2B), описание AS IS / TO BE, прототипирование архитектуры, сбор и приоритизация требований, выявление рисков </td>
</tr>
<tr>
<td> **Участники**</td>
<td>Хранитель идеи, аналитики (системные/бизнес), архитекторы, UX </td>
</tr>
<tr>
<td> **Результаты**</td>
<td>SRS-документ (настоящий), границы проекта, оценка сроков и бюджета (~350 чел.-дней), Roadmap (MVP/V2/V3), 14 описанных бизнес-процессов </td>
</tr>
<tr>
<td> **Риски, зафиксированные на Discovery**</td>
<td>Сложность интеграций с сетями (разные API, форматы данных), неточность онлайн-остатков, offline-сценарии пикеров/курьеров, юридические требования (152-ФЗ, 54-ФЗ) </td>
</tr>
</tbody>
</table>

**Ключевой вывод Discovery:** продукт востребован (рынок доставки продуктов растёт), B2C — бизнес на объёме (низкая маржинальность), B2B — бизнес на сервисе (высокая маржинальность). Рекомендуемый старт: 1 сеть (Лента), Санкт-Петербург, MVP за 6–8 месяцев.

### 9.2 References & Open-Source

Полный каталог референсов вынесен в [references/README.md](references/README.md).

### 9.3 Completeness Checklist
**Источник:** Приложение B исходного документа.

*Разделы считаются готовыми после переноса содержимого из исходного документа.*

- ✅ 1.1 Purpose & Scope (включая AS IS, Geography, Personas)
- ✅ 1.2 Glossary
- ✅ 1.3 Non-Functional Requirements (включая Food Safety, i18n)
- ✅ 1.4 External Integrations
- ✅ 1.5 Error Handling
- ✅ 1.6 Business Model (включая Franchise)
- ✅ 2.1–2.9 Architecture (включая Event Catalog, Лента API, Façade)
- ✅ 3.1–3.6 Data Model
- ✅ 4.1–4.9 Functional Requirements (все 14 BP + Feature Map + Offline + Support)
- ✅ 5.1–5.9 Infrastructure (включая Incident, Backup, FinOps, Readiness Checklist)
- ✅ 6.1–6.4 Security & Compliance (включая Accessibility)
- ✅ 7.1–7.4 Testing
- ✅ 8.1–8.3 Estimation & Roadmap
- ✅ 9.1–9.5 Appendices

### 9.4 Developer Quick-Start

<table>
<thead><tr>
<th> Параметр</th>
<th>Значение </th>
</tr></thead>
<tbody>
<tr>
<td> **Репозиторий**</td>
<td>Монорепозиторий: `/services/` (backend), `/apps/` (frontend, mobile), `/infra/` (Docker, CI) </td>
</tr>
<tr>
<td> **Backend**</td>
<td>Rails 5.1+, Ruby 2.6–2.7, Sidekiq ~6.x </td>
</tr>
<tr>
<td> **Frontend**</td>
<td>Next.js 10, React 17, MobX ~6.x </td>
</tr>
<tr>
<td> **Mobile**</td>
<td>Flutter 3.x (iOS + Android) </td>
</tr>
<tr>
<td> **База данных**</td>
<td>PostgreSQL 13+</td>
</tr>
<tr>
<td> **Очереди**</td>
<td>RabbitMQ </td>
</tr>
<tr>
<td> **Кэш**</td>
<td>Redis 6+ </td>
</tr>
<tr>
<td> **Поиск**</td>
<td>Elasticsearch 7.x (V2) </td>
</tr>
<tr>
<td> **Инфраструктура**</td>
<td>Docker Compose (dev), Selectel (prod) </td>
</tr>
<tr>
<td> **CI/CD**</td>
<td>GitHub Actions: lint → unit → integration → E2E </td>
</tr>
<tr>
<td> **Мониторинг**</td>
<td>Sentry (ошибки), Prometheus + Grafana (V2) </td>
</tr>
</tbody>
</table>

**Локальный запуск:**
```bash
docker compose up          # поднять все сервисы
docker compose up -d pg redis rabbitmq  # только инфраструктура
rails s                    # backend (dev)
npm run dev                # frontend (dev)
```

**Первый PR:**

1. Создать feature branch от `main`
2. `git commit -m "feat: ..."` (линтер проверит)
3. Открыть Pull Request → CI запустит lint + unit + integration
4. После approval — squash merge в `main`
5. Авто-деплой на staging; прод — вручную через GitHub Actions



### 9.5 Текущее состояние системы (AS IS)

Полное описание AS IS вынесено в [AUDIT_AS_IS.md](AUDIT_AS_IS.md). Включает: схему БД, API-запросы, ключевые алгоритмы, инфраструктуру и состав команды.

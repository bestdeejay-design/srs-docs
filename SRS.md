# Software Requirements Specification (SRS)

> **Назначение:** Документ спецификации программного продукта — агрегатора доставки продуктов из супермаркетов (аналог iGooods).
> **Цель:** Позволить команде разработки оценить трудозатраты и реализовать продукт-аналог.
> **Источник данных:** `ШАБЛОН_СПЕЦИФИКАЦИИ_ПРОДУКТА.md` — черновой документ, из которого данные перенесены в эту SRS.

---

## 1. Product Overview (Общие сведения)

### 1.1 Purpose & Scope
- Назначение продукта: доставка продуктов из супермаркетов (агрегатор, не свой склад)
- Целевая аудитория: B2C (покупатели), B2B (корпоративные заказы в офис)
- Ключевые бизнес-метрики: кол-во заказов/день, выручка, средний чек, конверсия, время сборки, время доставки
- Платформы: Web (Next.js), iOS, Android, Huawei AppGallery, RuStore
- Текущее состояние системы (заполнить)

### 1.2 Glossary (Глоссарий)
**Источник:** Раздел 1.2 исходного документа.

Определения всех ключевых терминов:
- **Роли:** Пикер, Курьер, Менеджер (Admin), Супер-админ, DevOps
- **Бизнес-термины:** Агрегатор доставки, Сеть супермаркетов, Сборка заказа, Слот доставки, Зона доставки, Замена товара, Автокурьер, Опция «Можно раньше», Товарное соседство
- **Технические термины (каталог):** Адаптер сети, Нормализация данных, Маппинг категорий, Динамические фильтры, Sync Queue
- **Технические термины (доставка):** Dispatch, Cheapest Insertion Heuristic, 2-opt, Constraint satisfaction, OSRM, ETA
- **Архитектурные паттерны:** Микросервисы, DDD, CQRS, Event Sourcing, Vertical Slice, Event-Driven, Feature Flag
- **Инфраструктура:** Окружения (dev/staging/prod), CI/CD, Rolling update, Rollback, Error Budget, Observability stack
- **Юридические:** 152-ФЗ, 54-ФЗ, Честный знак (ЦРПТ), ЕГАИС, ОФД, ЭДО, УПД, ЗоЗПП

### 1.3 Non-Functional Requirements (NFR)
**Источник:** Раздел 1.3 исходного документа.

| Категория | Must | Should | Could |
|---|---|---|---|
| **Performance** | p95 < 500ms (каталог), < 200ms (заказ), сборка < 30 мин, доставка < 60 мин | RPS 50→500→5000 | — |
| **Availability** | 99.9% uptime, at-least-once delivery, idempotent orders | Circuit breaker, DLQ | — |
| **Scalability** | Horizontal scaling, CDN, RabbitMQ consumers | PgBouncer, Redis Cluster, ES sharding | K8s HPA |
| **Security** | JWT, RBAC (5 ролей), TLS 1.3, AES-256, rate limiting, audit 1y | SAST/Trivy на каждый PR | — |
| **Observability** | Prometheus + Grafana, Loki, Sentry | Jaeger tracing | — |
| **Usability** | Offline-mode пикера и курьера | Startup < 3s, UI p95 < 200ms | WCAG 2.1 AA |
| **Portability** | Chrome/Firefox/Safari/Edge, iOS 15+, Android 11+ | Huawei, RuStore | — |
| **Maintainability** | — | Coverage > 80%, linting, ADR, feature flags, Swagger | — |
| **Data Retention** | Orders 3y, PDn до удаления, audit 1y, cache 15min TTL | Logs 90d | — |
| **Data Recovery** | Daily full backup + WAL streaming, RPO < 1h, RTO < 4h | DR in another DC | — |

### 1.4 External Integrations (Внешние интеграции)
**Источник:** Раздел 1.4 исходного документа.

Сводная таблица всех внешних систем (33 шт.) по категориям:
- **CRITICAL (6):** Т-Банк API, Лента API, ОФД, Selectel Cloud, GitHub Actions, Docker Registry
- **HIGH (17):** СБП, METRO, Вкусвилл, Яндекс.Карты, Google Maps, OSRM, SMS, FCM, Firestore, Scandit, ЭДО, CDN, App Store, Google Play
- **MEDIUM (9):** POS-терминал, Super Babylon, Утконос, Telegram, Crashlytics, Честный знак, OpenWeather, Huawei, RuStore
- **LOW (1):** Календарь праздников

### 1.5 Error Handling & Resilience (Обработка исключений)
**Источник:** Раздел 1.5 исходного документа.

- **Отказы внешних систем (10):** сети магазинов, Т-Банк, SMS, геокодер, OSRM, OpenWeather, Firebase, CDN и др.
- **Отказы внутренних сервисов (6):** PostgreSQL, Redis, RabbitMQ, ES, API Gateway, Dispatcher
- **Бизнес-исключения (12):** товара нет, заказ не подтверждён, платёж не прошёл, курьер не назначен, превышение веса, адрес вне зоны и др.
- **DLQ политика (5 очередей):** причины попадания и действия
- **Матрица timeout'ов (7 компонентов):** timeout, retry, fallback

### 1.6 Business Model (Бизнес-модель)
**Источник:** Пункт 6 общего списка.

*Модель монетизации, комиссии, тарифы B2B.*

---

## 2. System Architecture (Архитектура системы)

### 2.1 Architecture Style & Patterns
**Источник:** Раздел 5.7.1 исходного документа.

- Микросервисная архитектура (миграция с Rails-монолита)
- Паттерны: DDD, CQRS, Event Sourcing, Vertical Slice, Event-Driven
- Коммуникация: RabbitMQ (events) + REST (sync) + gRPC (internal)

### 2.2 Technology Stack
**Источник:** Раздел 1.1 исходного документа.

| Уровень | Технология | Версия |
|---|---|---|
| Backend | Ruby on Rails, Ruby, Sidekiq | 5.1+, 2.6–2.7, ~6.x |
| Frontend | Next.js, React, MobX | 10, 17, ~6.x |
| Mobile | Flutter | 3.x |
| Databases | PostgreSQL, Redis, Elasticsearch | 13+, 6+, 7.x |
| Infra | Selectel, Docker, Nginx | — |
| Monitoring | Sentry, Prometheus, Grafana, Jaeger | — |
| Payments | Т-Банк API, СБП | — |

### 2.3 Microservices Breakdown
**Источник:** Раздел 5.7.2 исходного документа.

| Сервис | BP | Tech | Storage |
|---|---|---|---|
| API Gateway | Cross | Nginx/Traefik | — |
| Auth Service | BP-01 | Rails | PG + Redis |
| Catalog Read | BP-02 | Next.js → API | PG + Redis + ES |
| Catalog Write | BP-02, Sync | Ruby (Sidekiq) | PG + EventStoreDB |
| Cart Service | BP-03 | Rails | Redis |
| Order Service | BP-03, BP-07 | Rails + Event Sourcing | PG + EventStoreDB |
| Payment Service | BP-04 | Rails/Go | PG |
| Picker Service | BP-05 | Rails + Flutter API | PG + Firestore |
| Delivery Service | BP-06 | Go/Rails | PG |
| Dispatcher | BP-06 | Go/TS | Redis (GEO) + PG |
| ETA Estimator | BP-06 | Python/Go | Redis (cache) |
| Notification Service | BP-09 | Rails (Sidekiq) | PG |
| Admin API | BP-11 | Rails Admin | PG |

### 2.4 Architecture Decision Records (ADRs)
**Источник:** Раздел 5.7.3 исходного документа.

- ADR-001: Микросервисы вместо монолита
- ADR-002: RabbitMQ для event-driven
- ADR-003: PostgreSQL per service + Redis cache + ES search
- ADR-004: Read/Write split Catalog (CQRS)
- ADR-005: Flutter для mobile (picker + courier)
- ADR-006: Redis GEO для dispatch

### 2.5 Integration Context Map (C4-диаграмма)
**Источник:** Раздел 5.7.4 исходного документа.

Mermaid C4-диаграмма: Client Layer → API Gateway → Services → Infrastructure → External.

### 2.6 Observability
**Источник:** Раздел 5.7.5 исходного документа.

- Prometheus (/metrics) → Grafana
- Loki + Promtail (логи)
- Jaeger (tracing)
- Sentry (error tracking)
- Uptime Kuma (healthcheck)

---

## 3. Data Model (Модель данных)

### 3.1 Entity Relationship Diagram (ERD)
**Источник:** Раздел 5.4 + пункт 5 общего списка.

*Визуальная ER-диаграмма и ссылки на SQL-схемы.*

### 3.2 Catalog Schema (Архитектура хранения каталога)
**Источник:** Раздел 5.4 исходного документа.

SQL-схема: `chains`, `stores`, `delivery_zones`, `chain_products`, `store_prices`, `categories`, `product_category_mappings`, `category_filters`, `filter_values`.

### 3.3 Orders & Payments Schema
**Источник:** Пункт 5 общего списка.

*SQL-схема: `orders`, `order_items`, `payments`, `refunds`, `carts`.*

### 3.4 Users & Auth Schema
**Источник:** Пункт 5 общего списка.

*SQL-схема: `users`, `sessions`, `roles`, `audit_log`.*

### 3.5 Delivery & Dispatch Schema
**Источник:** Пункт 5 общего списка.

*SQL-схема: `deliveries`, `couriers`, `delivery_zones`, `b2b_companies`, `b2b_orders`, `b2b_prices`.*

### 3.6 Notifications & Promotions Schema
**Источник:** Пункт 5 общего списка.

*SQL-схема: `notifications`, `promo_codes`, `loyalty_points`.*

---

## 4. Functional Requirements (Функциональные требования)

Каждый процесс описан по шаблону: триггер → шаги → данные → UI → интеграции → бизнес-правила → техзаметки → оценка.

### 4.1 Customer Domain (Клиент)

| ID | Процесс | Оценка (чел.-дней) |
|---|---|---|
| **BP-01** | Регистрация и аутентификация | 14 |
| **BP-02** | Каталог и поиск товаров | 28 |
| **BP-03** | Оформление заказа (Корзина → Заказ) | 34 |
| **BP-04** | Оплата заказа | 26 |
| **BP-10** | Личный кабинет и история заказов | 13 |

### 4.2 Picker Domain (Пикер)

| ID | Процесс | Оценка |
|---|---|---|
| **BP-05** | Сборка и упаковка заказа | 21 |
| — | Сценарий замены товара (7 шагов) | (включено в BP-05) |
| — | Архитектура приложения пикера | (включено в BP-05) |

### 4.3 Courier Domain (Курьер)

| ID | Процесс | Оценка |
|---|---|---|
| **BP-06** | Доставка заказа | 29 |
| — | Алгоритм dispatch (multi-objective optimization) | (включено в BP-06) |
| — | Расчёт ETA (OSRM + ML гибрид) | (включено в BP-06) |
| — | Архитектура приложения курьера | (включено в BP-06) |

### 4.4 Admin Domain (Администратор)

| ID | Процесс | Оценка |
|---|---|---|
| **BP-11** | Админ-панель (CRM / Бэк-офис) | 40 |
| **BP-12** | Аналитика и дашборды | 15 |
| **BP-08** | Управление промокодами и акциями | 10 |
| **BP-07** | Возврат и отмена заказа | 14 |

### 4.5 B2B Domain (Корпоративные заказы)

| ID | Процесс | Оценка |
|---|---|---|
| **BP-13** | B2B — Корпоративные заказы | 27 |

### 4.6 Cross-Cutting Domains (Сквозные)

| ID | Процесс | Оценка |
|---|---|---|
| **BP-09** | Уведомления (Push / SMS / Email) | 9 |
| **BP-14** | Dynamic Pricing | 15 |

---

## 5. Infrastructure & DevOps (Инфраструктура)

### 5.1 Environments (Окружения)
**Источник:** Раздел 5.10.1 исходного документа.

- **dev:** Docker Compose локально
- **staging:** GitHub Actions → Selectel VM
- **prod:** Selectel / K8s

### 5.2 CI/CD Pipeline
**Источник:** Раздел 5.10.2 исходного документа.

PR → lint + unit + security → integration (testcontainers) → build → push → staging → E2E → approval → prod

### 5.3 Deployment & Release Strategy
**Источник:** Раздел 5.15 исходного документа.

- Rolling update без downtime
- Feature flags (Flipper / LaunchDarkly)
- Rollback: `git revert` + deploy previous image
- Mobile deploy: TestFlight / Internal Testing / Huawei / RuStore

### 5.4 Monitoring & Alerting
**Источник:** Раздел 5.7.5 исходного документа.

- Prometheus + Grafana (метрики, дашборды)
- Loki + Promtail (логи)
- Jaeger (tracing, критичные сценарии)
- Sentry (error tracking, алерт на каждый новый error type)
- Uptime Kuma (healthcheck)

### 5.5 Performance & SLAs
**Источник:** Раздел 5.11 исходного документа.

- Время ответа: каталог p95 < 500ms, заказ p95 < 200ms
- Доступность: 99.9% uptime
- Error budget: 43 мин/месяц
- RPS: MVP 50 → V2 500 → V3 5000

---

## 6. Security & Compliance (Безопасность)

### 6.1 Authentication & Authorization
**Источник:** Раздел 5.13.1 исходного документа.

- 5 ролей: клиент, пикер, курьер, менеджер, супер-админ
- JWT access (15 мин) + refresh (30 дней, rotation)
- Rate limiting: 100 req/min user, 1000 req/min IP

### 6.2 Data Protection
**Источник:** Раздел 5.13.2 исходного документа.

- TLS 1.3, шифрование ПДн AES-256
- Security scanning: SonarCloud + Aikido + Trivy на каждый PR
- Secret management: GitHub Secrets, ротация 90 дней

### 6.3 Legal Requirements (Юридические требования)
**Источник:** Раздел 5.12 исходного документа.

- **152-ФЗ** (ПДн): согласие, шифрование, уведомление РКН, удаление по запросу
- **54-ФЗ** (ККТ): фискальный чек, ОФД, ФФД 1.2
- **Честный знак (ЦРПТ):** DataMatrix для маркированных товаров
- **ЗоЗПП:** возврат 7–14 дней, компенсация за брак
- **Алкоголь:** не доставляется (ЕГАИС не требуется)

---

## 7. Testing Strategy (Стратегия тестирования)

**Источник:** Раздел 5.9 исходного документа.

### 7.1 Test Levels

| Уровень | Инструменты | Цель |
|---|---|---|
| Unit | RSpec, testify, mockery | Use case изолированно |
| Integration | testcontainers (PG, Redis, RMQ) | Реальный сервис с зависимостями |
| Contract | Pact (CDC) | API между сервисами |
| E2E | Cypress (Web), K6 (API), Detox (Mobile) | Полный сценарий |
| Load | K6 (stress, soak, spike) | RPS, latency, memory |
| Security | SonarCloud, Trivy, Aikido | SAST, CVE, secrets |

### 7.2 Critical E2E Scenarios
1. Оформление заказа → оплата → сборка → доставка
2. Отмена до/после сборки → возврат средств
3. Замена товара → звонок → альтернатива → фиксация
4. Промокод → пересчёт → применение
5. Добавление в заказ после оформления

### 7.3 Load Testing Targets

| Сценарий | Цель |
|---|---|
| 100 concurrent users browsing catalog | p95 < 500ms |
| 10 orders/min | p95 < 200ms, 0 errors |
| 1000 orders per dispatch cycle | Алгоритм < 5 сек |
| 100 req/s to ETA estimator | p95 < 300ms |

---

## 8. Project Estimation & Roadmap (Оценка и план)

### 8.1 Effort Estimation by BP
**Источник:** Раздел 3.1 исходного документа.

| ID | Процесс | Всего (чел.-дней) |
|---|---|---|
| BP-01 | Регистрация | 15 |
| BP-02 | Каталог | 29 |
| BP-03 | Оформление | 35 |
| BP-04 | Оплата | 27 |
| BP-05 | Сборка | 22 |
| BP-06 | Доставка | 34 |
| BP-07 | Возврат | 16 |
| BP-08 | Промокоды | 10 |
| BP-09 | Уведомления | 12 |
| BP-10 | Личный кабинет | 13 |
| BP-11 | Админ-панель | 40 |
| BP-12 | Аналитика | 17 |
| BP-13 | B2B | 27 |
| BP-14 | Dynamic Pricing | 15 |
| Cross | Инфраструктура | 20 |
| Cross | Интеграции | 15 |
| **Итого** | | **350** |

> С поправкой на риски (×1.2 интеграции ×1.3 новизна) = **546 чел.-дней** (~27 месяцев / 3 dev)

### 8.2 Store Integration Costs
**Источник:** Раздел 5.14 исходного документа.

- Первая сеть: 15–23 дня (адаптер + нормализация + тесты)
- Каждая следующая: ~8 дней (тиражирование)

### 8.3 MVP vs V2 vs V3 Roadmap
**Источник:** Раздел 5.16 исходного документа.

| Этап | Длительность | Ключевые фичи |
|---|---|---|
| **MVP** | 6–8 мес | 1 сеть, регистрация, каталог, корзина, Т-Банк, пикер/курьер базовые, админка, Docker Compose |
| **V2** | +4–6 мес | 2–3 сети, СБП, мониторинг, ES, B2B, push, Huawei/RuStore |
| **V3** | +6–12 мес | K8s, Dynamic Pricing, OSRM+ML ETA, dispatch engine, Честный знак, лояльность |

---

## 9. Appendices (Приложения)

### 9.1 References & Open-Source
**Источник:** `references/github/` исходного документа.

- `references/github/store-apis-research.md` — API Ленты, Вкусвилл
- `references/github/igooods-analysis.md` — анализ стека iGooods
- `references/github/catalog-data.js` — модель каталога из DATA.js
- `references/github/open-source-references.md` — OS-референсы по разделам
- `ПЛАН_ОПТИМИЗАЦИИ_АЙГУДС.md` — план миграции на микросервисы
- `references/github/dependencies/` — Gemfile, package.json

### 9.2 Completeness Checklist
**Источник:** Приложение B исходного документа.

*Разделы считаются готовыми после переноса содержимого из исходного документа.*

- ✅ 1.1 Purpose & Scope
- ✅ 1.2 Glossary
- ✅ 1.3 Non-Functional Requirements
- ✅ 1.4 External Integrations
- ✅ 1.5 Error Handling
- ⬜ 1.6 Business Model
- ✅ 2.1–2.6 Architecture
- ⬜ 3.1–3.6 Data Model (кроме 3.2 Catalog)
- ✅ 4.1–4.6 Functional Requirements (все 14 BP)
- ✅ 5.1–5.5 Infrastructure
- ✅ 6.1–6.3 Security & Compliance
- ✅ 7.1–7.3 Testing
- ✅ 8.1–8.3 Estimation & Roadmap
- ✅ 9.1 References

### 9.3 Developer Quick-Start
- Локальный запуск: `docker compose up`
- Первый PR: создать feature branch от `main`
- CI: GitHub Actions (lint → test → build)
- Структура репозитория: монорепозиторий с `/services`, `/apps`, `/infra`

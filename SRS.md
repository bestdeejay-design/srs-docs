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

#### 1.6.1 Доходы (Revenue Streams)

| Статья | Описание | Расчёт | Доля в выручке (оценочно) |
|---|---|---|---|
| **Комиссия с заказа** | Процент от суммы заказа (маржа агрегатора) | 10–20% от стоимости товаров | ~70% |
| **Плата за доставку** | Фиксированная стоимость доставки, зависит от зоны и суммы заказа | Бесплатно от N руб, иначе 149–399 руб за адрес | ~15% |
| **Сервисный сбор** | Фиксированная плата за сборку заказа | 49–99 руб за заказ | ~10% |
| **B2B — индивидуальные тарифы** | Ежемесячная плата + индивидуальные цены для корпоративных клиентов | Договорная, от 10 000 руб/мес | ~5% |
| **Premium-опции** | Приоритетная доставка, расширенный временной слот (V3) | +99 руб к заказу | <1% |

#### 1.6.2 Расходы (Cost Structure)

| Статья | Описание | Доля (оценочно) |
|---|---|---|
| **Пикеры** | Почасовая оплата сотрудников в магазинах | ~35% |
| **Курьеры** | Сдельная оплата за доставленный заказ (или процент) | ~30% |
| **Инфраструктура** | Selectel (серверы, CDN), SMS-провайдер, Firebase, API | ~10% |
| **Эквайринг** | Комиссия Т-Банка / СБП за обработку платежей (1.5–3%) | ~5% |
| **Маркетинг** | Реклама, промокоды, программа лояльности | ~10% |
| **Команда** | Разработка, поддержка, менеджмент | ~10% |

#### 1.6.3 Юнит-экономика (пример)

| Метрика | B2C | B2B |
|---|---|---|
| **Средний чек** | 2 500–4 000 руб | 8 000–15 000 руб |
| **Комиссия сервиса** | 15% (375–600 руб) | 10% + фикс (договор) |
| **Стоимость сборки** | 150–200 руб | 300–400 руб |
| **Стоимость доставки** | 200–350 руб | 300–500 руб |
| **Маржинальность** | 25–50 руб (низкая, нужен объём) | 200–500 руб (высокая) |
| **LTV (жизненный цикл)** | 3–6 месяцев (10–20 заказов) | 12+ месяцев (регулярные) |

**Ключевой вывод:** B2C — бизнес на объёме, маржинальность 1–2% от оборота. B2B — бизнес на сервисе, маржинальность 5–10%. Оба сегмента互为 дополнение.

#### 1.6.4 Модель ценообразования (Pricing)

| Параметр | Значение |
|---|---|
| **Бесплатная доставка от** | 2 500–4 000 руб (настраивается для каждого магазина) |
| **Стоимость доставки (если не бесплатно)** | 199–399 руб |
| **Сервисный сбор** | 49–99 руб (фикс, не зависит от суммы) |
| **Минимальная сумма заказа** | 500–800 руб |
| **Надбавка за пиковое время** | ×1.3 (17:00–20:00) |
| **Надбавка за погоду** | ×1.2–1.5 (дождь/снег) |
| **B2B — отсрочка платежа** | 7–30 дней, после утверждения кредитного лимита |

#### 1.6.5 Ключевые метрики для дашборда

| Метрика | Формула | Цель (MVP) |
|---|---|---|
| **Заказов/день** | — | ≥ 50 |
| **Выручка/день** | Сумма комиссий + доставка + сервис | ≥ 100 000 руб |
| **Средний чек** | Выручка / кол-во заказов | ≥ 2 500 руб |
| **Конверсия** | Заказов / посетителей сайта | ≥ 3% |
| **Маржинальность** | (Выручка - затраты) / Выручка | > 0% (с V2 — > 10%) |
| **CAC (стоимость привлечения)** | Расходы на маркетинг / новые клиенты | < 500 руб |
| **LTV/CAC** | LTV / CAC | > 3 |
| **NPS** | Опрос клиентов | > 40 |

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

-- Категория в каталоге iGooods (наши, не сети)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Привязка товара сети к категории iGooods
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

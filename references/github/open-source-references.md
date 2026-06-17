# Open-source референсы для缺失 разделов

**Дата:** 2026-06-17
**Цель:** Найти open-source проекты, которые помогут заполнить недостающие разделы спецификации

---

## 1. Архитектура системы

### mehdihadeli/go-food-delivery-microservices ⭐1123
- https://github.com/mehdihadeli/go-food-delivery-microservices
- **Стек:** Go, RabbitMQ, PostgreSQL, MongoDB, Docker/K8s
- **Паттерны:** DDD, CQRS, Event Sourcing, Vertical Slice Architecture
- **Сервисы:** catalog, order, payment, identity — маппинг 1:1 на наши BP
- **CI/CD:** GitHub Actions, testcontainers, docker-compose, K8s
- **Что даёт:** Эталонную архитектуру микросервисов для доставки. Схему коммуникации, структуру сервисов, деплой.

### Hungquan5/uitgo_monorepo (Ride-hailing Platform)
- https://github.com/Hungquan5/uitgo_monorepo
- **Архитектурные документы:** `ARCHITECTURE.md`, `docs/architecture-stage1.md`, `ADR/` (Architecture Decision Records)
- **Observability:** Prometheus + Grafana + Loki + Jaeger + Sentry
- **CI/CD:** GitHub Actions → GHCR → ArgoCD (GitOps)
- **Infrastructure:** Terraform (AWS) + K8s + k3s
- **Что даёт:** Production-grade DevOps pipeline + C4-архитектура с ADR

---

## 2. Приложение пикера/курьера

### mobo-open-source/mobo_delivery (Flutter, Offline-First) ⭐
- https://github.com/mobo-open-source/mobo_delivery
- **Стек:** Flutter/Dart, Provider + BLoC, Hive (offline storage)
- **Offline-first:** Полная работа без интернета, Smart Sync Queue (очередь синхронизации)
- **Функции:** multi-stop route, live GPS, off-route detection, digital signature, photo POD, biometric login
- **Что даёт:** Архитектуру offline-first приложения курьера — Hive для локального хранения + sync queue

### gpietro/heymigrolino-picking-app (Flutter, iGooods-adjacent)
- https://github.com/gpietro/heymigrolino-picking-app
- **Стек:** Flutter/Dart, Firebase Auth + Firestore, Scandit (barcode scanning)
- **Прямое отношение:** Build flavors `dev_gooods` и `prod_gooods` — приложение для Migrolino × iGooods
- **CI/CD:** GitHub Actions с tag-based деплоем
- **Что даёт:** Реальный код приложения пикера для iGooods-like сервиса

### hightower-systems/sentry-wms (React Native, Warehouse Picking)
- https://github.com/hightower-systems/sentry-wms
- **Стек:** React Native (Expo) + Python/Flask + PostgreSQL + Redis + Celery
- **Паттерны:** Multi-order batch picking, wave picking, barcode scan, pick/confirm/short workflow
- **Что даёт:** Mobile-first WMS с оптимизацией walk paths для сборщиков

---

## 3. Алгоритм назначения курьера

### sjlouji/project-allot (TypeScript, Dispatch)
- https://github.com/sjlouji/project-allot
- **Подход:** Multi-objective optimization (6 целей: время, SLA, дистанция, disruption, fairness, zone familiarity)
- **Batching:** Cheapest Insertion Heuristic + 2-opt local search
- **Cycle:** Каждые 15-60 секунд, 100-1000+ заказов/цикл
- **Что даёт:** Полный алгоритм назначения курьера с открытым кодом — multi-objective + constraint satisfaction

### tule2236/Dynamic-Dispatch-and-Route-Optimization-Application (Python)
- https://github.com/tule2236/Dynamic-Dispatch-and-Route-Optimization-Application
- **Pipeline:** K-means clustering → Hungarian assignment → Simulated Annealing
- **Dynamic:** Новые задачи мержатся с незавершёнными и ре-оптимизируются каждый цикл

---

## 4. Алгоритм ETA

### ronchaudhuri1998/Food_Delivery_ETA_Prediction (Python, ML)
- https://github.com/ronchaudhuri1998/Food_Delivery_ETA_Prediction
- **Features:** Geodesic distance, weather, traffic, time-of-day
- **Models:** KNN, Decision Tree, Random Forest, XGBoost, SVR, MLP
- **Что даёт:** ML pipeline для ETA — feature engineering + model comparison

### Tthaodangiu/last-mile-route-optimization-system (Python, OSRM + ML)
- https://github.com/Tthaodangiu/last-mile-route-optimization-system
- **Pipeline:** OSRM routing → VROOM optimization → ML ETA prediction
- **Что даёт:** Гибридный подход: OSRM для базового ETA, ML для коррекции

---

## 5. Технологический стек (Rails + Next.js)

### wimpykid719/nextjs-rails-postgresql-docker
- https://github.com/wimpykid719/nextjs-rails-postgresql-docker
- **Стек:** Next.js + Rails API + PostgreSQL + Docker Compose
- **Что даёт:** Готовая конфигурация Docker для нашего стека

### PranshuChauhan149/Track-Cart (Full-stack delivery)
- https://github.com/PranshuChauhan149/Track-Cart
- **Стек:** Next.js 15 + MongoDB + Socket.io (live tracking) + NextAuth
- **Что даёт:** Real-time tracking integration + full-stack grocery delivery reference

---

## 6. Стратегия тестирования

### mehdihadeli/go-food-delivery-microservices
- Unit (Mockery) + Integration (testcontainers-go) + E2E
- CI pipeline с linting → unit → integration → build

### sentry-wms
- 2500+ тестов, Flask endpoint tests, service layer tests

---

## 7. Event-Driven / Saga / CQRS

### eventuate-tram/eventuate-tram-core ⭐1.2k
- https://github.com/eventuate-tram/eventuate-tram-core
- **Стек:** Java/Spring, Micronaut, PostgreSQL/MySQL, Kafka/RabbitMQ/Redis
- **Паттерны:** Transactional Outbox, Saga (choreography + orchestration), CQRS, Domain Events
- **CDC:** Transaction log tailing (Postgres WAL, MySQL binlog) — at-least-once delivery без дубликатов
- **Что даёт:** Production-grade реализация Event-Driven архитектуры для микросервисов. Сага для распределённых транзакций (order → payment → delivery)

### microservice-patterns/ftgo-application (Food Delivery, книга Microservice Patterns)
- https://github.com/microservice-patterns/ftgo-application
- **Стек:** Java/Spring, RabbitMQ, PostgreSQL, Docker
- **Архитектура:** Микросервисы + Event-Driven + Saga (orchestration-based)
- **Сервисы:** Consumer, Restaurant, Order, Delivery, Accounting, Kitchen
- **Что даёт:** Полный reference для архитектуры доставки еды из книги Криса Ричардсона — маппинг почти 1:1 на наши BP

---

## 8. Ecommerce-платформы (Catalog, Cart, Orders)

### medusajs/medusa ⭐34k
- https://github.com/medusajs/medusa
- **Стек:** Node.js/TypeScript, PostgreSQL, Redis, Medusa JS
- **Архитектура:** Headless commerce — модули: Product, Cart, Order, Payment, Fulfillment, Customer, Auth
- **B2B:** Компании, индивидуальные цены, корпоративные заказы, лимиты
- **Что даёт:** Референт для B2B-модуля (§4.5), API-дизайна каталога, платёжного flow. Можно использовать как готовый backend для админки

### saleor/saleor ⭐21k
- https://github.com/saleor/saleor
- **Стек:** Python/Django, GraphQL, PostgreSQL, Redis, Celery
- **Catalog:** Product variants, channels (multi-store), warehouses, stocks
- **Поиск:** Полнотекстовый через PostgreSQL + триграммы, опционально ES
- **Что даёт:** Референт для архитектуры каталога с variant'ами и multi-warehouse. GraphQL-схема продукта как пример API-дизайна

### spree/spree ⭐13k
- https://github.com/spree/spree
- **Стек:** Ruby on Rails, PostgreSQL, Redis, Sidekiq
- **Совместимость:** Тот же стек, что у текущего iGooods (Rails 5.1–7)
- **Что даёт:** Зрелый Rails ecommerce — референт для админки, промокодов, корзины. Можно переиспользовать готовые модули

---

## 9. Маркетплейс-платформа (агрегаторная модель)

### sharetribe/sharetribe ⭐2.5k
- https://github.com/sharetribe/sharetribe
- **Стек:** Ruby on Rails + React
- **Модель:** Маркетплейс — продавцы (магазины) и покупатели (клиенты)
- **Что даёт:** Архитектуру агрегатора: транзакции между сторонами, комиссия платформы, управление продавцами. Референт для бизнес-модели из §1.6

---

## 10. Feature Flags (Rollout / Release Strategy)

### jnunemaker/flipper ⭐3.7k
- https://github.com/jnunemaker/flipper
- **Стек:** Ruby, Rails, Redis/PostgreSQL/MongoDB (адаптеры)
- **Возможности:** Percentage rollout, group-based, user-based, actor-based. UI-админка. A/B тестирование
- **Что даёт:** Готовое решение для feature flags в Rails-стеке (§5.3). Подходит для rollout-стратегии (канary → процент → все)

---

## 11. Food Delivery (Rails stack)

### openfoodfoundation/openfoodnetwork ⭐1.1k
- https://github.com/openfoodfoundation/openfoodnetwork
- **Стек:** Ruby on Rails, PostgreSQL, Redis, AngularJS
- **Модель:** Альтернативная food delivery — поставщики → кооперативы → покупатели
- **Что даёт:** Близкий стек (Rails), модуль поставщиков (аналог сетей), управление зонами доставки, ценообразование

---

## 12. Multi-Store Price Aggregation & Catalog Management

### supermarkt/checkjebon ⭐234
- https://github.com/supermarkt/checkjebon
- **Стек:** JavaScript, Node.js, HTML
- **Что делает:** Сравнение цен продуктов в 12+ сетях супермаркетов Нидерландов (Albert Heijn, Jumbo, Aldi, Lidl и др.) одновременно. Парсинг чеков, поиск товаров, стоимость корзины по магазинам, открытые данные в JSON
- **Прямое отношение:** **Самый релевантный референс для агрегатора.** Демонстрирует multi-store каталог, алгоритмы сравнения цен, нечёткое сопоставление товаров (fuzzy matching). Данные публикуются как open data
- **Локально:** ✅ `repos/checkjebon`

### unopim/unopim ⭐10k
- https://github.com/unopim/unopim
- **Стек:** PHP (Laravel), MySQL/PostgreSQL, Redis
- **Что делает:** Open-source PIM (Product Information Management) для каталогов до 10M+ товаров. Multi-channel, multi-currency, локализация (33 языка, включая русский), REST API, AI-генерация контента, импорт/экспорт CSV/XLSX
- **Прямое отношение:** Нормализация и обогащение данных из разных сетей (Лента, Ашан, METRO) в единый каталог. REST API для слоя интеграции
- **Локально:** не клонирован (крупный, скачать при необходимости)

### akeneo/pim-community-dev ⭐1k
- https://github.com/akeneo/pim-community-dev
- **Стек:** PHP (Symfony), MySQL/PostgreSQL, Elasticsearch
- **Что делает:** Индустриальный стандарт open-source PIM. Управление каталогом, варианты товаров, семейства атрибутов, API-синдикация
- **Прямое отношение:** Боевой PIM для нормализации каталога от разных поставщиков

### tomaspavlin/rohlik-mcp ⭐113
- https://github.com/tomaspavlin/rohlik-mcp
- **Стек:** TypeScript, MCP (Model Context Protocol)
- **Что делает:** MCP-сервер для реальных API доставки продуктов Rohlik Group (Rohlik.cz, Knuspr.de, Gurkerl.at, Kifli.hu, Sezamo.ro). Поиск товаров, корзина, оформление через единый интерфейс
- **Прямое отношение:** **Единственный open-source проект с реальной интеграцией grocery delivery API.** Показывает как абстрагировать несколько сетей за единым API-слоем
- **Локально:** ✅ `repos/rohlik-mcp`

---

## 13. Supermarket Scrapers / Price Aggregators

### RamonWill/price-comparison-project ⭐97
- https://github.com/RamonWill/price-comparison-project
- **Стек:** Python (Django), BeautifulSoup, PostgreSQL
- **Что делает:** Сравнение цен в 6+ сетях UK (Tesco, Asda, Sainsbury's). Регистрация, поиск, корзина, сравнение
- **Прямое отношение:** Архитектура парсинга для магазинов без API (как и большинство российских сетей). Django + BeautifulSoup — готовый паттерн
- **Локально:** ✅ `repos/price-comparison-project`

### michaeloliverx/fullstack-fastapi-vuejs-price-aggregator ⭐24
- https://github.com/michaeloliverx/fullstack-fastapi-vuejs-price-aggregator
- **Стек:** Python (FastAPI), Vue.js, PostgreSQL
- **Что делает:** Агрегатор цен супермаркетов UK на FastAPI + асинхронный парсинг
- **Прямое отношение:** FastAPI — современный стек для API-слоя агрегатора. Асинхронный парсинг нескольких сетей параллельно
- **Локально:** ✅ `repos/fastapi-price-aggregator`

### Axedd/discount-etl
- https://github.com/Axedd/discount-etl
- **Стек:** Python, PostgreSQL
- **Что делает:** ETL-пайплайн для сбора скидок из сетей Дании. Модульная архитектура парсеров
- **Прямое отношение:** Паттерн «один парсер на сеть» → нормализация → PostgreSQL. Идеально для добавления/удаления сетей динамически

## Матрица покрытия

| Раздел чеклиста | Референс | Язык | Локально | Сложность внедрения |
|---|---|---|---|---|
| Архитектура системы | go-food-delivery-microservices | Go | ✅ `repos/` | Средняя |
| Архитектура / Saga | ftgo-application | Java | ✅ `repos/` | Высокая |
| Приложение пикера | heymigrolino-picking-app | Flutter | ✅ `repos/` | Низкая (наш стек) |
| Приложение курьера | mobo_delivery | Flutter | ✅ `repos/` | Низкая (наш стек) |
| WMS для сборщиков | sentry-wms | React Native | ✅ `repos/` | Средняя |
| Назначение курьера | project-allot | TypeScript | ✅ `repos/` | Низкая (наш стек) |
| ETA | Food_Delivery_ETA_Prediction | Python | — | Средняя |
| Rails + Next.js стек | nextjs-rails-postgresql-docker | Ruby/TS | ✅ `repos/` | Низкая (наш стек) |
| Multi-store price comparison | checkjebon | JS | ✅ `repos/` | Средняя |
| Grocery delivery API integration | rohlik-mcp | TS | ✅ `repos/` | Низкая (наш стек) |
| Supermarket scraper | price-comparison-project | Python | ✅ `repos/` | Средняя |
| Price aggregator (FastAPI) | fastapi-price-aggregator | Python | ✅ `repos/` | Низкая |
| PIM / Catalog management | unopim | PHP | — (крупный) | Средняя |
| PIM / Catalog management | akeneo/pim-community-dev | PHP | — (крупный) | Высокая |

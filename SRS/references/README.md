# References & Open-Source

**Источник:** §9.2 SRS.md

## Документы репозитория
- `references/github/store-apis-research.md` — API Ленты, Вкусвилл
- `references/github/analysis.md` — анализ стека референсного сервиса
- `references/github/catalog-data.js` — модель каталога из DATA.js
- `references/github/open-source-references.md` — полный каталог OS-референсов (все разделы ниже)
- `ПЛАН_ОПТИМИЗАЦИИ.md` — план миграции на микросервисы
- `references/github/dependencies/` — Gemfile, package.json
- `Discovery-фаза.txt` — описание Discovery-этапа и его артефактов

## Архитектура / Event-Driven / Saga
- **[go-food-delivery-microservices](https://github.com/mehdihadeli/go-food-delivery-microservices)** (Go) — DDD + CQRS + Event Sourcing, testcontainers, Prometheus+Grafana+Jaeger
- **[uitgo_monorepo](https://github.com/Hungquan5/uitgo_monorepo)** — 4 ADR, observability (Loki+Promtail+Sentry), K6, GitOps (ArgoCD), Terraform, security scanning
- **[eventuate-tram-core](https://github.com/eventuate-tram/eventuate-tram-core)** (⭐1.2k) — Saga (choreography + orchestration), Transactional Outbox, CQRS, CDC (WAL/binlog tailing)
- **[microservice-patterns/ftgo-application](https://github.com/microservice-patterns/ftgo-application)** — эталон food delivery из книги Microservice Patterns (Consumer, Order, Delivery, Kitchen, Accounting)

## Ecommerce-платформы
- **[medusa](https://github.com/medusajs/medusa)** (⭐34k) — headless commerce (Node.js/TS): Product, Cart, Order, B2B, плагины
- **[saleor](https://github.com/saleor/saleor)** (⭐21k) — GraphQL ecommerce (Python/Django): product variants, multi-warehouse, полнотекстовый поиск
- **[spree](https://github.com/spree/spree)** (⭐13k) — Rails ecommerce: тот же стек (Rails), референт для админки, промокодов, корзины
- **[sharetribe](https://github.com/sharetribe/sharetribe)** (⭐2.5k) — маркетплейс-платформа (Rails+React): агрегаторная модель, комиссия, управление продавцами
- **[openfoodnetwork](https://github.com/openfoodfoundation/openfoodnetwork)** (⭐1.1k) — Rails food delivery: поставщики, зоны доставки, ценообразование

## Приложения пикера/курьера
- **[heymigrolino-picking-app](https://github.com/gpietro/heymigrolino-picking-app)** — Flutter, build flavors `dev_gooods`/`prod_gooods`, Scandit barcode scan
- **[mobo_delivery](https://github.com/mobo-open-source/mobo_delivery)** — Flutter, offline-first (Hive + Smart Sync Queue), multi-stop route, GPS, photo POD
- **[sentry-wms](https://github.com/hightower-systems/sentry-wms)** — React Native WMS: multi-order batch picking, wave picking, pick/confirm/short

## Dispatch / ETA
- **[project-allot](https://github.com/sjlouji/project-allot)** — multi-objective dispatch (6 целей), Cheapest Insertion + 2-opt, batching 15–60s
- **[Dynamic-Dispatch-and-Route-Optimization](https://github.com/tule2236/Dynamic-Dispatch-and-Route-Optimization-Application)** — K-means → Hungarian → Simulated Annealing, dynamic re-optimisation
- **[Food_Delivery_ETA_Prediction](https://github.com/ronchaudhuri1998/Food_Delivery_ETA_Prediction)** — ML ETA (KNN, RF, XGBoost), feature engineering
- **[last-mile-route-optimization](https://github.com/Tthaodangiu/last-mile-route-optimization-system)** — OSRM + VROOM + ML ETA

## Технологический стек
- **[nextjs-rails-postgresql-docker](https://github.com/wimpykid719/nextjs-rails-postgresql-docker)** — Docker Compose для Rails+Next.js+PostgreSQL
- **[Track-Cart](https://github.com/PranshuChauhan149/Track-Cart)** — Next.js 15 + MongoDB + Socket.io live tracking
- **[flipper](https://github.com/jnunemaker/flipper)** (⭐3.7k) — feature flags в Rails (percentage rollout, A/B тесты, UI-админка)

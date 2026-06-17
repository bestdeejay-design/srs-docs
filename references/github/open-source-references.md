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

## Матрица покрытия

| Раздел чеклиста | Референс | Язык | Сложность внедрения |
|---|---|---|---|
| Архитектура системы | go-food-delivery-microservices | Go | Средняя |
| Приложение пикера | heymigrolino-picking-app | Flutter | Низкая (наш стек) |
| Приложение курьера | mobo_delivery | Flutter | Низкая (наш стек) |
| Назначение курьера | project-allot | TypeScript | Низкая (наш стек) |
| ETA | Food_Delivery_ETA_Prediction | Python | Средняя |
| Rails + Next.js стек | nextjs-rails-postgresql-docker | Ruby/TS | Низкая (наш стек) |
| Тестирование | go-food-delivery-microservices | Go | Средняя |

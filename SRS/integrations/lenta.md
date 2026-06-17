# Лента — Store API Integration Details

**Источник:** §2.5.1 SRS.md

**Статус:** первая сеть, MVP

## Защита
Qrator Labs (JS Challenge) — требуется headless browser (Playwright/Puppeteer) для обхода.

## API
Два API:
1. **Старое PHP RPC** `/api/rest/*` с MarketingPartnerKey
2. **Новый REST Gateway** `/api-gateway/v1/*` с JWT/guest token

## Рендеринг
Angular SSR — данные каталога в HTML, коллекции через API widgets.

## Мультибренд
Единая платформа для DomLenta, Utkonos, Monetka (API: `api.domlenta.ru`, `api.utkonos.ru`, `api.monetka.ru`).

## Feature flags
GrowthBook (CDN `growthbook-cdn.api.lenta.com`) — эндпоинты могут меняться без предупреждения.

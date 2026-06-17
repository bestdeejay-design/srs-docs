# Вкусвилл — Store API Integration Details

**Источник:** §2.5.1 SRS.md

**Статус:** V2

## Протокол
MCP JSON-RPC (экспериментальный).

## Эндпоинты
- `vkusvill_products_search(q, page, sort)`
- `vkusvill_product_details(id)`
- `vkusvill_cart_link_create(products[])`

## Ограничения
Макс 20 товаров за запрос, нет адресных остатков.

## Примечание
Это единственная сеть с открытым API — самая простая интеграция.

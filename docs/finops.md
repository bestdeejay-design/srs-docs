# FinOps (Оптимизация расходов на облако)

**Источник:** §5.8 SRS.md

| Практика | Описание | Этап |
|---|---|---|
| **Spot-инстансы** | Некритичные сервисы (staging, Catalog Write worker) на spot-экземплярах Selectel | MVP |
| **HPA/VPA** | Горизонтальное автомасштабирование по CPU/memory для K8s | V3 |
| **Managed services** | Использовать managed PostgreSQL (Selectel) вместо самостоятельного администрирования | MVP |
| **Storage tiering** | Selectel CDN для изображений (hot), S3 для логов (warm), Glacier для бэкапов (cold) | V2 |
| **Бюджетные алерты** | Уведомления при превышении 80% бюджетного лимита (GitHub → Telegram) | MVP |
| **Resource tagging** | Все ресурсы с тегами `env`, `service`, `owner` для анализа cost allocation | MVP |

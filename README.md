# Документация продукта (SRS)

Software Requirements Specification — агрегатор доставки продуктов из супермаркетов.

- **Живой сайт:** https://bestdeejay-design.github.io/srs-docs/
- **Исходный SRS:** `SRS/SRS.md` (3871 строк, 2 тома, 15 BP, 7 ADR)

## Структура

```
├── SRS/
│   ├── SRS.md                     # **Главный документ** — полная SRS (все 17 разделов)
│   ├── SRS-pdf.md                 # PDF-версия (с Mermaid-диаграммами, HTML-таблицами)
│   ├── finops.md                  # FinOps / стоимость инфраструктуры
│   ├── ESTIMATION.md              # Оценка сроков разработки
│   ├── AUDIT_AS_IS.md             # Аудит текущего состояния
│   ├── feature-map.md             # Карта фич (mindmap)
│   ├── db/schema.rb               # Схема БД (Rails)
│   ├── migrations/*.sql           # SQL-миграции (каталог, пользователи, заказы и т.д.)
│   └── references/README.md       # Индекс референсов по разделам
├── build-srs-html.py              # **Сборка HTML** — Pandoc → шаблон с TOC, поиском, темами
├── filter-pdf.py                  # Фильтр для удаления черновиков/заметок из финального вывода
├── prepare-pdf.py                 # Подготовка PDF (pandoc → weasyprint)
├── pdf-style.css                  # Стили для PDF-экспорта
├── puppeteer-config.json          # Конфиг Mermaid CLI (mmdc) для рендеринга диаграмм
├── exports/
│   ├── SRS.html                   # Финальный standalone HTML (сайт)
│   ├── SRS.pdf                    # PDF-версия
│   └── assets/*.png               # 18 Mermaid-диаграмм + feature-map
├── references/
│   └── github/                    # Исследования и референсы
│       ├── README.md              # Индекс
│       ├── catalog-data.js        # Модель каталога товаров
│       ├── dependencies/          # Зависимости (frontend/backend)
│       ├── analysis.md            # Анализ сервиса-аналога
│       ├── research.md            # Исследование GitHub
│       ├── store-apis-research.md # API супермаркетов
│       ├── open-source-references.md  # Каталог OS-референсов
│       └── repos/                 # Склонированные репозитории (12 шт)
├── docs/                          # MkDocs-сайт (deprecated, сохранён для истории)
├── site/                          # Собранный MkDocs (deprecated)
├── mkdocs.yml                     # Конфиг MkDocs (deprecated)
├── ПЛАН_ОПТИМИЗАЦИИ.md            # План миграции на микросервисы
├── ШАБЛОН_СПЕЦИФИКАЦИИ_ПРОДУКТА.md  # Шаблон SRS (архив)
├── Discovery-фаза.txt             # Описание Discovery-этапа
├── SRS_original.md                # Оригинальная SRS (архив)
├── SRS.html                       # Предыдущая версия HTML (архив)
└── Набор-промптов-для-доработки-SRS-документа.rtf  # Промпты для генерации SRS
```

## Сборка

```bash
# HTML-сайт
python3 build-srs-html.py
# → exports/SRS.html

# PDF
python3 prepare-pdf.py
# → exports/SRS.pdf
```

## Пайплайн

`SRS/SRS.md` → `filter-pdf.py` (чистка черновиков) → `build-srs-html.py` (Pandoc + кастомный шаблон) → `exports/SRS.html` → деплой на GitHub Pages (`srs-docs` repo, `gh-pages` ветка).

**Ключевые зависимости:** Pandoc, Mermaid CLI (mmdc), Python 3.

## Важно

- `SRS/SRS.md` — единственный актуальный источник. Все остальные md-файлы — архивы или вспомогательные.
- Название сервиса удалено из всех публичных артефактов.
- Содержимое ведётся на русском языке.

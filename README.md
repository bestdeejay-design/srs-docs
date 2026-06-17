# Документация продукта

Репозиторий для хранения документации проекта.

## Структура

```
docs/
├── README.md                                # Этот файл
├── SRS.md                                   # **Главный документ** — спецификация (2232+ строк, 9 разделов)
├── ПЛАН_ОПТИМИЗАЦИИ_АЙГУДС.md               # План миграции на микросервисы
├── ШАБЛОН_СПЕЦИФИКАЦИИ_ПРОДУКТА.md           # Шаблон (черновик, архив)
├── Discovery-фаза.txt                       # Описание Discovery-этапа
└── references/
    └── github/                              # Всё, что найдено на GitHub
        ├── open-source-references.md        # **Каталог OS-референсов** по всем разделам
        ├── store-apis-research.md           # API Ленты, Вкусвилл
        ├── igooods-analysis.md              # Анализ стека iGooods
        ├── catalog-data.js                  # Модель каталога (DATA.js)
        └── dependencies/
            ├── frontend-package.json        # Next.js + React
            └── backend-gemfile              # Ruby on Rails
```

## Назначение файлов

| Файл | Описание |
|---|---|
| `SRS.md` | **Главный документ.** Полная SRS: архитектура, BP, БД, инфраструктура, план (единственный актуальный) |
| `ПЛАН_ОПТИМИЗАЦИИ_АЙГУДС.md` | Технический план перехода с монолита на микросервисы |
| `ШАБЛОН_СПЕЦИФИКАЦИИ_ПРОДУКТА.md` | Шаблон (архив, 2258 строк) — консолидирован в SRS.md |
| `references/github/open-source-references.md` | **Каталог OS-референсов** — 20+ репозиториев по 11 разделам |
| `references/github/store-apis-research.md` | API Ленты (Qrator, SSR, collections) |
| `references/github/igooods-analysis.md` | Анализ бизнеса и стека iGooods |
| `references/github/catalog-data.js` | Эталонная структура каталога товаров |
| `references/github/dependencies/*` | Зависимости фронтенда и бэкенда |

> **Важно:** `SRS.md` — единственный актуальный документ. Шаблон больше не редактируется.

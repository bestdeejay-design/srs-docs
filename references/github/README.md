# GitHub References

Артефакты и данные, найденные на GitHub по iGooods.

## Структура

```
references/github/
├── README.md                     # Этот файл
├── research.md                   # Полный анализ найденного на GitHub
├── catalog-data.js               # Модель каталога товаров (из DATA.js)
└── dependencies/
    ├── frontend-package.json     # Зависимости Next.js/React (ChebotarevKonstantin/igooods)
    └── backend-gemfile           # Зависимости Ruby on Rails (tilvin/hotels)
```

## Источники

| Файл | Источник | Описание |
|---|---|---|
| `catalog-data.js` | github.com/igooods/test-task-1 | Структура каталога: категории, фильтры, бренды |
| `dependencies/frontend-package.json` | github.com/ChebotarevKonstantin/igooods | Next.js 10 + React 17 + ReactDOM |
| `dependencies/backend-gemfile` | github.com/tilvin/hotels | Rails 5.1, SQLite3, Haml, Sorcery (auth), Carrierwave |

## Как использовать

- **catalog-data.js** — взять за основу модель данных товарного каталога
- **Зависимости** — для понимания стека и версий, от которых отталкиваться
- **research.md** — для понимания общей картины и технологий iGooods

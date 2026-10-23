# NovaSystem — сайт

Сайт: https://nova-system.in.ua

- `public/` — статичний сайт (головна + квіз `ns-quiz/`), публікується на GitHub Pages при push у `main`.
- `relay/` — перехідник заявок (Cloud Run `novasystem-leads`, us-central1). Приймає заявки лише з nova-system.in.ua (і www) і пересилає в Telegram-групу «Заявки NovaSystem». Токен бота — у Secret Manager (`novasystem-tg-token`), у репозиторії його немає.

# Unlimited Video

Интерактивный лендинг для Render Web Service.

## Render (ручная настройка)
- Language: Node
- Branch: main
- Root Directory: пусто
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free (для теста)

## Заявки с телефона
Форма `/api/lead` отправляет заявки в Telegram через Bot API.
В Render → Environment добавь:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Сайт не записывает номера в файл/базу — он сразу пересылает заявку в Telegram.

## Видео
См. `public/videos/README.md`.

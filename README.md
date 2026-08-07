# AI Video Lab

Лёгкий статический лендинг для Render.

## Что заменить

- `YOUR_LINK_HERE` в `index.html` — ссылка на Telegram / магазин / инструкцию.
- Видео положить в папку `videos/`:
  - `cinematic.mp4`
  - `ugc.mp4`
  - `product.mp4`
  - `viral.mp4`
  - `lipsync.mp4`
- Если нужна попытка автозапуска озвучки без кнопки, положить файл `assets/voice.mp3`.

> Важно: браузеры могут блокировать autoplay со звуком до первого взаимодействия пользователя. Сайт всё равно пытается запустить `voice.mp3` автоматически.

## Render

Подключить репозиторий как **Static Site** или через Blueprint (`render.yaml`).

- Build Command: `echo "No build required"`
- Publish Directory: `.`

Никаких внешних JS-библиотек, npm-сборки или CDN не требуется.

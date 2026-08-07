const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

const recent = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (recent.get(ip) || []).filter(ts => now - ts < 60 * 60 * 1000);
  if (arr.length >= 5) return true;
  arr.push(now);
  recent.set(ip, arr);
  return false;
}

function clean(value, max = 100) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

app.post('/api/lead', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Слишком много заявок. Попробуйте позже.' });

  const name = clean(req.body.name, 60);
  const phone = clean(req.body.phone, 30);
  const consent = req.body.consent === true || req.body.consent === 'true' || req.body.consent === 'on';
  const website = clean(req.body.website, 100);
  if (website) return res.json({ ok: true });
  if (!consent || phone.length < 6) return res.status(400).json({ error: 'Укажите телефон и согласие на связь.' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log(`[LEAD] ${new Date().toISOString()} name=${name || '-'} phone=${phone}`);
    return res.status(503).json({ error: 'Форма ещё не подключена к Telegram.' });
  }

  const text = [
    '🔥 Новая заявка с сайта безлимита',
    '',
    `Имя: ${name || 'не указано'}`,
    `Телефон: ${phone}`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`
  ].join('\n');

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });
    if (!tg.ok) {
      const details = await tg.text();
      console.error('Telegram API error:', details);
      return res.status(502).json({ error: 'Не удалось отправить заявку.' });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Lead delivery error:', err);
    return res.status(502).json({ error: 'Не удалось отправить заявку.' });
  }
});

app.get('/healthz', (_req, res) => res.type('text').send('ok'));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  setHeaders(res, filePath) {
    if (/\.(mp4|webm)$/i.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Unlimited Video site listening on :${PORT}`);
});
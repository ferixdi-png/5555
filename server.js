const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 10000);
const PUBLIC = path.join(__dirname, 'public');
const APP_VERSION = '20260807-final-ai-companion';

const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.ico':'image/x-icon', '.mp4':'video/mp4', '.webm':'video/webm', '.mp3':'audio/mpeg', '.wav':'audio/wav'
};

const recent = new Map();
function json(res, status, data) {
  const body = Buffer.from(JSON.stringify(data));
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Content-Length':body.length,'Cache-Control':'no-store','X-App-Version':APP_VERSION});
  res.end(body);
}
function clean(value, max = 100) { return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max); }
function limited(ip) {
  const now = Date.now();
  const arr = (recent.get(ip) || []).filter(ts => now - ts < 60 * 60 * 1000);
  if (arr.length >= 5) return true;
  arr.push(now); recent.set(ip, arr); return false;
}
async function readBody(req, maxBytes = 20000) {
  return await new Promise((resolve, reject) => {
    const chunks=[]; let size=0;
    req.on('data', chunk => { size += chunk.length; if (size > maxBytes) { reject(new Error('too_large')); req.destroy(); return; } chunks.push(chunk); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
async function lead(req, res) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (limited(ip)) return json(res, 429, {error:'Слишком много заявок. Попробуйте позже.'});
  let data;
  try { data = JSON.parse((await readBody(req)) || '{}'); }
  catch { return json(res, 400, {error:'Некорректная заявка.'}); }

  const name=clean(data.name,60), phone=clean(data.phone,30), website=clean(data.website,100);
  const consent = data.consent === true || data.consent === 'true' || data.consent === 'on';
  if (website) return json(res, 200, {ok:true});
  if (!consent || phone.length < 6) return json(res, 400, {error:'Укажите телефон и согласие на связь.'});

  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log(`[LEAD] ${new Date().toISOString()} name=${name || '-'} phone=${phone}`);
    return json(res, 503, {error:'Форма ещё не подключена к Telegram.'});
  }
  const text=['🔥 Новая заявка с сайта безлимита','',`Имя: ${name || 'не указано'}`,`Телефон: ${phone}`,`Время: ${new Date().toLocaleString('ru-RU',{timeZone:'Europe/Moscow'})} МСК`].join('\n');
  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text,disable_web_page_preview:true})});
    if (!tg.ok) { console.error('Telegram API error:', await tg.text()); return json(res, 502, {error:'Не удалось отправить заявку.'}); }
    return json(res, 200, {ok:true});
  } catch (err) { console.error('Lead delivery error:', err); return json(res, 502, {error:'Не удалось отправить заявку.'}); }
}

function availableVideos() {
  const found = new Set();
  const scan = dir => {
    try {
      for (const name of fs.readdirSync(dir)) {
        const m=/^video-(\d{2})\.mp4$/i.exec(name);
        if (m) found.add(Number(m[1]));
      }
    } catch {}
  };
  scan(path.join(PUBLIC,'videos'));
  scan(__dirname);
  return [...found].filter(n=>n>0&&n<100).sort((a,b)=>a-b).map(n=>`video-${String(n).padStart(2,'0')}.mp4`);
}

function safeFile(urlPath) {
  let decoded; try { decoded=decodeURIComponent(urlPath); } catch { return null; }
  const normalized=path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  let file=path.join(PUBLIC, normalized);
  if (!file.startsWith(PUBLIC)) return null;

  if (/^[/\\]?videos[/\\]video-\d{2}\.mp4$/i.test(normalized) && !fs.existsSync(file)) {
    const base=path.basename(normalized);
    const rootVideo=path.join(__dirname,base);
    if (fs.existsSync(rootVideo)) file=rootVideo;
  }
  return file;
}

function versionHtml(html) {
  let out = html;
  out = out.replace(/<link[^>]+premium-motion\.css[^>]*>\s*/g,'')
           .replace(/<script[^>]+premium-motion\.js[^>]*><\/script>\s*/g,'')
           .replace(/<link[^>]+experience-v2\.css[^>]*>\s*/g,'')
           .replace(/<script[^>]+experience-v2\.js[^>]*><\/script>\s*/g,'');

  if (!out.includes('/journey.css')) out = out.replace('</head>', `<link rel="stylesheet" href="/journey.css?v=${APP_VERSION}">\n</head>`);
  if (!out.includes('/final-polish.css')) out = out.replace('</head>', `<link rel="stylesheet" href="/final-polish.css?v=${APP_VERSION}">\n</head>`);
  if (!out.includes('/journey.js')) out = out.replace('</body>', `<script src="/journey.js?v=${APP_VERSION}" defer></script>\n</body>`);
  return out.replace(/(href|src)="(\/[^"?#]+\.(?:css|js))"/g, (_m, attr, asset) => `${attr}="${asset}?v=${APP_VERSION}"`);
}

function serveHtml(res, file) {
  fs.readFile(file, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
      return res.end('index.html not found');
    }
    const body = Buffer.from(versionHtml(html));
    res.writeHead(200, {
      'Content-Type':MIME['.html'], 'Content-Length':body.length,
      'Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma':'no-cache','Expires':'0','X-App-Version':APP_VERSION
    });
    res.end(body);
  });
}

function serveFile(req,res,file){
  const ext=path.extname(file).toLowerCase();
  const requestedMedia=/\.(mp4|webm|mp3|wav)$/.test(ext);
  fs.stat(file,(err,stat)=>{
    if(err || !stat.isFile()) {
      if(requestedMedia){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});return res.end('Media not found');}
      return serveHtml(res, path.join(PUBLIC,'index.html'));
    }
    if (ext === '.html') return serveHtml(res, file);

    const type=MIME[ext] || 'application/octet-stream', range=req.headers.range;
    const isMedia=requestedMedia;
    const isCode=/\.(css|js)$/.test(ext);
    if(range && isMedia){
      const m=/^bytes=(\d*)-(\d*)$/.exec(range);
      if(!m){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      const start=m[1]?Number(m[1]):0, end=m[2]?Math.min(Number(m[2]),stat.size-1):stat.size-1;
      if(start>end || start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      res.writeHead(206,{'Content-Type':type,'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1,'Cache-Control':'public, max-age=86400','X-App-Version':APP_VERSION});
      return fs.createReadStream(file,{start,end}).pipe(res);
    }
    const cache = isCode ? 'no-store, no-cache, must-revalidate' : (isMedia ? 'public, max-age=86400' : 'public, max-age=3600');
    res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size,'Cache-Control':cache,'X-App-Version':APP_VERSION});
    fs.createReadStream(file).pipe(res);
  });
}

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host || 'localhost'}`);
  if(req.method==='GET' && url.pathname==='/healthz'){
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-App-Version':APP_VERSION});
    return res.end(`ok ${APP_VERSION}`);
  }
  if(req.method==='GET' && url.pathname==='/version') return json(res,200,{version:APP_VERSION});
  if(req.method==='GET' && url.pathname==='/api/videos') return json(res,200,{videos:availableVideos()});
  if(req.method==='POST' && url.pathname==='/api/lead') return lead(req,res);
  if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD, POST'});return res.end();}
  const pathname=url.pathname==='/'?'/index.html':url.pathname, file=safeFile(pathname);
  if(!file){res.writeHead(400,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Bad request');}
  serveFile(req,res,file);
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Unlimited Video ${APP_VERSION} listening on :${PORT}`));

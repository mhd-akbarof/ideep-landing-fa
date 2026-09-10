import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const publicDir = "/app/public";
const port = Number(process.env.PORT || 80);
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const requests = new Map();
const mimeTypes = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".svg":"image/svg+xml", ".ico":"image/x-icon", ".txt":"text/plain; charset=utf-8" };

function sendJson(response, status, data) { response.writeHead(status, { "Content-Type":"application/json; charset=utf-8" }); response.end(JSON.stringify(data)); }
function clean(value, max = 120) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
function isRateLimited(request) {
  const ip = String(request.headers["x-forwarded-for"] || request.socket.remoteAddress).split(",")[0].trim();
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((time) => now - time < 600000);
  requests.set(ip, recent);
  if (recent.length >= 10) return true;
  recent.push(now);
  return false;
}

async function handleWaitlist(request, response) {
  let raw = "";
  for await (const chunk of request) { raw += chunk; if (raw.length > 10000) return sendJson(response, 413, { error:"درخواست بیش از حد بزرگ است." }); }
  let body;
  try { body = JSON.parse(raw); } catch { return sendJson(response, 400, { error:"اطلاعات فرم معتبر نیست." }); }
  if (body.website) return sendJson(response, 200, { ok:true });
  const name=clean(body.name,80), phone=clean(body.phone,30), business=clean(body.business), email=clean(body.email);
  if (!name || !phone || !business) return sendJson(response,400,{error:"لطفاً نام، شماره تماس و حوزه کسب‌وکار را وارد کنید."});
  if (isRateLimited(request)) return sendJson(response,429,{error:"تعداد درخواست‌ها زیاد است؛ چند دقیقه دیگر دوباره تلاش کنید."});
  if (!token || !chatId) { console.error("Missing Telegram environment variables"); return sendJson(response,503,{error:"ثبت‌نام موقتاً در دسترس نیست."}); }
  const message=["🚀 عضو جدید لیست انتظار iDeep","",`نام: ${name}`,`موبایل: ${phone}`,`کسب‌وکار: ${business}`,`ایمیل: ${email || "وارد نشده"}`,"پیشنهاد: ۷۰٪ تخفیف اولین خرید هر پلن"].join("\n");
  try {
    const result=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:chatId,text:message}),signal:AbortSignal.timeout(8000)});
    if (!result.ok) throw new Error(`Telegram returned ${result.status}`);
    return sendJson(response,201,{ok:true});
  } catch (error) { console.error(error); return sendJson(response,502,{error:"ارسال انجام نشد؛ لطفاً دوباره تلاش کنید."}); }
}

async function serveStatic(request,response) {
  const url=new URL(request.url,"http://localhost");
  let pathname=decodeURIComponent(url.pathname); if(pathname.endsWith("/")) pathname += "index.html";
  if (["/server.mjs","/nginx.conf","/.dockerignore","/.gitignore"].includes(pathname)) { response.writeHead(404).end(); return; }
  const safePath=normalize(pathname).replace(/^(\.\.(\/|\\|$))+/ ,"");
  let filePath=join(publicDir,safePath);
  try { const info=await stat(filePath); if(info.isDirectory()) filePath=join(filePath,"index.html"); } catch { if(!extname(filePath)) filePath += ".html"; }
  try {
    let content=await readFile(filePath); const extension=extname(filePath).toLowerCase();
    response.writeHead(200,{"Content-Type":mimeTypes[extension]||"application/octet-stream","Cache-Control":pathname.startsWith("/_next/static/")?"public, max-age=31536000, immutable":"no-cache"});
    if(request.method === "HEAD") return response.end(); response.end(content);
  } catch { const notFound=await readFile(join(publicDir,"404.html")); response.writeHead(404,{"Content-Type":"text/html; charset=utf-8"}); response.end(notFound); }
}

createServer(async (request,response)=>{
  if(request.method === "POST" && request.url === "/api/waitlist") return handleWaitlist(request,response);
  if(request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405).end(); return; }
  return serveStatic(request,response);
}).listen(port,"0.0.0.0",()=>console.log(`iDeep listening on ${port}`));

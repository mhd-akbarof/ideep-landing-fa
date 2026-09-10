window.addEventListener("load", () => {
  setTimeout(() => {
  const style = document.createElement("style");
  style.textContent = `.wl-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(2,6,23,.82);backdrop-filter:blur(10px);overflow-x:hidden;box-sizing:border-box}.wl-modal *{box-sizing:border-box}.wl-modal.is-open{display:flex}.wl-card{position:relative;width:min(100%,560px);max-width:560px;max-height:92vh;overflow-y:auto;overflow-x:hidden;border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:32px;background:linear-gradient(145deg,#111827,#171238);box-shadow:0 30px 100px rgba(79,70,229,.3);direction:rtl;color:#fff}.wl-close{position:absolute;left:18px;top:16px;border:0;background:transparent;color:#94a3b8;font-size:30px;cursor:pointer}.wl-card h2{font-size:28px;font-weight:900;margin:0 0 10px}.wl-card>p{color:#cbd5e1;line-height:1.9;margin:0 0 22px}.wl-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;min-width:0}.wl-field{display:flex;flex-direction:column;gap:7px;min-width:0}.wl-field.full{grid-column:1/-1}.wl-field label{font-size:13px;color:#cbd5e1}.wl-field input{display:block;width:100%;max-width:100%;min-width:0;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:13px 14px;background:rgba(255,255,255,.06);color:#fff;outline:none}.wl-field input:focus{border-color:#818cf8;box-shadow:0 0 0 3px rgba(99,102,241,.16)}.wl-submit{width:100%;margin-top:18px;border:0;border-radius:13px;padding:14px;background:linear-gradient(90deg,#6366f1,#d946ef);color:#fff;font-weight:800;cursor:pointer}.wl-submit:disabled{opacity:.65;cursor:wait}.wl-note{margin-top:12px!important;font-size:12px;color:#94a3b8!important;text-align:center}.wl-status{display:none;margin-top:14px!important;padding:12px;border-radius:12px;text-align:center}.wl-status.ok{display:block;background:rgba(16,185,129,.13);color:#6ee7b7!important}.wl-status.error{display:block;background:rgba(244,63,94,.13);color:#fda4af!important}.wl-honeypot{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;border:0!important;opacity:0!important;clip-path:inset(50%)!important;pointer-events:none!important}.wl-modal-open{overflow:hidden!important}@media(max-width:560px){.wl-modal{padding:12px}.wl-card{padding:28px 20px}.wl-grid{grid-template-columns:minmax(0,1fr)}.wl-field.full{grid-column:auto}}`;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "wl-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `<div class="wl-card"><button class="wl-close" type="button" aria-label="بستن">×</button><h2>به جمع اولین کاربران آی‌دیپ بپیوندید</h2><p>اوایل پاییز ۱۴۰۵، پیش از رونمایی عمومی به شما خبر می‌دهیم و ۷۰٪ تخفیف اولین خرید هر پلن را برایتان ارسال می‌کنیم.</p><form><div class="wl-grid"><div class="wl-field"><label>نام و نام خانوادگی</label><input name="name" autocomplete="name" required></div><div class="wl-field"><label>شماره موبایل</label><input name="phone" inputmode="tel" autocomplete="tel" placeholder="09123456789" required></div><div class="wl-field full"><label>حوزه کسب‌وکار</label><input name="business" placeholder="مثلاً فروشگاه پوشاک" required></div><div class="wl-field full"><label>ایمیل (اختیاری)</label><input name="email" inputmode="email" autocomplete="email" placeholder="name@example.com"></div><input class="wl-honeypot" name="website" tabindex="-1" autocomplete="off"></div><button class="wl-submit" type="submit">ثبت‌نام در لیست انتظار</button><p class="wl-note">اطلاعات شما فقط برای اطلاع‌رسانی زمان راه‌اندازی استفاده می‌شود.</p><p class="wl-status" aria-live="polite"></p></form></div>`;
  document.body.appendChild(modal);

  const open = () => {
    if (!modal.isConnected) document.body.appendChild(modal);
    modal.classList.add("is-open");
    document.documentElement.classList.add("wl-modal-open");
    setTimeout(() => modal.querySelector("input").focus(), 50);
  };
  const close = () => { modal.classList.remove("is-open"); document.documentElement.classList.remove("wl-modal-open"); };
  modal.querySelector(".wl-close").addEventListener("click", close);
  modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  window.addEventListener("open-waitlist", open);

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("button,a");
    if (!trigger) return;
    if (trigger.closest(".wl-modal")) return;
    const label = trigger.textContent.trim();
    const href = trigger.getAttribute("href") || "";
    if (!/پیوستن به لیست انتظار|دریافت ۷۰٪ تخفیف|لیست انتظار/.test(label)) return;
    event.preventDefault(); event.stopPropagation(); open();
  }, true);

  modal.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector(".wl-submit");
    const status = form.querySelector(".wl-status");
    submit.disabled = true; submit.textContent = "در حال ثبت…"; status.className = "wl-status";
    try {
      const fieldValue = (name) => form.querySelector(`[name="${name}"]`)?.value || "";
      const data = { name:fieldValue("name"), phone:fieldValue("phone"), business:fieldValue("business"), email:fieldValue("email"), website:fieldValue("website") };
      const response = await fetch(`${window.location.origin}/api/waitlist`, { method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body:JSON.stringify(data) });
      const responseText = await response.text();
      let result = {};
      try { result = JSON.parse(responseText); } catch { result = {}; }
      if (!response.ok) throw new Error(result.error || "خطا در ثبت اطلاعات");
      form.reset();
      status.textContent = "عالی شد! به لیست انتظار آی‌دیپ اضافه شدید. هنگام راه‌اندازی، کد تخفیف ۷۰٪ را برایتان ارسال می‌کنیم.";
      status.className = "wl-status ok";
    } catch (error) {
      const safeMessages = ["لطفاً نام، شماره تماس و حوزه کسب‌وکار را وارد کنید.", "تعداد درخواست‌ها زیاد است؛ چند دقیقه دیگر دوباره تلاش کنید.", "ثبت‌نام موقتاً در دسترس نیست.", "ارسال انجام نشد؛ لطفاً دوباره تلاش کنید."];
      status.textContent = safeMessages.includes(error.message) ? error.message : "ارتباط با سرور برقرار نشد؛ لطفاً دوباره تلاش کنید.";
      status.className = "wl-status error";
    }
    finally { submit.disabled = false; submit.textContent = "ثبت‌نام در لیست انتظار"; }
  });
  }, 0);
});

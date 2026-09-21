/* dic.js — ترکیب چهار دیتابیس در یک فایل واحد
   خروجی نهایی: window.DIC = [{w:"...", m:"...", src:"دهخدا"}, ...]
*/

(function () {
  "use strict";

  // 1) اینجا چهار آرایه‌ی اصلی را قرار می‌دهیم:
  // روش A (پیشنهادی): کل محتوای 4 فایل را اینجا پِیست کن
  // و فقط نام متغیرها را در چهار خط زیر درست کن.

  // --- شروع: محتوای فایل‌ها را اینجا قرار بده ---
  // (۱) محتوای dehkhoda.js را پِیست کن
  // (۲) محتوای amid.js را پِیست کن
  // (۳) محتوای moein.js را پِیست کن
  // (۴) محتوای abadis.js را پِیست کن
  // --- پایان: محتوای فایل‌ها ---

  // 2) این چهار خط را مطابق نام متغیر واقعی داخل فایل‌های شما تنظیم کن:
  // مثال اگر داخل dehkhoda.js نوشته: var dehkhoda = [...]
  // پس DEHKHODA_ARR = dehkhoda;
  const DEHKHODA_ARR = (typeof dehkhoda !== "undefined") ? dehkhoda : [];
  const AMID_ARR     = (typeof amid     !== "undefined") ? amid     : [];
  const MOEIN_ARR    = (typeof moein    !== "undefined") ? moein    : [];
  const ABADIS_ARR   = (typeof abadis   !== "undefined") ? abadis   : [];

  function pick(item, keys) {
    for (const k of keys) {
      if (item && item[k] != null && item[k] !== "") return item[k];
    }
    return "";
  }

  function toEntries(arr, srcName) {
    const out = [];
    if (!Array.isArray(arr)) return out;
    for (const it of arr) {
      const w = pick(it, ["word", "w", "title", "term", "t"]);
      const m = pick(it, ["meaning", "m", "def", "definition", "text", "desc"]);
      if (!w) continue;
      out.push({ w, m, src: srcName });
    }
    return out;
  }

  const merged = []
    .concat(toEntries(DEHKHODA_ARR, "دهخدا"))
    .concat(toEntries(AMID_ARR, "عمید"))
    .concat(toEntries(MOEIN_ARR, "معین"))
    .concat(toEntries(ABADIS_ARR, "آبادیس"));

  window.DIC = merged;
})();

// موتور جستجوی جامع واژگان فارسی (آنلاین ویکی‌واژه + حافظه محلی)

const WordEngine = {
  // ۱. بررسی حافظه آفلاین
  getFromCache(word) {
    try {
      const cache = JSON.parse(localStorage.getItem('danesh_words') || '{}');
      return cache[word] || null;
    } catch {
      return null;
    }
  },

  // ۲. ذخیره در حافظه آفلاین
  saveToCache(word, data) {
    try {
      const cache = JSON.parse(localStorage.getItem('danesh_words') || '{}');
      cache[word] = data;
      localStorage.setItem('danesh_words', JSON.stringify(cache));
    } catch (e) {
      console.warn("حافظه پر است یا در دسترس نیست");
    }
  },

  // ۳. استخراج معنی از ویکی‌واژه جامع فارسی
  async fetchMeaning(word) {
    word = word.trim();
    if (!word) return { success: false, msg: "لطفاً کلمه‌ای وارد کنید" };

    // بررسی آفلاین
    const cached = this.getFromCache(word);
    if (cached) {
      return { success: true, source: "آفلاین (حافظه)", data: cached };
    }

    if (!navigator.onLine) {
      return { success: false, msg: "اینترنت متصل نیست و کلمه در حافظه موجود نمی‌باشد." };
    }

    // درخواست به ویکی‌واژه فارسی
    const url = `https://fa.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=text|sections&format=json&origin=*`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.error) {
        return { success: false, msg: "واژه در لغت‌نامه یافت نشد." };
      }

      // پردازش و تمیز کردن متن HTML
      const rawHtml = json.parse.text["*"];
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");

      // حذف بخش‌های اضافی ویکی‌واژه (پیوندها، پانویس و جعبه‌ها)
      doc.querySelectorAll('.mw-editsection, .reference, table, noscript, .thumb').forEach(el => el.remove());

      // استخراج پاراگراف‌ها یا لیست‌های تعاریف
      const listItems = doc.querySelectorAll('ol > li, p');
      let meanings = [];

      listItems.forEach(item => {
        let text = item.textContent.trim();
        // فیلتر کردن خطوط خیلی کوتاه یا متفرقه
        if (text.length > 3 && !text.startsWith("این صفحه") && !meanings.includes(text)) {
          meanings.push(text);
        }
      });

      if (meanings.length === 0) {
        meanings = ["توضیحات کلی:", doc.body.textContent.slice(0, 300) + "..."];
      }

      // ذخیره در حافظه
      this.saveToCache(word, meanings);

      return {
        success: true,
        source: "ویکی‌واژه (آنلاین)",
        data: meanings
      };

    } catch (err) {
      return { success: false, msg: "خطا در اتصال به شبکه یا دریافت اطلاعات." };
    }
  }
};

let allEntries = []; // نگهداری کل داده‌ها در حافظه برای سرعت بالا

// تابع نرمال‌سازی متن فارسی (یکدست‌سازی «ی/ک»، حذف اعراب و فواصل اضافی)
function normalizeText(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .replace(/[ي]/g, 'ی')
        .replace(/[ك]/g, 'ک')
        .replace(/[\u064B-\u065F\u0670]/g, '') // حذف تنوین، فتحه، ضمه، کسره و تشدید
        .replace(/[\u200B\u200C]/g, ' ')       // تبدیل نیم‌فاصله‌های نامناسب به فاصله استاندارد
        .trim();
}

// لود اولیه دیتابیس
async function loadEntries() {
    const listElement = document.getElementById('entriesList');
    try {
        const response = await fetch('data/entries.json');
        if (!response.ok) throw new Error('فایل داده‌ها پیدا نشد');
        
        allEntries = await response.json();
        
        // مرتب‌سازی اولیه کل داده‌ها بر اساس الفبای فارسی
        allEntries.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fa'));
        
        renderEntries(allEntries);
        setupSearch(); // فعال‌سازی گوش‌به‌زنگ فیلد جستجو
    } catch (error) {
        listElement.innerHTML = '<p class="error-msg">خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.</p>';
        console.error(error);
    }
}

// تابع رندر کردن و نمایش کارت‌ها در صفحه
function renderEntries(entries) {
    const listElement = document.getElementById('entriesList');
    listElement.innerHTML = '';

    if (!entries || entries.length === 0) {
        listElement.innerHTML = '<p class="no-result">موردی یافت نشد.</p>';
        return;
    }

    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <h3>${entry.title || 'بدون عنوان'}</h3>
            <p>${entry.desc || entry.description || ''}</p>
            ${entry.country ? `<small class="tag">کشور: ${entry.country}</small>` : ''}
            ${entry.creator ? `<small class="tag">اثر/نویسنده: ${entry.creator}</small>` : ''}
        `;
        listElement.appendChild(div);
    });
}

// موتور جستجوی هوشمند ترکیبی
function filterEntries(searchTerm) {
    const cleanSearch = normalizeText(searchTerm);
    
    // اگر کادر خالی شد، کل لیست بر اساس الفبا نمایش داده شود
    if (!cleanSearch) {
        renderEntries(allEntries);
        return;
    }

    // تجزیه عبارت جستجو به کلمات مجزا (مثلاً: "رودخانه" و "چین")
    // حذف کلمات توقف مانند "در"، "از"، "های"
    const stopWords = ['در', 'از', 'های', 'هایش', 'یک', 'به', 'با', 'و'];
    const searchTokens = cleanSearch
        .split(/\s+/)
        .filter(token => token.length > 0 && !stopWords.includes(token));

    const matched = allEntries.filter(entry => {
        // جمع‌آوری تمامی فیلدهای متنی مربوط به این مدخل
        const searchableFields = [
            entry.title,
            entry.desc,
            entry.description,
            entry.country,
            entry.creator,
            entry.category,
            entry.century,
            Array.isArray(entry.aliases) ? entry.aliases.join(' ') : entry.aliases,
            Array.isArray(entry.tags) ? entry.tags.join(' ') : entry.tags
        ];

        const fullText = normalizeText(searchableFields.filter(Boolean).join(' '));

        // شرط مهم: باید "تمام" کلمات کاربر در متن مدخل پیدا شوند (جستجوی AND چندمعیاره)
        return searchTokens.every(token => fullText.includes(token));
    });

    // مرتب‌سازی نتایج بر اساس حروف الفبای فارسی (الف تا ی)
    matched.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fa'));

    renderEntries(matched);
}

// اتصال فیلد جستجو به موتور فیلتر
function setupSearch() {
    // آی‌دی اینپوت جستجو در index.html (اگر نام متفاوتی دارد اینجا تغییر دهید)
    const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="text"]') || document.querySelector('input[type="search"]');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterEntries(e.target.value);
        });
    }
}

// اجرای خودکار برنامه
loadEntries();

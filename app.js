/**
 * DaneshYar - Complete & Fixed Search Engine
 */

let entries = [];
let currentFilter = 'all';

// 1. تابع پیشرفته نرمال‌سازی متن فارسی و عربی
function normalizeText(text) {
    if (!text) return '';
    return text.toString()
        .toLowerCase()
        // یکسان‌سازی ی و ک
        .replace(/[\u064A\u0649\u06CC]/g, 'ی')
        .replace(/[\u0643\u06A9]/g, 'ک')
        .replace(/\u0626/g, 'ی')
        .replace(/\u0629/g, 'ه')
        .replace(/[\u0622\u0623\u0625]/g, 'ا')
        // حذف اعراب و تنوین
        .replace(/[\u064B-\u065F\u0670]/g, '')
        // تبدیل نیم‌فاصله و فواصل خاص به فاصله معمولی
        .replace(/[\u200C\u200B\u00A0\t\r\n]+/g, ' ')
        // حذف نشانه‌گذاری‌های اضافه
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،«»"']/g, ' ')
        .trim();
}

// 2. کلمات توقف فارسی
const stopWords = new Set([
    'از', 'به', 'در', 'با', 'که', 'و', 'برای', 'این', 'آن', 'را', 'تا', 'یک', 'یا', 'است', 'بود', 'شد'
]);

// 3. بارگذاری داده‌های دانشنامه و دیتابیس جدول
async function initData() {
    try {
        const response = await fetch('data/entries.json');
        if (response.ok) {
            entries = await response.json();
        }
    } catch (e) {
        console.warn('توجه: فایل entries.json بارگذاری نشد یا از حالت لوکال استفاده می‌شود.');
    }
}

// 4. موتور جستجوی هوشمند
function searchEngine(query, mode = 'all') {
    const rawTokens = normalizeText(query).split(/\s+/).filter(t => t.length > 0);
    const tokens = rawTokens.filter(t => !stopWords.has(t));
    const searchTokens = tokens.length > 0 ? tokens : rawTokens;

    if (searchTokens.length === 0) return { entries: [], crosswords: [] };

    let matchedEntries = [];
    let matchedCrosswords = [];

    // الف) جستجو در دانشنامه (entries.json)
    if (mode === 'all' || mode === 'encyclopedia') {
        matchedEntries = entries.filter(item => {
            const searchCorpus = normalizeText([
                item.title_fa || '',
                item.title_en || '',
                item.category_fa || '',
                item.content_fa || '',
                item.content_en || '',
                Array.isArray(item.keywords) ? item.keywords.join(' ') : ''
            ].join(' '));

            // بررسی حضور تمام کلمات جستجو شده در متن
            return searchTokens.every(token => searchCorpus.includes(token));
        });
    }

    // ب) جستجو در دیتابیس کلمات و جدول (data.js)
    if (mode === 'all' || mode === 'crossword') {
        if (typeof wordsDatabase !== 'undefined' && Array.isArray(wordsDatabase)) {
            matchedCrosswords = wordsDatabase.filter(item => {
                const corpus = normalizeText((item.word || '') + ' ' + (item.clue || ''));
                return searchTokens.every(token => corpus.includes(token));
            });
        }
    }

    return { entries: matchedEntries, crosswords: matchedCrosswords };
}

// 5. نمایش نتایج در صفحه
function displayResults(results) {
    // سازگاری با هر دو آیدی نتیجه
    const container = document.getElementById('resultsContainer') || document.getElementById('result') || document.getElementById('entriesList');
    if (!container) return;

    container.innerHTML = '';

    const totalCount = results.entries.length + results.crosswords.length;

    if (totalCount === 0) {
        container.innerHTML = '<div class="no-results" style="text-align:center; padding:20px; color:#777;">موردی یافت نشد.</div>';
        return;
    }

    // رندر بخش کلمات جدولی
    if (results.crosswords.length > 0) {
        const cwSection = document.createElement('div');
        cwSection.className = 'section-crosswords';
        cwSection.innerHTML = '<h3 style="margin: 10px 0; color:#2c3e50;">💡 نتایج حل جدول و لغات</h3>';

        results.crosswords.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#fdfefe; border:1px solid #dcdde1; border-right:4px solid #3498db; border-radius:6px; padding:12px; margin-bottom:8px;';
            card.innerHTML = `
                <div style="font-weight:bold; font-size:1.1em; color:#2980b9;">${item.word || ''}</div>
                <div style="color:#555; margin-top:4px;">${item.clue || ''}</div>
            `;
            cwSection.appendChild(card);
        });
        container.appendChild(cwSection);
    }

    // رندر بخش مدخل‌های دانشنامه
    if (results.entries.length > 0) {
        const entrySection = document.createElement('div');
        entrySection.className = 'section-encyclopedia';
        entrySection.innerHTML = '<h3 style="margin: 15px 0 10px 0; color:#2c3e50;">📚 نتایج دانشنامه</h3>';

        results.entries.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#fff; border:1px solid #e1e8ed; border-right:4px solid #2ecc71; border-radius:6px; padding:12px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.05);';
            
            const categoryBadge = item.category_fa ? `<span style="font-size:0.8em; background:#e8f8f5; color:#16a085; padding:2px 8px; border-radius:4px; margin-right:8px;">${item.category_fa}</span>` : '';
            const titleEn = item.title_en ? `<span style="font-size:0.85em; color:#888; margin-right:6px;">(${item.title_en})</span>` : '';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0; font-size:1.15em; color:#2c3e50;">${item.title_fa || ''} ${titleEn}</h4>
                    ${categoryBadge}
                </div>
                <p style="color:#444; line-height:1.6; margin:8px 0 0 0; font-size:0.95em;">
                    ${item.content_fa || item.content_en || ''}
                </p>
            `;
            entrySection.appendChild(card);
        });
        container.appendChild(entrySection);
    }
}

// 6. تابع فراخوانی جستجو
function performSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const query = input.value.trim();
    if (!query) {
        const container = document.getElementById('resultsContainer') || document.getElementById('result') || document.getElementById('entriesList');
        if (container) container.innerHTML = '';
        return;
    }
    const results = searchEngine(query, currentFilter);
    displayResults(results);
}

// 7. اتصال رویدادها پس از لود کامل صفحه
document.addEventListener('DOMContentLoaded', () => {
    initData();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // دکمه‌های فیلتر (در صورت وجود)
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            performSearch();
        });
    });
});

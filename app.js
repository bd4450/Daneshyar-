let entries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentLang = localStorage.getItem('lang') || 'fa';

const searchInput = document.getElementById('search-input');
const entriesList = document.getElementById('entries-list');
const favoritesList = document.getElementById('favorites-list');

// اصلاح مسیر: فایل مستقیماً در ریشه است، نه در پوشه data
async function loadEntries() {
    try {
        const response = await fetch("entries.json");
        entries = await response.json();
        renderEntries(entries);
    } catch (error) {
        console.error("خطا در بارگذاری اطلاعات:", error);
    }
}

function renderEntries(data) {
    entriesList.innerHTML = '';
    data.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <h3>${currentLang === 'fa' ? entry.title : entry.titleEn}</h3>
            <p>${currentLang === 'fa' ? entry.desc : entry.descEn}</p>
        `;
        entriesList.appendChild(div);
    });
}

// راه اندازی اولیه
document.addEventListener('DOMContentLoaded', loadEntries);
۵

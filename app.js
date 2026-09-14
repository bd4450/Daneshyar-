async function loadEntries() {
    const listElement = document.getElementById('entriesList');
    try {
        const response = await fetch('data/entries.json');
        if (!response.ok) throw new Error('فایل داده‌ها پیدا نشد');
        
        const entries = await response.json();
        listElement.innerHTML = ''; // پاک کردن متن "در حال بارگذاری"

        entries.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'entry-card';
            div.innerHTML = `
                <h3>${entry.title}</h3>
                <p>${entry.desc}</p>
            `;
            listElement.appendChild(div);
        });
    } catch (error) {
        listElement.innerHTML = '<p>خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.</p>';
        console.error(error);
    }
}

// اجرای تابع هنگام باز شدن صفحه
loadEntries();

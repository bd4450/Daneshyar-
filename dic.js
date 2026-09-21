// ۱. محتوای کامل dehkhoda.js را اینجا کپی و پیست کنید

// ۲. محتوای کامل amid.js را بلافاصله زیر آن پیست کنید

// ۳. محتوای کامل moein.js را بلافاصله زیر آن پیست کنید

// ۴. محتوای کامل abadis.js را بلافاصله زیر آن پیست کنید


// در انتهای فایل dic.js (خط آخر)، دقیقاً این تکه کد را اضافه کنید:
(function() {
    window.DIC = [];
    const pushData = (arr, source) => {
        if (!arr || !Array.isArray(arr)) return;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            let w = item.word || item.w || item.title || item.term || (Array.isArray(item) ? item[0] : "");
            let m = item.meaning || item.m || item.def || item.desc || (Array.isArray(item) ? item[1] : "");
            if (w) window.DIC.push({ w: String(w), m: String(m), src: source });
        }
    };
    if (typeof dehkhoda !== 'undefined') pushData(dehkhoda, 'دهخدا');
    if (typeof amid !== 'undefined') pushData(amid, 'عمید');
    if (typeof moein !== 'undefined') pushData(moein, 'معین');
    if (typeof abadis !== 'undefined') pushData(abadis, 'آبادیس');
})();

/* ============================================
   lang.js — Language Detection & Toggle
   ============================================

   Logic:
   1. ถ้ามี saved preference ใน localStorage → ใช้ค่านั้น
   2. ถ้าไม่มี → ดึง IP geolocation (ipapi.co)
   3. Fallback → ใช้ browser language
   4. Default → English

   ============================================ */

(function () {
  /* ── Apply language to <body> ── */
  function applyLang(lang) {
    const isEn = lang === 'en';
    document.body.classList.toggle('en', isEn);
    document.getElementById('btn-th').classList.toggle('active', !isEn);
    document.getElementById('btn-en').classList.toggle('active',  isEn);
    document.documentElement.setAttribute('lang', isEn ? 'en' : 'th');
  }

  /* ── Public: called by toggle buttons ── */
  window.setLang = function (lang) {
    localStorage.setItem('resume_lang', lang);
    applyLang(lang);
  };

  /* ── Boot: detect language ── */
  async function detectLang() {
    // 1. Saved preference
    const saved = localStorage.getItem('resume_lang');
    if (saved === 'th' || saved === 'en') { applyLang(saved); return; }

    try {
      // 2. IP geolocation (free, no key needed)
      const res  = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const cc   = (data.country_code || '').toUpperCase();
      applyLang(cc === 'TH' ? 'th' : 'en');
    } catch {
      // 3. Browser language fallback
      const bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
      applyLang(bl.startsWith('th') ? 'th' : 'en');
    }
  }

  detectLang();
})();

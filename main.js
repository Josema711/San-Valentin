/* main.js — utilidades compartidas para el proyecto */
(function(){
  'use strict';

  function ensureSessionToken() {
    try {
      let t = sessionStorage.getItem('sv_token');
      if (!t) {
        t = Date.now().toString(36) + Math.random().toString(36).slice(2,12);
        sessionStorage.setItem('sv_token', t);
      }
      return t;
    } catch (e) {
      return Date.now().toString(36) + Math.random().toString(36).slice(2,12);
    }
  }

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function getViewportMetrics() {
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        offsetLeft: window.visualViewport.offsetLeft || 0,
        offsetTop: window.visualViewport.offsetTop || 0,
      };
    }
    return { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
  }

  function clampElementIntoViewport(el, padding = 12) {
    if (!el || typeof el.getBoundingClientRect !== 'function') return;
    const vp = getViewportMetrics();
    const rect = el.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    let left = parseFloat(el.style.left) || rect.left;
    let top = parseFloat(el.style.top) || rect.top;
    const maxX = Math.max(vp.width - w - padding, padding);
    const maxY = Math.max(vp.height - h - padding, padding);
    left = Math.min(Math.max(left, padding), maxX);
    top = Math.min(Math.max(top, padding), maxY);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  // Exponer en window para reutilizar desde los HTML
  window.ensureSessionToken = ensureSessionToken;
  // main.js — shared utilities + index page behaviour
  (function(){
    'use strict';

    // Session token helper
    function ensureSessionToken() {
      try {
        let t = sessionStorage.getItem('sv_token');
        if (!t) {
          t = Date.now().toString(36) + Math.random().toString(36).slice(2,12);
          sessionStorage.setItem('sv_token', t);
        }
        return t;
      } catch (e) {
        return Date.now().toString(36) + Math.random().toString(36).slice(2,12);
      }
    }

    function pad(num) { return String(num).padStart(2, '0'); }

    function getViewportMetrics() {
      if (window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height,
          offsetLeft: window.visualViewport.offsetLeft || 0,
          offsetTop: window.visualViewport.offsetTop || 0,
        };
      }
      return { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
    }

    function clampElementIntoViewport(el, padding = 12) {
      if (!el || typeof el.getBoundingClientRect !== 'function') return;
      const vp = getViewportMetrics();
      const rect = el.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      let left = parseFloat(el.style.left) || rect.left;
      let top = parseFloat(el.style.top) || rect.top;
      const maxX = Math.max(vp.width - w - padding, padding);
      const maxY = Math.max(vp.height - h - padding, padding);
      left = Math.min(Math.max(left, padding), maxX);
      top = Math.min(Math.max(top, padding), maxY);
      el.style.left = left + 'px';
      el.style.top = top + 'px';
    }

    // Index page behaviour: move 'No' button, countdown and password flow
    function initIndexPage() {
      const noBtn = document.getElementById('no');
      const countdownEl = document.getElementById('countdown');
      const passwordBox = document.getElementById('passwordBox');
      const targetDate = new Date('2026-02-14T14:30:00');

      function ensureFixedPosition(el) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed') {
          const rect = el.getBoundingClientRect();
          const prevTransition = el.style.transition;
          el.style.transition = 'none';
          el.style.position = 'fixed';
          el.style.left = rect.left + 'px';
          el.style.top = rect.top + 'px';
          el.style.zIndex = '9999';
          void el.offsetWidth;
          el.style.transition = prevTransition || 'left 0.4s cubic-bezier(.2,.9,.2,1), top 0.4s cubic-bezier(.2,.9,.2,1), transform 0.25s ease';
        }
      }

      function moveNoButtonRandomly() {
        if (!noBtn) return;
        ensureFixedPosition(noBtn);
        const btnRect = noBtn.getBoundingClientRect();
        const btnW = btnRect.width; const btnH = btnRect.height; const padding = 12;
        const vp = getViewportMetrics();
        const maxX = Math.max(vp.width - btnW - padding, padding);
        const maxY = Math.max(vp.height - btnH - padding, padding);
        const randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
        const randomY = Math.floor(Math.random() * (maxY - padding)) + padding;
        const leftPos = (vp.offsetLeft || 0) + randomX;
        const topPos = (vp.offsetTop || 0) + randomY;
        noBtn.style.left = leftPos + 'px';
        noBtn.style.top = topPos + 'px';
        noBtn.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
      }

      if (noBtn) {
        noBtn.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') moveNoButtonRandomly(); });
        noBtn.addEventListener('pointerdown', (e) => { moveNoButtonRandomly(); }, {passive:true});
      }

      function clampNoButtonIntoViewport() {
        if (!noBtn) return;
        ensureFixedPosition(noBtn);
        clampElementIntoViewport(noBtn, 12);
      }

      window.addEventListener('resize', clampNoButtonIntoViewport);

      function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (diff > 0) countdownEl.textContent = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`; else countdownEl.textContent = '00:00:00:00';
        if (typeof window.getMessage === 'function') {
          if (diff <= 0) passwordBox.textContent = getMessage('index.password_full');
          else if (days === 0) passwordBox.textContent = getMessage('index.password_day0');
          else if (days === 1) passwordBox.textContent = getMessage('index.password_day1');
          else if (days === 2) passwordBox.textContent = getMessage('index.password_day2');
          else if (days === 3) passwordBox.textContent = getMessage('index.password_day3');
          else passwordBox.textContent = '';
        }
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);

      // Expose functions used by inline attributes
      function sayYes() {
        document.body.innerHTML = `
          <div style="height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #fdfaf6, #f5efe8);font-family:'Segoe UI', system-ui, sans-serif;text-align:center;flex-direction: column;">
            <h1 style="font-size:2.5rem; color:#c72c41; margin-bottom: 20px;">${typeof getMessage === 'function' ? getMessage('index.sayYes_header') : 'Sabía que dirías que sí'}</h1>
            <div style="margin-top:20px; display:flex; gap:10px; justify-content:center;">
              <input id="passwordInput" type="text" placeholder="${typeof getMessage === 'function' ? getMessage('index.input_placeholder') : 'Introduce la contraseña'}" style="padding:12px 20px;border-radius:30px;border:2px solid #c72c41;font-size:16px;outline:none;" />
              <button id="tryBtn" onclick="checkPassword()" style="padding:12px 25px;font-size:16px;border-radius:30px;border:none;cursor:pointer;background:#c72c41;color:#fdfaf6;transition:all 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${typeof getMessage === 'function' ? getMessage('index.try_button') : 'Probar'}</button>
            </div>
            <p id="result" style="margin-top:20px; color:#c72c41; font-size:1rem;"></p>
          </div>`;
      }

      function checkPassword() {
        const inputEl = document.getElementById('passwordInput');
        const tryBtn = document.getElementById('tryBtn');
        const result = document.getElementById('result');
        const correctPassword = '07022026';
        if (inputEl) inputEl.disabled = true;
        if (tryBtn) tryBtn.disabled = true;
        const overlay = document.createElement('div'); overlay.className = 'spinner-overlay'; overlay.innerHTML = '<div class="spinner" aria-hidden="true"></div>'; document.body.appendChild(overlay);
        const value = String(inputEl ? inputEl.value : '').trim();
        setTimeout(() => {
          if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
          if (value === correctPassword) {
            const path = 'doble_&_gilda.html';
            const token = ensureSessionToken();
            const sep = path.indexOf('?') === -1 ? '?' : '&';
            const url = path + sep + 'sv=' + encodeURIComponent(token);
            window.location.href = url;
          } else {
            if (inputEl && inputEl.parentNode) inputEl.parentNode.removeChild(inputEl);
            if (tryBtn && tryBtn.parentNode) tryBtn.parentNode.removeChild(tryBtn);
            if (result) result.textContent = (typeof getMessage === 'function') ? getMessage('index.result_wait') : 'Ten paciencia… mañana tendrás otra palabra';
          }
        }, 1400);
      }

      // expose
      window.sayYes = sayYes;
      window.checkPassword = checkPassword;
    }

    document.addEventListener('DOMContentLoaded', function(){ if (document.body && document.body.classList.contains('index-page')) initIndexPage(); });

    // Exponer en window para reutilizar desde los HTML
    window.ensureSessionToken = ensureSessionToken;
    window.pad = pad;
    window.getViewportMetrics = getViewportMetrics;
    window.clampElementIntoViewport = clampElementIntoViewport;
  })();
})();

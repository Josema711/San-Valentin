// Gate cliente simple (NO seguro). Cambia GATE_PASSWORD a lo que quieras.
(function(){
  const GATE_PASSWORD = '123'; // Cambia aquí la contraseña de la puerta pública
  const STORAGE_KEY = 'sv_token';

  function generateToken() {
    // generar token aleatorio de al menos 50 caracteres (base64url de 40 bytes -> 56 chars)
    try {
      const bytes = new Uint8Array(40);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
      }
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      let b64 = btoa(binary);
      // base64 -> base64url (replace +/ and remove =)
      b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return b64;
    } catch (e) {
      // fallback
      return Date.now().toString(36) + Math.random().toString(36).repeat(6);
    }
  }

  function setToken(t) {
    try { sessionStorage.setItem(STORAGE_KEY, t); } catch(e) {}
  }

  function getToken() {
    try { return sessionStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  function showGate() {
    // crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML = `
      <div class="gate-box" role="dialog" aria-modal="true">
        <h3 style="margin:0 0 10px;color:#c72c41;">Acceso</h3>
        <p style="margin:0 0 12px;color:#555;">Introduce la contraseña para continuar.</p>
        <input id="_gate_input" type="password" placeholder="Contraseña" aria-label="Contraseña" />
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;">
          <button id="_gate_ok">Entrar</button>
        </div>
        <p id="_gate_msg" style="color:#c72c41;margin-top:10px;display:none;"></p>
      </div>
    `;

    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';

    const input = document.getElementById('_gate_input');
    const ok = document.getElementById('_gate_ok');
    const msg = document.getElementById('_gate_msg');

    function cleanup() {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.documentElement.style.overflow = ''; // restaurar
      // generar token de sesión
      const token = generateToken();
      setToken(token);
    }

    function tryPassword() {
      const v = input.value.trim();
      if (v === GATE_PASSWORD) {
        cleanup();
      } else {
        msg.style.display = 'block';
        msg.textContent = 'Contraseña incorrecta';
        input.value = '';
        input.focus();
      }
    }

    ok.addEventListener('click', tryPassword);
    input.addEventListener('keydown', function(e){ if(e.key === 'Enter') tryPassword(); });
    input.focus();
  }

  function openPathWithToken(path, target) {
    const token = getToken() || generateToken();
    setToken(token);
    const sep = path.indexOf('?') === -1 ? '?' : '&';
    const url = path + sep + 'sv=' + encodeURIComponent(token);
    return window.open(url, target || '_blank');
  }

  function showNoAccessOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML = `
      <div class="gate-box" role="dialog" aria-modal="true">
        <h3 style="margin:0 0 10px;color:#c72c41;">Sin acceso</h3>
        <p style="margin:0 0 12px;color:#555;">No tienes acceso a esta página. Vuelve a la página anterior.</p>
      </div>
    `;
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
  }

  function checkAccess() {
    // Comprueba query param 'sv' y sessionStorage
    const params = new URLSearchParams(location.search);
    const sv = params.get('sv');
    const token = getToken();
    if (sv && token && sv === token) return true;
    if (sv && !token) {
      // aceptar sv y guardarlo en sessionStorage
      setToken(sv);
      return true;
    }
    // si no hay sv en url, pero sí token en sessionStorage, permitir
    if (!sv && token) return true;
    return false;
  }

  // Exponer funciones globalmente
  window.openPathWithToken = openPathWithToken;
  window.checkAccess = checkAccess;
  window.showNoAccessOverlay = showNoAccessOverlay;
  window.createToken = function(){ const t = generateToken(); setToken(t); return t; };
  // Permite que otras partes del sitio obtengan la contraseña configurada (fallback seguro opcional)
  window.getGatePassword = function(){ return GATE_PASSWORD; };
  // Exponer función para forzar la apertura del overlay desde la consola en caso de caché/errores
  window.forceShowGate = function(){ try { showGate(); } catch(e) { console.error('forceShowGate error', e); } };

  // Ejecutar puerta en la página principal.
  // En GitHub Pages la página raíz no siempre muestra '/index.html', así que detectamos
  // tanto la clase `index-page` en el `<body>` como rutas que terminen en '/' o en 'index.html'.
  function isAutoShowPage() {
    // Auto-mostrar solo en la página principal (index) y en `ruta.html`.
    try {
      if (typeof document !== 'undefined' && document.body) {
        if (document.body.classList.contains('index-page')) return true;
      }
    } catch (e) {}
    const p = (location && location.pathname) ? String(location.pathname) : '';
    // index.html explicitly or site root
    if (/(^|\/)index\.html?$/.test(p) || p === '/') return true;
    // ruta.html explicitly
    if (/(^|\/)ruta\.html?$/.test(p)) return true;
    return false;
  }

  if (isAutoShowPage()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showGate);
    } else {
      showGate();
    }
  }
})();

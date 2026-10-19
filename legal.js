/* Datos del titular: se muestran en todas las páginas legales. Completar aquí
   (un solo lugar) y actualizar CV_LEGAL.version en consent.js si cambia algo de fondo. */
window.CV_TITULAR = {
  razon:     '',                                   // Razón social, p. ej. «Inversiones Casa Verde, C.A.»
  rif:       '',                                   // RIF J-XXXXXXXX-X
  email:     '',                                   // Correo para reservas y privacidad
  whatsapp:  '+58 412-303-0330'
};

(function () {
  var t = window.CV_TITULAR;
  var faltan = { razon: 'razón social', rif: 'RIF', email: 'correo' };
  var falEn = { razon: 'company name', rif: 'RIF (tax ID)', email: 'email' };

  function fill(lang) {
    document.querySelectorAll('[data-f]').forEach(function (el) {
      var k = el.dataset.f, v = t[k];
      el.classList.toggle('pend', !v);
      el.textContent = v || '[' + ((lang === 'en' ? falEn : faltan)[k] || k) + (lang === 'en' ? ' pending]' : ' pendiente]');
    });
  }

  function setLang(l) {
    document.querySelectorAll('[data-lang]').forEach(function (a) { a.hidden = a.dataset.lang !== l; });
    document.querySelectorAll('.lg-lang button').forEach(function (b) { b.classList.toggle('active', b.dataset.lc === l); });
    document.querySelectorAll('[data-es]').forEach(function (el) { el.textContent = el.dataset[l]; });
    document.documentElement.lang = l;
    var h = document.querySelector('[data-lang="' + l + '"] h1');
    if (h) document.title = h.textContent + ' — Casa Verde';
    fill(l);
    try { localStorage.setItem('cv-lang', l); } catch (e) {}
  }

  var lang = 'es';
  try { lang = localStorage.getItem('cv-lang') || 'es'; } catch (e) {}
  setLang(lang === 'en' ? 'en' : 'es');
  document.querySelectorAll('.lg-lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lc); });
  });

  /* Política de cookies: retirar el consentimiento del mapa de Google */
  document.querySelectorAll('[data-revoke]').forEach(function (b) {
    var out = b.parentNode.querySelector('.lg-ok');
    function state() {
      var on = window.cvConsent && window.cvConsent.cookies() === 'maps';
      var en = document.documentElement.lang === 'en';
      out.textContent = on ? (en ? 'Status: Google Maps accepted on this browser.' : 'Estado: mapa de Google aceptado en este navegador.')
                           : (en ? 'Status: Google Maps not accepted (it will not load).' : 'Estado: mapa de Google no aceptado (no se carga).');
    }
    b.addEventListener('click', function () { if (window.cvConsent) window.cvConsent.setCookies(null); state(); });
    document.querySelectorAll('.lg-lang button').forEach(function (x) { x.addEventListener('click', state); });
    state();
  });
})();

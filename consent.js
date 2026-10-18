/* ── Consentimientos ──
   Versión vigente de los documentos legales y URL del registro (Google Apps Script,
   ver legal/README.md). Cada aceptación se envía con fecha/hora, zona horaria, idioma,
   versión y una referencia única que viaja en el WhatsApp. */
window.CV_LEGAL = { version: '2026-10-18', endpoint: '' };
window.cvConsent = (function () {
  var KEY = 'cv-cookies';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function newId() {
    var r = (window.crypto && crypto.randomUUID) ? crypto.randomUUID().replace(/-/g, '') : Math.random().toString(16).slice(2) + Date.now().toString(16);
    return 'CV-' + r.slice(0, 8).toUpperCase();
  }
  function log(rec) {
    var data = { id: newId(), ts: new Date().toISOString(), tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
      lang: document.documentElement.lang, version: window.CV_LEGAL.version, page: location.href.split('#')[0].split('?')[0],
      ua: navigator.userAgent };
    for (var k in rec) data[k] = rec[k];
    var url = window.CV_LEGAL.endpoint;
    if (url) {
      var body = JSON.stringify(data);
      try {
        if (!(navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))))
          fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });
      } catch (e) {}
    }
    return data.id;
  }
  return {
    log: log,
    cookies: function () { return get(KEY); },
    setCookies: function (v) { set(KEY, v); log({ type: 'cookies', choice: v || 'retirado' }); }
  };
})();

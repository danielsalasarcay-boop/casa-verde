/**
 * Casa Verde — Registro de consentimientos (Google Apps Script).
 *
 * Recibe cada aceptación enviada por el sitio (index.html → window.cvConsent.log)
 * y la guarda como una fila en la hoja "Consentimientos". Cada fila lleva la huella
 * SHA-256 de su contenido encadenada con la de la fila anterior: si una fila se
 * borra o se modifica después, la cadena deja de cuadrar (ver verificarCadena()).
 *
 * Instalación: ver legal/README.md.
 */
const HOJA = 'Consentimientos';
const COLUMNAS = [
  'recibido_servidor', 'referencia', 'tipo', 'fecha_hora_cliente', 'zona_horaria', 'idioma',
  'version_documentos', 'pagina', 'acepta_terminos', 'texto_terminos', 'documento_terminos',
  'acepta_privacidad', 'texto_privacidad', 'documento_privacidad', 'eleccion_cookies',
  'llegada', 'salida', 'huespedes', 'navegador', 'huella_anterior', 'huella'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!/^CV-[0-9A-F]{8}$/.test(d.id || '') || ['reserva', 'cookies'].indexOf(d.type) < 0) {
      return ContentService.createTextOutput('rechazado');
    }
    const corto = (v, n) => (v === undefined || v === null) ? '' : String(v).slice(0, n || 300);
    const hoja = obtenerHoja_();
    const ultima = hoja.getLastRow();
    const anterior = ultima > 1 ? String(hoja.getRange(ultima, COLUMNAS.length).getValue()) : 'GENESIS';
    const fila = [
      new Date().toISOString(), corto(d.id, 12), corto(d.type, 20), corto(d.ts, 40), corto(d.tz, 60), corto(d.lang, 5),
      corto(d.version, 20), corto(d.page, 200), d.terms === true ? 'SI' : '', corto(d.termsText), corto(d.termsDoc, 60),
      d.privacy === true ? 'SI' : '', corto(d.privacyText), corto(d.privacyDoc, 60), corto(d.choice, 20),
      corto(d.checkin, 20), corto(d.checkout, 20), corto(d.guests, 4), corto(d.ua, 400), anterior
    ];
    fila.push(sha256_(anterior + '|' + fila.join('|')));
    hoja.appendRow(fila);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

/** Comprueba que ninguna fila fue alterada o borrada. Ejecutar desde el editor. */
function verificarCadena() {
  const filas = obtenerHoja_().getDataRange().getValues().slice(1);
  let anterior = 'GENESIS';
  for (let i = 0; i < filas.length; i++) {
    const f = filas[i].map(String);
    const huella = f.pop();
    if (f[f.length - 1] !== anterior || sha256_(anterior + '|' + f.join('|')) !== huella) {
      Logger.log('Cadena rota en la fila ' + (i + 2));
      return false;
    }
    anterior = huella;
  }
  Logger.log('Cadena íntegra: ' + filas.length + ' registros.');
  return true;
}

function obtenerHoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
    hoja.getRange('A:Z').setNumberFormat('@');   // todo como texto: la huella no cambia por formatos
  }
  return hoja;
}

function sha256_(texto) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, texto, Utilities.Charset.UTF_8)
    .map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
}

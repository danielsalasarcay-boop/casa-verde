# Registro de consentimientos — instalación (5 minutos)

El sitio es estático, así que cada aceptación (casillas del formulario de reserva y
consentimiento del mapa de Google) se envía a una hoja de Google Sheets tuya.

1. Entra a <https://sheets.new> con la cuenta de Google de Casa Verde y nombra la hoja
   **«Casa Verde — Consentimientos»**.
2. Menú **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de
   `registro-consentimientos.gs`. Guarda (icono del disquete).
3. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   Pulsa **Implementar**, autoriza los permisos y copia la **URL de la aplicación web**
   (termina en `/exec`).
4. Pega esa URL en `consent.js`, en `window.CV_LEGAL = { …, endpoint: 'AQUÍ' }`
   (o pásasela a Claude para que la ponga y publique).

## Qué guarda cada fila

Referencia única (`CV-XXXXXXXX`, la misma que llega en el WhatsApp), tipo de
consentimiento, fecha y hora (del servidor de Google y del navegador, con zona
horaria), idioma, versión de los documentos aceptados, texto exacto de cada casilla,
fechas y huéspedes solicitados, navegador, y una huella SHA-256 encadenada con la fila
anterior. **No** guarda nombre, teléfono, correo ni IP: el sitio no los pide.

Para demostrar un consentimiento: busca la referencia del chat de WhatsApp en la hoja.
Para comprobar que nadie alteró el registro: en Apps Script ejecuta `verificarCadena`.

## Versiones de los documentos

`window.CV_LEGAL.version` (en `consent.js`) es la fecha de la versión vigente de los
documentos legales. Al cambiar cualquier documento, actualiza esa fecha y la de
«Última actualización» en la página; el historial de git conserva cada versión.

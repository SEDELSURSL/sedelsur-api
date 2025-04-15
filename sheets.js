
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const SPREADSHEET_ID = '1ul32Jb6aBeU-TVpACW3xoz5dGdSK_rZoferQshZhWss';
const SHEET_NAME = 'Hoja 1';

async function buscarEnHoja(mensaje) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const respuesta = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME
  });

  const filas = respuesta.data.values;
  const encabezados = filas[0];
  const datos = filas.slice(1);

  const coincidencias = datos.filter(row =>
    row.some(cell => cell && mensaje.toLowerCase().includes(cell.toLowerCase()))
  );

  if (!coincidencias.length) {
    return '❌ No se encontró ningún artículo relacionado con esa descripción.';
  }

  const respuestas = coincidencias.slice(0, 3).map(row => {
    const ref = row[encabezados.indexOf('Referencia')];
    const desc = row[encabezados.indexOf('Descripción ')];
    const precio = row[encabezados.indexOf('P.V.P.')];
    return `✅ *${desc}* (Ref: *${ref}*)\n💶 Precio neto: *${precio} €*`;
  });

  return `A continuación, los artículos encontrados:\n\n${respuestas.join('\n\n')}`;
}

module.exports = { buscarEnHoja };

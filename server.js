console.log("API Sedelsur iniciada");

const express = require('express');
const bodyParser = require('body-parser');
const { buscarEnHoja } = require('./sheets');
const app = express();
app.use(bodyParser.json());

app.post('/precio', async (req, res) => {
  const consulta = req.body.mensaje || '';
  try {
    const resultado = await buscarEnHoja(consulta);
    res.json({ respuesta: resultado });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar la solicitud', detalle: err.toString() });
  }
});

app.get('/', (req, res) => {
  res.send('API Sedelsur funcionando.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

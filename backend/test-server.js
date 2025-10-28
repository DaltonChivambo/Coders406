const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Servidor funcionando' });
});

app.listen(5000, () => {
  console.log('Servidor de teste rodando na porta 5000');
});


// Application bootstrap: wiring only; feature logic lives below this layer.
const express = require('express');
const studentRoutes = require('./routes/students');
const app = express();
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', phase: 'prototype' }));
app.use('/api/students', studentRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`PathFinder API listening at http://localhost:${port}`));
}
module.exports = app;

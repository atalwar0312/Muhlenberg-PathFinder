// Application bootstrap: wiring only; feature logic lives below this layer.

const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/students');

const app = express();

app.use(express.json());

// Backend API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', phase: 'prototype' });
});

app.use('/api/students', studentRoutes);

// Serve the PathFinder frontend
const frontendPath = path.join(__dirname, '../frontend/UI');

app.use(express.static(frontendPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, '0.0.0.0', () => {
    console.log(`PathFinder API listening on port ${port}`);
  });
}

module.exports = app;
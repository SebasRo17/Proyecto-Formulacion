// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
// Soporte para application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Config CORS para prod y dev
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://proyecto-formulacion.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Puertos adicionales para desarrollo
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origin (como Postman o health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/payrolls', require('./routes/payroll.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/ai-insights', require('./routes/aiinsight.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.get('/health', (req, res) => res.status(200).send('ok'));




app.get('/', (req, res) => {
  res.send('API PaySmart funcionando ✅');
});

module.exports = app;

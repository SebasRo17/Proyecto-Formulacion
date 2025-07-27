// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/payrolls', require('./routes/payroll.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));


app.get('/', (req, res) => {
  res.send('API PaySmart funcionando ✅');
});

module.exports = app;

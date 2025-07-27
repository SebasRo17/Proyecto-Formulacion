// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/auth', require('./routes/auth.routes'));


app.get('/', (req, res) => {
  res.send('API PaySmart funcionando ✅');
});

module.exports = app;

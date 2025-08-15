const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { type: String, default: 'active' }, // 'active' o 'inactive'
  cedula: { type: String, required: true },
  phone: String,
  address: String,
  avatar: String,
  // Saldos de vacaciones (modo académico)
  vacationBalance: { type: Number, default: 0 },
  vacationUpdatedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);

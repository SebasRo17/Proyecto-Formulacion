const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  period: { type: String, required: true }, // Ej: "Enero 2024"
  employees: [
    {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
      grossAmount: { type: Number, required: true },
      deductions: { type: Number, required: true },
      netAmount: { type: Number, required: true }
    }
  ],
  totalGross: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  totalNet: { type: Number, required: true },
  status: { type: String, default: 'draft' }, // draft, processing, approved, paid
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);

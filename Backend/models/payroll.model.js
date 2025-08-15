const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  period: { type: String, required: true }, // Ej: "Enero 2024" o "Décimos 2024"
  type: { type: String, enum: ['monthly', 'decimos', 'liquidacion', 'otros'], default: 'monthly' },
  params: { type: mongoose.Schema.Types.Mixed }, // Parámetros académicos (SBU, % etc)
  employees: [
    {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
      grossAmount: { type: Number, required: true },
      deductions: { type: Number, required: true },
      netAmount: { type: Number, required: true },
      concepts: [
        {
          type: { type: String }, // decimo_tercero, decimo_cuarto, vacaciones, liquidacion, bono, horas_extra, deduccion
          label: { type: String },
          category: { type: String, enum: ['earning', 'deduction'], default: 'earning' },
          amount: { type: Number, required: true },
          source: { type: String }, // calculator|manual
          meta: { type: mongoose.Schema.Types.Mixed }
        }
      ]
    }
  ],
  totalGross: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  totalNet: { type: Number, required: true },
  status: { type: String, default: 'draft' }, // draft, processing, approved, paid
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);

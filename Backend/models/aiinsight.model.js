const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  // Claves principales
  companyId: { type: String, index: true },
  period: { type: String, index: true }, // YYYY-MM
  id: { type: String }, // opcional si el modelo propone; usamos _id como UUID

  // Contrato Insight
  type: { type: String, required: true },
  severity: { type: String, enum: ['low','medium','high','critical'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  confidence: { type: Number, min: 0, max: 1, required: true },
  affectedEmployeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  sourceMetrics: [{ type: String }],
  recommendedAction: { type: String },
  rationale: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Orquestación y auditoría
  status: { type: String, enum: ['new','reviewed','applied','dismissed','resolved'], default: 'new', index: true },
  inputHash: { type: String, index: true },
  model: { type: String },
  promptVersion: { type: String },
  notes: [{ note: String, at: Date }],
  usefulnessScore: { type: Number, min: 0, max: 1 },
}, { timestamps: true });

aiInsightSchema.index({ companyId: 1, period: 1, severity: 1 });
aiInsightSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AIInsight', aiInsightSchema);

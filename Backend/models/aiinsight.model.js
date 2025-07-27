const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  type: String, // 'turnover_prediction', 'cost_optimization', etc.
  title: String,
  description: String,
  severity: String, // 'high', 'medium', 'low'
  confidence: Number, // Porcentaje de confianza
  recommendations: [String],
  affectedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);

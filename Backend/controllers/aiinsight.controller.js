const AIInsight = require('../models/aiinsight.model');

exports.getInsights = async (req, res) => {
  try {
    const insights = await AIInsight.find().populate('affectedEmployees');
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const AIInsight = require('../models/aiinsight.model');
const { buildContext } = require('../services/ai/context.service');
const { orchestrate } = require('../services/ai/orchestrator.service');

// GET /ai-insights?period=YYYY-MM&severity=&type=&department=
exports.getInsights = async (req, res) => {
  try {
    const { period, severity, type, department, companyId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (period) filter.period = period;
    if (severity) filter.severity = severity;
    if (type) filter.type = type;

    let query = AIInsight.find(filter);
    let populated = false;
    if (department) {
      query = query.populate({ path: 'affectedEmployeeIds', match: { department } });
      populated = true;
    }
    let insights = await query.lean();
    if (department && populated) {
      // Filtra los insights que no tienen empleados relacionados en ese departamento
      insights = insights.filter(i => Array.isArray(i.affectedEmployeeIds) && i.affectedEmployeeIds.length > 0);
    }
    const visible = insights.filter(i => i.severity === 'critical' || (['medium','high','critical'].includes(i.severity) && (i.confidence || 0) >= 0.6));
    const order = { critical: 3, high: 2, medium: 1, low: 0 };
    visible.sort((a, b) =>
      (order[b.severity] || 0) - (order[a.severity] || 0) ||
      (b.confidence || 0) - (a.confidence || 0) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(visible);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /ai-insights/generate?period=YYYY-MM
exports.generateInsights = async (req, res) => {
  try {
    const period = req.query.period;
    const companyId = req.user?.company || req.query.companyId || 'default';
    const requested = parseInt(req.query.count, 10);
    const maxNew = isNaN(requested) ? undefined : Math.min(3, Math.max(1, requested));
    if (!period) return res.status(400).json({ error: 'period es requerido (YYYY-MM)' });

    // Limite global de 10 insights por companyId+period
    const existingCount = await AIInsight.countDocuments({ companyId, period });
    if (existingCount >= 10) {
      return res.status(400).json({ error: 'Límite máximo de 10 insights alcanzado para este periodo' });
    }

    // Servicio de contexto
    const context = await buildContext({ companyId, period });

    // Orquestación LLM
    // Ajustar maxNew según espacio restante hasta 10
    const remaining = 10 - existingCount;
    const effMax = maxNew ? Math.min(maxNew, remaining) : remaining;
    if (effMax <= 0) {
      return res.status(400).json({ error: 'No hay espacio para más insights' });
    }
    const result = await orchestrate({ companyId, period, context, maxNew: effMax });

    res.status(201).json({
      message: result.reused ? 'Resultados previos reutilizados' : 'Insights generados',
      inputHash: result.inputHash,
      model: result.model,
  count: result.generated.length,
  remainingAfter: await AIInsight.countDocuments({ companyId, period }),
      insights: result.generated
    });
  } catch (err) {
    console.error('generateInsights error', err);
    res.status(500).json({ error: err.message });
  }
};

// PATCH /ai-insights/:id
exports.patchInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, usefulnessScore } = req.body;
    const update = {};
    if (status) update.status = status;
    if (note) update.$push = { ...(update.$push || {}), notes: { note, at: new Date() } };
    if (typeof usefulnessScore === 'number') update.usefulnessScore = usefulnessScore;
    const insight = await AIInsight.findByIdAndUpdate(id, update, { new: true });
    if (!insight) return res.status(404).json({ error: 'Insight no encontrado' });
    res.json(insight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /ai-insights/stats?from=YYYY-MM&to=YYYY-MM
exports.getStats = async (req, res) => {
  try {
    const { from, to, companyId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (from || to) {
      filter.period = {};
      if (from) filter.period.$gte = from;
      if (to) filter.period.$lte = to;
    }
    const data = await AIInsight.aggregate([
      { $match: filter },
      { $group: { _id: { type: '$type', severity: '$severity' }, count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compat: crear insight manual
exports.createInsight = async (req, res) => {
  try {
    const body = req.body || {};
    // mapear compat anterior
    const mapped = {
      companyId: body.companyId || 'default',
      period: body.period || new Date().toISOString().slice(0,7),
      type: body.type,
      title: body.title,
      description: body.description,
      severity: body.severity || 'medium',
      confidence: typeof body.confidence === 'number' && body.confidence > 1 ? body.confidence/100 : (body.confidence || 0.7),
      recommendedAction: (body.recommendations && body.recommendations[0]) || body.recommendedAction,
      affectedEmployeeIds: body.affectedEmployees || body.affectedEmployeeIds || [],
      sourceMetrics: body.sourceMetrics || [],
      rationale: body.rationale || '',
    };
    const insight = await AIInsight.create(mapped);
    res.status(201).json(insight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInsight = async (req, res) => {
  try {
    const insight = await AIInsight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!insight) return res.status(404).json({ error: 'Insight no encontrado' });
    res.json(insight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInsight = async (req, res) => {
  try {
    const insight = await AIInsight.findByIdAndDelete(req.params.id);
    if (!insight) return res.status(404).json({ error: 'Insight no encontrado' });
    res.json({ message: 'Insight eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Método para crear insights de prueba (adaptado al nuevo contrato)
exports.createSampleInsights = async (req, res) => {
  try {
    await AIInsight.deleteMany({});
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const sample = [
      {
        companyId: 'default', period,
        type: 'turnover_prediction', title: 'Riesgo de Rotación Detectado',
        description: '2 empleados con alta probabilidad de renunciar en 3 meses.',
        severity: 'high', confidence: 0.87,
        recommendedAction: 'Programar 1:1 y revisar plan de carrera',
        affectedEmployeeIds: [], sourceMetrics: ['turnover.inactiveRate'], rationale: 'Tasa inactivos creciente'
      },
      {
        companyId: 'default', period,
        type: 'cost_optimization', title: 'Oportunidad de Optimización de Costos',
        description: 'Patrones de horas extra incrementales en Tecnología.',
        severity: 'medium', confidence: 0.73,
        recommendedAction: 'Redistribuir carga y evaluar automatización',
        affectedEmployeeIds: [], sourceMetrics: ['perDepartment.monthlyVariation'], rationale: 'Variación mensual positiva consecutiva'
      }
    ];
    const created = await AIInsight.insertMany(sample);
    res.status(201).json({ message: 'OK', insights: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

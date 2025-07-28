const AIInsight = require('../models/aiinsight.model');

exports.getInsights = async (req, res) => {
  try {
    const insights = await AIInsight.find().populate('affectedEmployees');
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createInsight = async (req, res) => {
  try {
    const insight = new AIInsight(req.body);
    await insight.save();
    await insight.populate('affectedEmployees');
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
    ).populate('affectedEmployees');
    
    if (!insight) {
      return res.status(404).json({ error: 'Insight no encontrado' });
    }
    
    res.json(insight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInsight = async (req, res) => {
  try {
    const insight = await AIInsight.findByIdAndDelete(req.params.id);
    
    if (!insight) {
      return res.status(404).json({ error: 'Insight no encontrado' });
    }
    
    res.json({ message: 'Insight eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Método para crear insights de prueba
exports.createSampleInsights = async (req, res) => {
  try {
    // Eliminar insights existentes para evitar duplicados
    await AIInsight.deleteMany({});
    
    const sampleInsights = [
      {
        type: 'turnover_prediction',
        title: 'Riesgo de Rotación Detectado',
        description: 'El algoritmo ha identificado a 2 empleados con alta probabilidad de renunciar en los próximos 3 meses basado en patrones de comportamiento y satisfacción laboral.',
        severity: 'high',
        confidence: 87,
        recommendations: [
          'Programar reuniones 1:1 con los empleados identificados',
          'Revisar la estructura salarial del departamento',
          'Implementar plan de desarrollo profesional',
          'Considerar beneficios adicionales para retención'
        ],
        affectedEmployees: []
      },
      {
        type: 'cost_optimization',
        title: 'Oportunidad de Optimización de Costos',
        description: 'Se detectaron patrones en horas extra que podrían optimizarse mediante mejor distribución de carga laboral.',
        severity: 'medium',
        confidence: 73,
        recommendations: [
          'Redistribuir carga de trabajo en el departamento de Tecnología',
          'Considerar contratación de personal adicional temporal',
          'Revisar procesos para mejorar eficiencia',
          'Implementar herramientas de automatización'
        ],
        affectedEmployees: []
      },
      {
        type: 'performance_anomaly',
        title: 'Anomalía en Rendimiento Detectada',
        description: 'Se ha identificado una disminución en la productividad general del 12% en el último trimestre.',
        severity: 'medium',
        confidence: 68,
        recommendations: [
          'Analizar factores externos que puedan estar afectando el rendimiento',
          'Revisar herramientas y recursos disponibles para los empleados',
          'Considerar programas de capacitación adicional',
          'Evaluar la carga de trabajo actual'
        ],
        affectedEmployees: []
      }
    ];
    
    const createdInsights = await AIInsight.insertMany(sampleInsights);
    res.status(201).json({
      message: 'Insights de prueba creados exitosamente',
      insights: createdInsights
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

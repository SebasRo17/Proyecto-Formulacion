const express = require('express');
const router = express.Router();
const aiInsightCtrl = require('../controllers/aiinsight.controller');
const auth = require('../middleware/auth');

// Listado con filtros
router.get('/', aiInsightCtrl.getInsights);

// Generación con LLM (auth obligatoria)
router.post('/generate', auth, aiInsightCtrl.generateInsights);

// Stats para gráficos
router.get('/stats', aiInsightCtrl.getStats);

// CRUD básico / compat
router.post('/', aiInsightCtrl.createInsight);
router.put('/:id', aiInsightCtrl.updateInsight);
router.patch('/:id', aiInsightCtrl.patchInsight);
router.delete('/:id', aiInsightCtrl.deleteInsight);

// Datos de prueba
router.post('/sample', aiInsightCtrl.createSampleInsights);

module.exports = router;

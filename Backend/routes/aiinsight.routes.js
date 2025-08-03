const express = require('express');
const router = express.Router();
const aiInsightCtrl = require('../controllers/aiinsight.controller');
// const auth = require('../middleware/auth'); // Desactivado temporalmente

// Rutas públicas sin autenticación
router.get('/', aiInsightCtrl.getInsights);
router.post('/', aiInsightCtrl.createInsight);
router.put('/:id', aiInsightCtrl.updateInsight);
router.delete('/:id', aiInsightCtrl.deleteInsight);

// Ruta para crear datos de prueba
router.post('/sample', aiInsightCtrl.createSampleInsights);

module.exports = router;

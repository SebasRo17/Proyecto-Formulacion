const express = require('express');
const router = express.Router();
const aiInsightCtrl = require('../controllers/aiinsight.controller');
const auth = require('../middleware/auth');

router.get('/', auth, aiInsightCtrl.getInsights);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');


router.get('/stats', dashboardCtrl.getStats);
router.get('/trends', auth, dashboardCtrl.getPayrollTrends);
router.get('/active-insights-count', dashboardCtrl.getActiveInsightsCount);
router.get('/net-payrolls', dashboardCtrl.getNetPayrolls);


module.exports = router;

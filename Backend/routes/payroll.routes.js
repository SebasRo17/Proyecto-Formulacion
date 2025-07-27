const express = require('express');
const router = express.Router();
const payrollCtrl = require('../controllers/payroll.controller');
const auth = require('../middleware/auth');

// Todas las rutas protegidas
router.post('/', auth, payrollCtrl.createPayroll);
router.get('/', auth, payrollCtrl.getAllPayrolls);
router.get('/:id', auth, payrollCtrl.getPayrollById);
router.put('/:id', auth, payrollCtrl.updatePayroll);
router.delete('/:id', auth, payrollCtrl.deletePayroll);

module.exports = router;

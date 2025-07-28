const express = require('express');
const router = express.Router();
const payrollCtrl = require('../controllers/payroll.controller');
// const auth = require('../middleware/auth'); // Desactivado temporalmente para pruebas

// Rutas públicas sin autenticación (temporalmente para desarrollo)
router.get('/', payrollCtrl.getAllPayrolls);
router.get('/:id', payrollCtrl.getPayrollById);
router.post('/', payrollCtrl.createPayroll);
router.put('/:id', payrollCtrl.updatePayroll);
router.delete('/:id', payrollCtrl.deletePayroll);

// Ruta para crear datos de prueba
router.post('/sample', payrollCtrl.createSamplePayrolls);

module.exports = router;

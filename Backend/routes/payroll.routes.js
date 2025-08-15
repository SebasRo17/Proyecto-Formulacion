const express = require('express');
const router = express.Router();
const payrollCtrl = require('../controllers/payroll.controller');
// const auth = require('../middleware/auth'); // Desactivado temporalmente para pruebas

// Rutas públicas sin autenticación (temporalmente para desarrollo)
router.get('/', payrollCtrl.getAllPayrolls);
// Empleados activos (precarga) — debe ir antes de /:id
router.get('/_active-employees', payrollCtrl.getActiveEmployees);
router.get('/:id', payrollCtrl.getPayrollById);
router.post('/', payrollCtrl.createPayroll);
router.put('/:id', payrollCtrl.updatePayroll);
router.delete('/:id', payrollCtrl.deletePayroll);

// Ruta para crear datos de prueba
router.post('/sample', payrollCtrl.createSamplePayrolls);

// Calculadoras
router.post('/calculate/decimo-tercero', payrollCtrl.calculateDecimoTercero);
router.post('/calculate/decimo-cuarto', payrollCtrl.calculateDecimoCuarto);
router.post('/calculate/vacaciones', payrollCtrl.calculateVacaciones);
router.post('/calculate/liquidacion', payrollCtrl.calculateLiquidacion);

// Aplicar resultado de calculadora a una nómina (crea/actualiza)
router.post('/apply', payrollCtrl.applyCalculatorToPayroll);

// Upsert nómina desde wizard
router.post('/upsert', payrollCtrl.upsertPayroll);

// (mantenido arriba por orden)

module.exports = router;

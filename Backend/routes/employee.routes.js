const express = require('express');
const router = express.Router();
const employeeCtrl = require('../controllers/employee.controller');
const auth = require('../middleware/auth');

router.post('/', auth, employeeCtrl.createEmployee)
router.get('/', auth, employeeCtrl.getAllEmployees);
router.get('/:id', auth, employeeCtrl.getEmployeeById);
router.put('/:id', auth, employeeCtrl.updateEmployee);
router.delete('/:id', auth, employeeCtrl.deleteEmployee);

module.exports = router;

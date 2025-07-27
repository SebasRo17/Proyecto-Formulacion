const express = require('express');
const router = express.Router();
const employeeCtrl = require('../controllers/employee.controller');

router.post('/', employeeCtrl.createEmployee);
router.get('/', employeeCtrl.getAllEmployees);
router.get('/:id', employeeCtrl.getEmployeeById);
router.put('/:id', employeeCtrl.updateEmployee);
router.delete('/:id', employeeCtrl.deleteEmployee);

module.exports = router;

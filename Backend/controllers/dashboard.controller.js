const Employee = require('../models/employee.model');

exports.getStats = async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'active' });

    const totalActive = employees.length;
    const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);

    // Agrupa empleados por departamento
    const departmentCosts = {};
    employees.forEach(emp => {
      if (!departmentCosts[emp.department]) departmentCosts[emp.department] = 0;
      departmentCosts[emp.department] += emp.salary;
    });

    res.json({
      totalActive,
      totalSalaries,
      departmentCosts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

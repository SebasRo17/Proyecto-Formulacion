const Employee = require('../models/employee.model');
const Payroll = require('../models/payroll.model');
const AIInsight = require('../models/aiinsight.model'); 

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

    // ROTACIÓN ANUAL (%)
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const inactiveThisYear = await Employee.countDocuments({
      status: 'inactive',
      updatedAt: { $gte: yearStart }
    });
    const totalEmployees = await Employee.countDocuments();
    const avgEmployees = totalEmployees / 2 || 1;
    const turnover = Math.round((inactiveThisYear / avgEmployees) * 1000) / 10;

    res.json({
      totalActive,
      totalSalaries,
      departmentCosts,
      turnover
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPayrollTrends = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ period: 1 });

    const monthlyTrends = payrolls.map(p => ({
      name: p.period,
      value: p.totalGross 
    }));

    // Calcula costos por departamento (última nómina)
    let departmentCosts = [];
    if (payrolls.length > 0) {
      // Toma la nómina más reciente
      const latest = payrolls[payrolls.length - 1];
      const employeeCosts = {};

      latest.employees.forEach(e => {
        const dept = e.employee.department || 'Otro';
        if (!employeeCosts[dept]) employeeCosts[dept] = 0;
        employeeCosts[dept] += e.grossAmount;
      });

      departmentCosts = Object.entries(employeeCosts).map(([name, value]) => ({
        name,
        value
      }));
    }

    res.json({ monthlyTrends, departmentCosts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveInsightsCount = async (req, res) => {
  try {
    // Cuenta "visibles": severidad media/alta/crítica y confianza >= 0.6 (críticos sin umbral),
    // excluyendo estados descartados o resueltos.
    const filter = {
      status: { $nin: ['dismissed', 'resolved'] },
      severity: { $in: ['medium', 'high', 'critical'] },
      $or: [
        { severity: 'critical' },
        { confidence: { $gte: 0.6 } }
      ]
    };
    const activeCount = await AIInsight.countDocuments(filter);
    res.json({ success: true, count: activeCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna el periodo y total neto de todas las nóminas
exports.getNetPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ period: 1 });

    const netData = payrolls.map(p => ({
      period: p.period,
      totalNet: p.totalNet
    }));

    res.json({ success: true, data: netData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna conteo de insights por severidad visibles (para gráfica)
exports.getInsightSeverityStats = async (req, res) => {
  try {
    const match = {
      status: { $nin: ['dismissed', 'resolved'] },
      severity: { $in: ['low','medium','high','critical'] },
    };
    const data = await AIInsight.aggregate([
      { $match: match },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);
    const map = data.reduce((acc, d) => { acc[d._id] = d.count; return acc; }, {});
    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

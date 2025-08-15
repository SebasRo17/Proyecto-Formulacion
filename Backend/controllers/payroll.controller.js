const Payroll = require('../models/payroll.model');
const Notification = require('../models/notification.model');
const Employee = require('../models/employee.model');
const { calcDecimoTercero, calcDecimoCuarto, calcVacaciones, calcLiquidacion } = require('../services/payroll/calculators.service');

// Crear nueva nómina
exports.createPayroll = async (req, res) => {
  try {
    const payroll = new Payroll(req.body);
    await payroll.save();
    res.status(201).json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las nóminas
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employees.employee');
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una nómina por ID
exports.getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employees.employee');
    if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar nómina
exports.updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });
    res.json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar nómina
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });
    res.json({ message: 'Nómina eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear datos de prueba para nóminas
exports.createSamplePayrolls = async (req, res) => {
  try {
    // Eliminar nóminas existentes para evitar duplicados
    await Payroll.deleteMany({});
    
    const samplePayrolls = [
      {
        period: 'Enero 2024',
        employees: [],
        totalGross: 52500,
        totalDeductions: 8750,
        totalNet: 43750,
        status: 'paid',
        createdAt: new Date('2024-01-31')
      },
      {
        period: 'Febrero 2024',
        employees: [],
        totalGross: 53200,
        totalDeductions: 8850,
        totalNet: 44350,
        status: 'processing',
        createdAt: new Date('2024-02-15')
      },
      {
        period: 'Marzo 2024',
        employees: [],
        totalGross: 54100,
        totalDeductions: 9020,
        totalNet: 45080,
        status: 'approved',
        createdAt: new Date('2024-03-10')
      },
      {
        period: 'Abril 2024',
        employees: [],
        totalGross: 53800,
        totalDeductions: 8950,
        totalNet: 44850,
        status: 'draft',
        createdAt: new Date('2024-04-05')
      }
    ];
    
    const createdPayrolls = await Payroll.insertMany(samplePayrolls);
    res.status(201).json({
      message: 'Nóminas de prueba creadas exitosamente',
      payrolls: createdPayrolls
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === Calculadoras académicas ===
exports.calculateDecimoTercero = async (req, res) => {
  try {
    const { year, employeeIds, includeVariables, base, method, variablesByEmployee } = req.body;
    const result = await calcDecimoTercero({ year, employeeIds, includeVariables, base, method, variablesByEmployee });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.calculateDecimoCuarto = async (req, res) => {
  try {
    const { year, region, SBU, employeeIds, mode, monthsWorked } = req.body;
    const result = await calcDecimoCuarto({ year, region, SBU, employeeIds, mode, monthsWorked });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.calculateVacaciones = async (req, res) => {
  try {
    const result = await calcVacaciones(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.calculateLiquidacion = async (req, res) => {
  try {
    const result = await calcLiquidacion(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Aplica resultado de calculadora a una nómina (crea si no existe)
exports.applyCalculatorToPayroll = async (req, res) => {
  try {
    const { period, type = 'decimos', calculator, rows = [], params = {}, status = 'processing' } = req.body;
    if (!period) return res.status(400).json({ error: 'period requerido' });

    let payroll = await Payroll.findOne({ period });
    if (!payroll) {
      payroll = new Payroll({ period, type, params, employees: [], totalGross: 0, totalDeductions: 0, totalNet: 0, status });
    }

    // Mapa por empleado para acumular conceptos
    const map = new Map(payroll.employees.map((it) => [String(it.employee), it]));

    rows.forEach((r) => {
      const id = String(r.employee);
      const amount = Number(r.value || r.payAmount || 0);
      if (!map.has(id)) {
        map.set(id, { employee: r.employee, grossAmount: 0, deductions: 0, netAmount: 0, concepts: [] });
      }
      const item = map.get(id);
      const concept = {
        type: calculator,
        label: (calculator === 'decimo_tercero' ? 'Décimo Tercero' : calculator === 'decimo_cuarto' ? 'Décimo Cuarto' : calculator === 'vacaciones' ? 'Vacaciones' : 'Liquidación'),
        category: 'earning',
        amount,
        source: 'calculator',
        meta: { ...r, params },
      };
      item.concepts = item.concepts || [];
      item.concepts.push(concept);
      item.grossAmount = Number(item.grossAmount || 0) + amount;
      item.netAmount = Number(item.grossAmount) - Number(item.deductions || 0);
    });

    payroll.employees = Array.from(map.values());
    // Recalcular totales
    payroll.totalGross = payroll.employees.reduce((a, b) => a + (b.grossAmount || 0), 0);
    payroll.totalDeductions = payroll.employees.reduce((a, b) => a + (b.deductions || 0), 0);
    payroll.totalNet = payroll.employees.reduce((a, b) => a + (b.netAmount || 0), 0);
    payroll.params = { ...(payroll.params || {}), ...params };
    await payroll.save();

    // Notificación opcional
    try {
      await Notification.create({
        title: `Cálculo aplicado a nómina ${period}`,
        message: `Se aplicó ${calculator} a ${payroll.employees.length} empleado(s).`,
        type: 'success',
        actionUrl: '/payroll'
      });
    } catch (_) {}

    res.json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Crear/actualizar nómina (Wizard)
exports.upsertPayroll = async (req, res) => {
  try {
    const { period, type = 'monthly', params = {}, employees = [], status = 'processing' } = req.body;
    if (!period) return res.status(400).json({ error: 'period requerido' });

    // Normalizar items empleados: { employee, grossAmount, deductions, netAmount, concepts? }
    const normalized = employees.map((it) => ({
      employee: it.employee,
      grossAmount: Number(it.grossAmount || 0),
      deductions: Number(it.deductions || 0),
      netAmount: Number(it.netAmount || (Number(it.grossAmount || 0) - Number(it.deductions || 0))),
      concepts: it.concepts || [],
    }));

    const totalGross = normalized.reduce((a, b) => a + (b.grossAmount || 0), 0);
    const totalDeductions = normalized.reduce((a, b) => a + (b.deductions || 0), 0);
    const totalNet = normalized.reduce((a, b) => a + (b.netAmount || 0), 0);

    let payroll = await Payroll.findOneAndUpdate(
      { period },
      { period, type, params, employees: normalized, totalGross, totalDeductions, totalNet, status },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Si marcado como paid, notificar
    if (status === 'paid') {
      try {
        await Notification.create({
          title: `Nómina ${period} pagada`,
          message: `La nómina del período ${period} ha sido marcada como pagada.`,
          type: 'success',
          actionUrl: '/payroll'
        });
      } catch (_) {}
    }

    res.status(200).json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Precarga de empleados activos para el wizard
exports.getActiveEmployees = async (req, res) => {
  try {
    const emps = await Employee.find({ status: 'active' }).select('name department salary');
    res.json(emps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Payroll = require('../models/payroll.model');

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

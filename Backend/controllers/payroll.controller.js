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

const Employee = require('../../models/employee.model');

// Utilidades
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Carga empleados por IDs (o todos activos si ids=null)
async function loadEmployees(employeeIds) {
  if (employeeIds && employeeIds.length) {
    return Employee.find({ _id: { $in: employeeIds } });
  }
  return Employee.find({ status: 'active' });
}

// A. Décimo Tercero (modo académico)
async function calcDecimoTercero({ year, employeeIds = [], includeVariables = false, base = 'salary', method = 'anual', variablesByEmployee = {} }) {
  // variablesByEmployee: { empId: { value: number } }
  const emps = await loadEmployees(employeeIds);
  const rows = emps.map((e) => {
    const vars = variablesByEmployee[e._id]?.value || 0;
    const baseVal = base === 'salary_plus_variables' && includeVariables ? (e.salary + vars) * 12 : e.salary * 12;
    // Simplificado: si method === 'mensual', el valor mensual sería baseAnual/12; si anual, igual.
    const valor = round2(baseVal / 12);
    return {
      employee: e._id,
      name: e.name,
      baseAcumulada: round2(baseVal),
      value: valor,
      method,
      observations: method === 'mensual' ? 'Prorrateo mensual' : 'Cálculo anual académico',
    };
  });
  return { year, rows };
}

// B. Décimo Cuarto (SBU editable)
async function calcDecimoCuarto({ year, region = 'sierra', SBU = 460, employeeIds = [], mode = 'mensual', monthsWorked = {} }) {
  const emps = await loadEmployees(employeeIds);
  const rows = emps.map((e) => {
    // modo mensual: SBU/12; modo anual: proporcional a meses trabajados (editable)
    const months = monthsWorked[e._id] ?? 12;
    const value = mode === 'mensual' ? round2(SBU / 12) : round2((SBU * months) / 12);
    return {
      employee: e._id,
      name: e.name,
      value,
      observations: mode === 'mensual' ? 'SBU/12' : `Proporcional ${months} meses`,
      SBU,
      region,
    };
  });
  return { year, SBU, region, rows };
}

// C. Vacaciones (saldo y pago)
async function calcVacaciones({ employeeId, startDate, cutoffDate, daysPerYear = 15, daysTaken = 0, payNow = false, salary }) {
  // Si no pasan salary, usar del empleado
  let e = null;
  if (!salary || !startDate) {
    e = await Employee.findById(employeeId);
  }
  const s = salary ?? e.salary;
  const start = startDate ? new Date(startDate) : e.startDate;
  const cutoff = cutoffDate ? new Date(cutoffDate) : new Date();
  const months = Math.max(0, (cutoff.getFullYear() - start.getFullYear()) * 12 + (cutoff.getMonth() - start.getMonth()));
  const accruedDays = round2((daysPerYear * months) / 12);
  const taken = daysTaken || 0;
  const balanceDays = Math.max(0, accruedDays - taken);
  const daily = s / 30;
  const daysToPay = payNow ? Math.min(balanceDays, daysTaken || balanceDays) : 0;
  const payAmount = round2(daily * daysToPay);
  return {
    employee: employeeId,
    accruedDays,
    takenDays: taken,
    balanceDays,
    payAmount,
    dailyRate: round2(daily),
  };
}

// D. Liquidaciones (simplificado)
async function calcLiquidacion({ employeeId, startDate, endDate, reason = 'renuncia', includeDecimos = true, includeVacaciones = true, indemnizationNSalaries = 0, loans = 0, salary }) {
  let e = null;
  if (!salary || !startDate) e = await Employee.findById(employeeId);
  const s = salary ?? e.salary;
  const start = startDate ? new Date(startDate) : e.startDate;
  const end = endDate ? new Date(endDate) : new Date();

  // Sueldo pendiente últimos días del mes de salida
  const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
  const dayOfMonth = end.getDate();
  const daily = s / 30;
  const pendingSalary = round2(daily * dayOfMonth);

  // Décimos proporcionales (académico)
  const monthsYear = end.getMonth() + 1; // 1..12
  const decimoTercero = includeDecimos ? round2((s * monthsYear) / 12) : 0;
  const SBU = 460; // valor por defecto editable en UI
  const decimoCuarto = includeDecimos ? round2((SBU * monthsYear) / 12) : 0;

  // Vacaciones no gozadas (académico: daysPerYear=15 y no gozadas = proporcional)
  const monthsWorked = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
  const accruedVacDays = (15 * monthsWorked) / 12;
  const vacationPay = includeVacaciones ? round2((s / 30) * accruedVacDays) : 0;

  const indemnization = round2(indemnizationNSalaries * s);
  const subtotals = {
    pendingSalary,
    decimoTercero,
    decimoCuarto,
    vacationPay,
    indemnization,
  };
  const total = round2(Object.values(subtotals).reduce((a, b) => a + b, 0) - (loans || 0));

  return {
    employee: employeeId,
    reason,
    startDate: start,
    endDate: end,
    subtotals,
    deductions: loans || 0,
    total,
  };
}

module.exports = {
  calcDecimoTercero,
  calcDecimoCuarto,
  calcVacaciones,
  calcLiquidacion,
};

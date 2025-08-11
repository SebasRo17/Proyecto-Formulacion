const Payroll = require('../../models/payroll.model');
const Employee = require('../../models/employee.model');
const AIInsight = require('../../models/aiinsight.model');

// Utilidad: normaliza periodos a YYYY-MM, soportando formatos como "Enero 2024".
const MONTHS_ES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
};

function normalizePeriod(period) {
  if (!period) return null;
  // Already like YYYY-MM
  const iso = /^\d{4}-\d{2}$/;
  if (iso.test(period)) return period;
  // Try "Enero 2024" or "enero 2024"
  const m = /([A-Za-zñÑáéíóúÁÉÍÓÚ]+)\s+(\d{4})/.exec(period);
  if (m) {
    const monthName = m[1].toLowerCase();
    const year = Number(m[2]);
    const month = MONTHS_ES[monthName];
    if (month) return `${year}-${String(month).padStart(2, '0')}`;
  }
  return period; // fallback
}

// Pendiente lineal simple usando mínimos cuadrados (x = 0..n-1)
function linearTrendSlope(series) {
  const n = series.length;
  if (n < 2) return 0;
  const xs = series.map((_, i) => i);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = series.reduce((a, b) => a + b, 0);
  const sumXX = xs.reduce((a, b) => a + b * b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * series[i], 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  const slope = (n * sumXY - sumX * sumY) / denom;
  return slope;
}

// Calcula outliers por IQR simple
function iqrOutliers(values) {
  if (!values.length) return { lower: null, upper: null };
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)];
  const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)];
  const iqr = q3 - q1;
  return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr };
}

async function buildContext({ companyId, period }) {
  const normPeriod = normalizePeriod(period);

  // Empleados (solo campos mínimos, sin PII sensible)
  const employees = await Employee.find({}, {
    name: 0, // evitamos nombre si se envía a un LLM más adelante
    email: 0,
    phone: 0,
    address: 0,
    cedula: 0,
  }).lean();

  // Nóminas: traer 18 meses recientes
  const payrolls = await Payroll.find({}).sort({ createdAt: -1 }).limit(18).lean();
  // Normalizar periodos y consolidar
  const byPeriod = new Map();
  for (const p of payrolls) {
    const pKey = normalizePeriod(p.period);
    const cur = byPeriod.get(pKey) || { totalGross: 0, totalDeductions: 0, totalNet: 0 };
    cur.totalGross += p.totalGross || 0;
    cur.totalDeductions += p.totalDeductions || 0;
    cur.totalNet += p.totalNet || 0;
    byPeriod.set(pKey, cur);
  }
  // Serie ordenada por periodo
  const periods = [...byPeriod.keys()].sort();
  const netSeries = periods.map((k) => byPeriod.get(k).totalNet);
  const trendSlope = linearTrendSlope(netSeries);

  // Por departamento: costo promedio, variación mensual
  const deptAgg = {};
  for (const p of payrolls) {
    const empItems = p.employees || [];
    for (const item of empItems) {
      const emp = employees.find(e => String(e._id) === String(item.employee));
      if (!emp) continue;
      const dept = emp.department || 'Unknown';
      if (!deptAgg[dept]) deptAgg[dept] = [];
      deptAgg[dept].push({
        period: normalizePeriod(p.period),
        gross: item.grossAmount || 0,
        deductions: item.deductions || 0,
        net: item.netAmount || 0,
      });
    }
  }
  const perDepartment = Object.entries(deptAgg).map(([dept, rows]) => {
    const byP = {};
    rows.forEach(r => {
      byP[r.period] = byP[r.period] || { gross: 0, deductions: 0, net: 0, count: 0 };
      byP[r.period].gross += r.gross;
      byP[r.period].deductions += r.deductions;
      byP[r.period].net += r.net;
      byP[r.period].count += 1;
    });
    const periods = Object.keys(byP).sort();
    const avgs = periods.map(k => ({ period: k, avgCost: byP[k].gross / (byP[k].count || 1) }));
    const changes = [];
    for (let i = 1; i < avgs.length; i++) {
      const prev = avgs[i - 1].avgCost || 1e-9;
      const curr = avgs[i].avgCost;
      changes.push({ period: avgs[i].period, changePct: (curr - prev) / prev });
    }
    const topUp = [...changes].sort((a, b) => b.changePct - a.changePct).slice(0, 3);
    const topDown = [...changes].sort((a, b) => a.changePct - b.changePct).slice(0, 3);
    // Outliers por deducciones
    const deductionsVals = rows.map(r => r.deductions);
    const { upper } = iqrOutliers(deductionsVals);
    const hasOutliers = upper != null && deductionsVals.some(v => v > upper);
    return { department: dept, avgCosts: avgs, monthlyVariation: changes, topUps: topUp, topDowns: topDown, outlierDeductions: hasOutliers };
  });

  // Empleado brief
  const employeesBrief = employees.map(e => ({
    id: String(e._id),
    department: e.department,
    salary: e.salary,
    tenureMonths: Math.max(0, Math.floor((Date.now() - new Date(e.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))),
    status: e.status,
    updatedAt: e.updatedAt,
  }));

  // Índice por departamento para facilitar selección de IDs relevantes
  const employeesByDepartment = employeesBrief.reduce((acc, e) => {
    const d = e.department || 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(e.id);
    return acc;
  }, {});

  // Rotación aproximada por trimestre
  const byQuarter = {};
  for (const e of employees) {
    const d = e.updatedAt ? new Date(e.updatedAt) : new Date();
    const q = Math.floor(d.getMonth() / 3) + 1;
    const key = `${d.getFullYear()}-Q${q}`;
    if (!byQuarter[key]) byQuarter[key] = { total: 0, inactive: 0 };
    byQuarter[key].total += 1;
    if (e.status !== 'active') byQuarter[key].inactive += 1;
  }
  const turnover = Object.entries(byQuarter).map(([k, v]) => ({ quarter: k, inactiveRate: v.total ? v.inactive / v.total : 0 }));

  // Insights previos (títulos y métricas)
  const prevInsights = await AIInsight.find({
    ...(companyId ? { companyId } : {}),
  }).sort({ createdAt: -1 }).limit(100).lean();
  const prevInsightsBrief = prevInsights.map(i => ({ id: i.id, title: i.title, sourceMetrics: i.sourceMetrics || [] }));

  // Paquete compacto
  const stats = {
    period: normPeriod,
    periods,
    totalsByPeriod: periods.map(k => ({ period: k, ...byPeriod.get(k) })),
    trendNetSlope: trendSlope,
    perDepartment,
    turnover,
  };

  // Serie de netPayrolls
  const netPayrolls = periods.map(k => ({ period: k, totalNet: byPeriod.get(k).totalNet }));

  const sourceKeys = [
    'totalsByPeriod.totalGross',
    'totalsByPeriod.totalDeductions',
    'totalsByPeriod.totalNet',
    'trendNetSlope',
    'perDepartment.avgCosts',
    'perDepartment.monthlyVariation',
    'perDepartment.topUps',
    'perDepartment.topDowns',
    'perDepartment.outlierDeductions',
    'turnover.inactiveRate'
  ];

  return { stats, netPayrolls, employeesBrief, employeesByDepartment, prevInsightsBrief, sourceKeys };
}

module.exports = { buildContext, normalizePeriod };

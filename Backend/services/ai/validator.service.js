const Employee = require('../../models/employee.model');

const REQUIRED_FIELDS = ['type','severity','title','description','confidence','affectedEmployeeIds','sourceMetrics','recommendedAction','rationale','createdAt','period','companyId'];

function normalizeConfidence(val) {
  if (typeof val === 'number') {
    if (val > 1 && val <= 100) return val / 100;
    if (val < 0) return 0;
    if (val > 1) return 1;
    return val;
  }
  if (typeof val === 'string') {
    const m = /([\d.]+)/.exec(val);
    if (m) {
      const num = parseFloat(m[1]);
      if (val.includes('%')) return Math.max(0, Math.min(1, num / 100));
      return Math.max(0, Math.min(1, num));
    }
  }
  return 0.5;
}

async function validateInsights(insights) {
  if (!Array.isArray(insights)) throw new Error('LLM debe devolver un arreglo');

  // Cache de IDs válidos de empleados
  const employees = await Employee.find({}, { _id: 1 }).lean();
  const validIds = new Set(employees.map(e => String(e._id)));

  const errors = [];
  const cleaned = insights.map((i, idx) => {
    const obj = { ...i };
    // Campos requeridos
    for (const f of REQUIRED_FIELDS) {
      if (obj[f] === undefined) errors.push(`Insight[${idx}] falta campo: ${f}`);
    }
    // Normalizar confidence
    obj.confidence = normalizeConfidence(obj.confidence);
    // affectedEmployeeIds debe pertenecer a empleados
    if (!Array.isArray(obj.affectedEmployeeIds)) obj.affectedEmployeeIds = [];
    obj.affectedEmployeeIds = obj.affectedEmployeeIds.filter(id => validIds.has(String(id)));
    // severity válida
    const sev = String(obj.severity || '').toLowerCase();
    obj.severity = ['low','medium','high','critical'].includes(sev) ? sev : 'medium';
    // createdAt ISO si falta
    if (!obj.createdAt) obj.createdAt = new Date().toISOString().slice(0,10);
    return obj;
  });

  if (errors.length) {
    // No bloquear por campos faltantes menores; devolver errores para logging
    return { valid: true, insights: cleaned, warnings: errors };
  }
  return { valid: true, insights: cleaned, warnings: [] };
}

module.exports = { validateInsights, normalizeConfidence };

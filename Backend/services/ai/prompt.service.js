// Prompt maestro y helper para construir la instrucción al LLM

const INSIGHT_CONTRACT = `
Regresa solo un arreglo JSON de objetos Insight con este contrato estricto:
{
  "id": "string-uuid-o-deja-vacio",
  "type": "string",
  "severity": "low|medium|high|critical",
  "title": "string",
  "description": "string",
  "confidence": 0.0-1.0,
  "affectedEmployeeIds": ["id"],
  "sourceMetrics": ["string"],
  "recommendedAction": "string",
  "rationale": "string",
  "createdAt": "YYYY-MM-DD",
  "period": "YYYY-MM",
  "companyId": "string"
}
`;

function buildPrompt({ companyId, period, context }) {
  const system = `Eres un Analista RRHH para una pyme en Ecuador, enfocado en costo, riesgo y cumplimiento. Responde en JSON válido. No inventes datos.`;
  const guardrails = `
- No inventes IDs ni métricas.
- Cita sourceMetrics con claves exactas del resumen provisto.
- Selecciona como máximo 8 insights (Top-K por impacto).
- Si falta evidencia, baja confidence y explícalo en rationale.
- Usa severity critical solo cuando sea claro.
- Filtra insights a mostrar con (severity >= medium y confidence >= 0.6) o severity critical.
- Periodos en formato YYYY-MM.
 - Sobre affectedEmployeeIds:
   * Usa únicamente IDs presentes en context.employeesBrief (o context.employeesByDepartment).
   * Selecciona de 1 a 3 IDs relevantes. Si no hay evidencia suficiente, devuelve [].
   * Si el insight se refiere a un departamento específico, prioriza IDs de context.employeesByDepartment[DEPARTAMENTO].
`;

  const user = {
    instruction: 'Genera insights basados en el contexto. Devuelve SOLO JSON (sin comentarios).',
    companyId,
    period,
    context
  };
  return { system, guardrails, contract: INSIGHT_CONTRACT, user };
}

module.exports = { buildPrompt, INSIGHT_CONTRACT };

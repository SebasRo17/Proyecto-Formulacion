const crypto = require('crypto');
const OpenAI = require('openai');
const AIInsight = require('../../models/aiinsight.model');
const { buildPrompt } = require('./prompt.service');
const { validateInsights } = require('./validator.service');

// Lazy init en callModel para no romper el arranque sin API key

function hashInput(obj) {
  const h = crypto.createHash('sha256');
  h.update(JSON.stringify(obj));
  return h.digest('hex');
}

function cosineSim(a, b) {
  // Simple similitud de títulos basada en bigramas
  const ngrams = (s) => {
    const t = s.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, ' ');
    const parts = t.split(/\s+/).filter(Boolean);
    const grams = new Set();
    for (let i = 0; i < parts.length - 1; i++) grams.add(parts[i] + ' ' + parts[i+1]);
    return grams;
  };
  const A = ngrams(a); const B = ngrams(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const denom = Math.sqrt(A.size || 1) * Math.sqrt(B.size || 1);
  return inter / denom;
}

async function callModel({ companyId, period, context }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no configurada en el servidor');
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = buildPrompt({ companyId, period, context });
  const messages = [
    { role: 'system', content: prompt.system },
    { role: 'system', content: prompt.guardrails },
    { role: 'system', content: prompt.contract },
    { role: 'user', content: JSON.stringify(prompt.user) }
  ];

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const resp = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });
  // Esperamos un objeto con una propiedad insights o un arreglo directo
  const txt = resp.choices?.[0]?.message?.content || '[]';
  let parsed;
  try {
    parsed = JSON.parse(txt);
  } catch {
    // Si viene como arreglo plano
    parsed = Array.isArray(txt) ? txt : [];
  }
  const insights = Array.isArray(parsed) ? parsed : (parsed.insights || []);
  return { insights, model, raw: txt };
}

async function deduplicate({ newInsights, prevInsightsBrief }) {
  const titlesPrev = prevInsightsBrief.map(p => p.title);
  const keep = [];
  for (const i of newInsights) {
    const sim = Math.max(...(titlesPrev.map(t => cosineSim(i.title || '', t))), 0);
    if (sim < 0.8) keep.push(i); // descartar similares
  }
  return keep;
}

async function orchestrate({ companyId, period, context }) {
  const input = { companyId, period, contextVersion: 'v1', context };
  const inputHash = hashInput(input);

  // Idempotencia: ¿existe corrida con este hash?
  const existing = await AIInsight.findOne({ companyId, period, inputHash }).lean();
  if (existing) {
    const batch = await AIInsight.find({ companyId, period, inputHash }).sort({ createdAt: -1 }).lean();
    return { reused: true, inputHash, generated: batch };
  }

  // Llamada al modelo
  const { insights: rawInsights, model, raw } = await callModel({ companyId, period, context });

  // Validación
  const { insights: validated, warnings } = await validateInsights(rawInsights);

  // Límite máx 8
  let limited = validated.slice(0, 8);

  // Deduplicación frente a títulos previos
  limited = await deduplicate({ newInsights: limited, prevInsightsBrief: context.prevInsightsBrief || [] });

  // Persistencia: guardar cada insight
  const now = new Date();
  const docs = [];
  for (const i of limited) {
    const doc = await AIInsight.create({
      ...i,
      companyId,
      period,
      inputHash,
      model,
      promptVersion: 'v1',
      status: 'new',
      sourceMetrics: i.sourceMetrics || context.sourceKeys || [],
      createdAt: now,
    });
    docs.push(doc.toObject());
  }

  return { reused: false, inputHash, model, warnings, raw, generated: docs };
}

module.exports = { orchestrate };

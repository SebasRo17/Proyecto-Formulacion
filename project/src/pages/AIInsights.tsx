import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useApp } from "../contexts/AppContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export function AIInsights() {
  const {
    aiInsights,
    employees,
    loading,
    error,
    refreshData,
    deleteInsight,
    generateInsights,
  } = useApp();

  const [selectedInsight, setSelectedInsight] = useState<any | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genPeriod, setGenPeriod] = useState<string>("");
  const [genCompanyId, setGenCompanyId] = useState<string>("");
  const [genCount, setGenCount] = useState<number>(1);
  const [employeePreview, setEmployeePreview] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (!genPeriod) {
      const now = new Date();
      setGenPeriod(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      );
    }
  }, []);

  useEffect(() => {
    const periodOk = /^\d{4}-(0[1-9]|1[0-2])$/.test(genPeriod);
    setFormValid(periodOk && genCount >= 1 && genCount <= 3);
  }, [genPeriod, genCount]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    await generateInsights(genPeriod, genCompanyId || undefined, genCount);
    setShowGenerateModal(false);
  };

  const handleMarkReviewed = async (id: string) => {
    await deleteInsight(id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertTriangle;
      case "medium":
        return TrendingUp;
      case "low":
        return CheckCircle;
      default:
        return Brain;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "turnover_prediction":
        return Users;
      case "performance_anomaly":
        return TrendingUp;
      case "cost_optimization":
        return DollarSign;
      default:
        return Brain;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IA Insights</h1>
          <p className="text-gray-600 mt-1">
            Predicciones y recomendaciones inteligentes para optimizar tu
            gestión de talento
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="info" className="px-3 py-1">
            <Brain className="w-4 h-4 mr-1" />
            {aiInsights.length} insights activos
          </Badge>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Actualizando..." : "Actualizar Datos"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowGenerateModal(true)}
            disabled={loading}
          >
            Generar Insights
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="ml-auto"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && aiInsights.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando insights de IA...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && aiInsights.length === 0 && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay insights disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              No se han encontrado análisis de IA. Intenta generar un nuevo
              análisis.
            </p>
            <Button onClick={refreshData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      {aiInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Alertas Críticas
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    {aiInsights.filter((i) => i.severity === "high").length}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Requieren acción inmediata
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Predicción Promedio
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {aiInsights.length > 0
                      ? Math.round(
                          aiInsights.reduce((sum, i) => sum + i.confidence, 0) /
                            aiInsights.length
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Nivel de confianza
                  </p>
                </div>
                <Brain className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Empleados Impactados
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {
                      new Set(
                        aiInsights.flatMap((i) => i.affectedEmployees || [])
                      ).size
                    }
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Requieren seguimiento
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights list */}
      <div className="space-y-4">
        {aiInsights.map((insight) => {
          const SeverityIcon = getSeverityIcon(insight.severity);
          const TypeIcon = getTypeIcon(insight.type);

          return (
            <Card
              key={insight.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full ${
                      insight.severity === "high"
                        ? "bg-red-100"
                        : insight.severity === "medium"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <TypeIcon
                      className={`w-6 h-6 ${
                        insight.severity === "high"
                          ? "text-red-600"
                          : insight.severity === "medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={getSeverityColor(insight.severity) as any}
                          >
                            <SeverityIcon className="w-3 h-3 mr-1" />
                            {insight.severity === "high"
                              ? "Crítico"
                              : insight.severity === "medium"
                              ? "Moderado"
                              : "Bajo"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Confianza: {insight.confidence}%
                          </span>
                          <span className="text-sm text-gray-500">
                            {insight.createdAt.toLocaleDateString("es-EC")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{insight.description}</p>

                    {/* Affected employees */}
                    {insight.affectedEmployees &&
                      insight.affectedEmployees.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Empleados Afectados:
                          </h4>
                          <div className="flex items-center space-x-2">
                            {insight.affectedEmployees
                              .slice(0, 3)
                              .map((employeeId) => {
                                const employee = employees.find(
                                  (e) => e.id === employeeId
                                );
                                return (
                                  <div
                                    key={employeeId}
                                    className="flex items-center space-x-2"
                                  >
                                    {employee ? (
                                      <>
                                        <img
                                          src={
                                            employee.avatar ||
                                            "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop"
                                          }
                                          alt={employee.name}
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm text-gray-700">
                                          {employee.name}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm text-gray-500">
                                        {employeeId}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            {insight.affectedEmployees.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{insight.affectedEmployees.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Recommendations */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Recomendaciones:
                      </h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInsight(insight)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkReviewed(insight.id)}
                      >
                        Marcar como Revisado
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Detalles */}
      {selectedInsight && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-6 bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full relative overflow-hidden animate-fade-in">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="p-6 pt-4 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-2 capitalize">
                    {selectedInsight.type?.replace(/_/g, " ") || "Insight"}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1 flex flex-wrap items-center gap-3">
                    {selectedInsight.title}
                    <span
                      className={`text-xs px-2 py-1 rounded-full border tracking-wide ${
                        selectedInsight.severity === "high"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : selectedInsight.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {selectedInsight.severity}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-200/80">
                    ID: {selectedInsight.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-white/80 hover:text-white bg-black/20 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-8 bg-gradient-to-b from-white to-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Severidad</p>
                  <p className="font-medium capitalize">
                    {selectedInsight.severity}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Confianza</p>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <svg
                        className="w-16 h-16 -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#6366f1"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="282.743"
                          strokeDashoffset={
                            (1 - selectedInsight.confidence / 100) * 282.743
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-indigo-600">
                        {selectedInsight.confidence}%
                      </span>
                    </div>
                    <span className="font-medium">
                      {selectedInsight.confidence}% confianza
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {selectedInsight.createdAt.toLocaleDateString("es-EC")}
                  </p>
                </div>
                {selectedInsight.status && (
                  <div>
                    <p className="text-gray-500">Estado</p>
                    <p className="font-medium">{selectedInsight.status}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Descripción
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedInsight.description}
                </p>
              </div>
              {selectedInsight.rationale && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Razonamiento del Modelo
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {selectedInsight.rationale}
                  </p>
                </div>
              )}
              {selectedInsight.sourceMetrics &&
                selectedInsight.sourceMetrics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Métricas Fuente
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsight.sourceMetrics.map(
                        (m: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200"
                          >
                            {m}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              {selectedInsight.affectedEmployees &&
                selectedInsight.affectedEmployees.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Empleados Afectados
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                      {selectedInsight.affectedEmployees.map((id: string) => {
                        const emp = employees.find((e) => e.id === id);
                        return (
                          <li key={id}>
                            {emp ? (
                              <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setEmployeePreview(emp.id)}
                              >
                                {emp.name}
                              </button>
                            ) : (
                              id
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Recomendaciones
                </h3>
                <ul className="space-y-1">
                  {selectedInsight.recommendations.map(
                    (r: string, i: number) => (
                      <li key={i} className="flex text-sm text-gray-700">
                        • <span className="ml-2">{r}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {selectedInsight.notes && selectedInsight.notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Notas
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {selectedInsight.notes.map((n: any, i: number) => (
                      <li key={i}>
                        [{new Date(n.at).toLocaleDateString("es-EC")}] {n.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Generado por motor IA |{" "}
                {selectedInsight.createdAt.toLocaleDateString("es-EC")}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleMarkReviewed(selectedInsight.id);
                    setSelectedInsight(null);
                  }}
                >
                  Marcar Revisado
                </Button>
              </div>
            </div>
            {employeePreview &&
              (() => {
                const emp = employees.find((e) => e.id === employeePreview);
                if (!emp) return null;
                return (
                  <div className="absolute top-28 right-6 w-72 bg-white rounded-xl shadow-2xl border p-4 animate-fade-in z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={emp.avatar || "https://via.placeholder.com/48"}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <p className="font-medium text-sm">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.position}</p>
                      </div>
                      <button
                        onClick={() => setEmployeePreview(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                        aria-label="Cerrar"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 grid grid-cols-1 gap-1">
                      <p>
                        <span className="font-medium">Depto:</span>{" "}
                        {emp.department}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {emp.email}
                      </p>
                      <p>
                        <span className="font-medium">Salario:</span> $
                        {emp.salary}
                      </p>
                      <p>
                        <span className="font-medium">Ingreso:</span>{" "}
                        {emp.startDate.toLocaleDateString("es-EC")}
                      </p>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      )}

      {/* Modal Generar Insights */}
      {showGenerateModal && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-6 bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full animate-fade-in">
            <form onSubmit={handleGenerate}>
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Generar Insights de Nómina
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Ingresa el periodo y (opcional) el Company ID. El endpoint
                  seguro ya está configurado.
                </p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periodo <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={genPeriod}
                      onChange={(e) => setGenPeriod(e.target.value)}
                      required
                      inputMode="numeric"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2025-08"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato válido: YYYY-MM (ej: 2025-08)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <input
                      value={genCompanyId}
                      onChange={(e) => setGenCompanyId(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={genCount}
                      onChange={(e) => setGenCount(Number(e.target.value))}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máx 3 por petición
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded p-3 text-xs text-indigo-700">
                  Endpoint: {API_BASE_URL}/ai-insights/generate (POST). Límite 3
                  por petición y máximo 10 insights totales por periodo.
                </div>
              </div>
              <div className="p-4 border-t flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
                <Button
                  variant="ghost"
                  type="button"
                  size="sm"
                  onClick={() => setShowGenerateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={!formValid || loading}
                >
                  {loading ? "Generando..." : "Generar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Model Info */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">
                Sobre el Motor de IA de PaySmart
              </h3>
              <p className="text-sm text-purple-800 mb-3">
                Nuestro sistema utiliza algoritmos de machine learning para
                analizar patrones en tu organización y predecir tendencias
                futuras. Los modelos se entrenan continuamente con datos
                anonimizados de miles de empresas ecuatorianas.
              </p>
              <div className="flex items-center text-sm text-purple-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Última actualización del modelo: 15 de enero, 2024</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

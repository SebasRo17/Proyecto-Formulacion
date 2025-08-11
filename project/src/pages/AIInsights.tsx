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

export function AIInsights() {
  const {
    aiInsights,
    employees,
    loading,
    error,
    refreshData,
    createSampleData,
  } = useApp();

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
            onClick={createSampleData}
            disabled={loading}
          >
            Crear Datos de Prueba
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
                      <Button size="sm">Aplicar Recomendación</Button>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                      <Button variant="ghost" size="sm">
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

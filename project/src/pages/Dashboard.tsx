import {
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Brain,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { LineChart } from "../components/charts/LineChart";
import { BarChart } from "../components/charts/BarChart";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function Dashboard() {
  const {
    totalActive,
    totalSalaries,
    turnover,
    departmentCosts,
    activeInsights,
    loading,
    error,
    netPayrolls,
    insightSeverity = {},
  } = useDashboardStats() as any;

  // Helper para ordenar períodos como "Enero 2025", "Febrero 2025" y especiales "Décimos 2025"
  const parsePeriodToDate = (period: string): Date => {
    const meses: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      setiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };
    const p = (period || "").toLowerCase().trim();
    // Manejo de "Décimos YYYY" como diciembre de ese año
    const decMatch = p.match(/d[ée]cimos?\s+(\d{4})/i);
    if (decMatch) return new Date(parseInt(decMatch[1], 10), 11, 1);
    const parts = p.split(/\s+/);
    const month = meses[parts[0]];
    const year = parseInt(parts[1], 10) || new Date().getFullYear();
    if (month != null && !Number.isNaN(year)) return new Date(year, month, 1);
    // Fallback: intentar Date.parse
    const d = new Date(period);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const netTrends = Array.isArray(netPayrolls)
    ? [...netPayrolls]
        .sort(
          (a, b) =>
            parsePeriodToDate(a.period).getTime() -
            parsePeriodToDate(b.period).getTime()
        )
        .map((p) => ({ name: p.period, value: p.totalNet }))
    : [];

  // Datos para "Costos por Departamento" (sin normalización manual).
  // Deja que el BarChart haga la escala en base al valor máximo.
  const departmentChartData = Object.entries(departmentCosts || {}).map(
    ([name, value]) => ({
      name,
      value: Number(value) || 0,
      realValue: Number(value) || 0,
    })
  );

  const severityChartData = [
    { name: "Crítico", value: Number(insightSeverity.critical || 0) },
    { name: "Alto", value: Number(insightSeverity.high || 0) },
    { name: "Medio", value: Number(insightSeverity.medium || 0) },
    { name: "Bajo", value: Number(insightSeverity.low || 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen ejecutivo de tu gestión de talento humano
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="success" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Última actualización: hace 5 min
          </Badge>
        </div>
      </div>

      {/* Mostrar error si falla */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Empleados Activos
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : totalActive}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Costo Nómina Mensual
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : `$${totalSalaries}`}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rotación Anual
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : `${turnover}%`}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sugerencias IA
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {activeInsights}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Evolución Costos Laborales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={netTrends} color="#2563eb" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Costos por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={departmentChartData} color="#10b981" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Severidad de Sugerencias IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={severityChartData} color="#8b5cf6" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

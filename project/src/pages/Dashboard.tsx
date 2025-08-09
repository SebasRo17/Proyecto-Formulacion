import React from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  Brain,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { useDashboardStats } from '../hooks/useDashboardStats';


export function Dashboard() {
  const { totalActive, totalSalaries, turnover, departmentCosts, activeInsights, loading, error } = useDashboardStats();

  //Evoluacion de la nomina
  const { netPayrolls } = useDashboardStats();

  const netTrends = Array.isArray(netPayrolls)
    ? netPayrolls.map(p => ({ name: p.period, value: p.totalNet }))
    : [];




  const max = Math.max(...Object.values(departmentCosts));
  const normalizedChartData = Object.entries(departmentCosts).map(([name, value]) => ({
    name,
    value: (value / max) * 100,  // valor para ver la barra
    realValue: value             // valor real para mostrar
  }));



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
                <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : totalActive}</p>

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
                <p className="text-sm font-medium text-gray-600">Costo Nómina Mensual</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : `$${totalSalaries}`}
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
                <p className="text-sm font-medium text-gray-600">Rotación Anual</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `${turnover}%`}</p>

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
                <p className="text-sm font-medium text-gray-600">Sugerencias IA</p>
                <p className="text-3xl font-bold text-gray-900">{activeInsights}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <BarChart data={normalizedChartData} color="#10b981" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

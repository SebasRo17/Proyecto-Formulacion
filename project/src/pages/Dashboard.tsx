import React from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Brain,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { useApp } from '../contexts/AppContext';

export function Dashboard() {
  const { employees, aiInsights } = useApp();

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);

  const monthlyTrends = [
    { name: 'Ene', value: 45000 },
    { name: 'Feb', value: 47000 },
    { name: 'Mar', value: 48500 },
    { name: 'Abr', value: 46000 },
    { name: 'May', value: 49000 },
    { name: 'Jun', value: 51000 }
  ];

  const departmentCosts = [
    { name: 'Tecnología', value: 25000 },
    { name: 'Ventas', value: 18000 },
    { name: 'Marketing', value: 12000 },
    { name: 'RRHH', value: 8000 }
  ];

  const highSeverityInsights = aiInsights.filter(insight => insight.severity === 'high');

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

      {/* AI Alerts */}
      {highSeverityInsights.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-900 mb-1">Alertas de IA Críticas</h3>
                <p className="text-sm text-red-800 mb-2">
                  Se han detectado {highSeverityInsights.length} situación(es) que requieren atención inmediata.
                </p>
                <button className="text-sm text-red-700 font-medium hover:text-red-900">
                  Ver detalles en IA Insights →
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
                <p className="text-3xl font-bold text-gray-900">{activeEmployees}</p>
                <p className="text-sm text-green-600 mt-1">+2 este mes</p>
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
                <p className="text-3xl font-bold text-gray-900">${totalSalaries.toLocaleString()}</p>
                <p className="text-sm text-red-600 mt-1">+3.2% vs mes anterior</p>
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
                <p className="text-3xl font-bold text-gray-900">8.5%</p>
                <p className="text-sm text-green-600 mt-1">-1.2% vs objetivo</p>
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
                <p className="text-sm font-medium text-gray-600">Predicciones IA</p>
                <p className="text-3xl font-bold text-gray-900">{aiInsights.length}</p>
                <p className="text-sm text-blue-600 mt-1">Insights activos</p>
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
            <LineChart data={monthlyTrends} color="#2563eb" height={200} />
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
            <BarChart data={departmentCosts} color="#10b981" height={200} />
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nómina de enero procesada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo empleado registrado</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">IA detectó patrón de rotación</p>
                <p className="text-xs text-gray-500">Hace 6 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Procesar nómina</p>
                  <p className="text-sm text-gray-500">Preparar nómina del mes actual</p>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Agregar empleado</p>
                  <p className="text-sm text-gray-500">Registrar nuevo colaborador</p>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Ver insights IA</p>
                  <p className="text-sm text-gray-500">Revisar recomendaciones</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
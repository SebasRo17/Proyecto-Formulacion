import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'iess' | 'sri' | 'internal' | 'ministry';
  frequency: 'monthly' | 'quarterly' | 'annual';
  lastGenerated?: Date;
  status: 'available' | 'pending' | 'error';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Reporte Mensual IESS',
    description: 'Formulario de aportes patronales y personales',
    type: 'iess',
    frequency: 'monthly',
    lastGenerated: new Date('2024-01-31'),
    status: 'available'
  },
  {
    id: '2',
    name: 'Declaración SRI 103',
    description: 'Retenciones en la fuente de impuesto a la renta',
    type: 'sri',
    frequency: 'monthly',
    lastGenerated: new Date('2024-01-31'),
    status: 'available'
  },
  {
    id: '3',
    name: 'Reporte Anual SRI',
    description: 'Declaración anual de impuesto a la renta de empleados',
    type: 'sri',
    frequency: 'annual',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Reporte de Vacaciones',
    description: 'Estado de vacaciones por empleado',
    type: 'internal',
    frequency: 'quarterly',
    lastGenerated: new Date('2024-01-15'),
    status: 'available'
  },
  {
    id: '5',
    name: 'Ministerio de Trabajo',
    description: 'Reporte de nómina para inspecciones laborales',
    type: 'ministry',
    frequency: 'monthly',
    status: 'available'
  }
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedType, setSelectedType] = useState('all');

  const filteredReports = reportTemplates.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'iess': return 'info';
      case 'sri': return 'warning';
      case 'internal': return 'default';
      case 'ministry': return 'success';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'iess': return 'IESS';
      case 'sri': return 'SRI';
      case 'internal': return 'Interno';
      case 'ministry': return 'Min. Trabajo';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'pending': return 'Pendiente';
      case 'error': return 'Error';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes Legales</h1>
          <p className="text-gray-600 mt-1">
            Genera y gestiona reportes para entidades gubernamentales
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reportTemplates.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generados Este Mes</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximo Vencimiento</p>
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-sm text-red-500 mt-1">días restantes</p>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cumplimiento</p>
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-green-500 mt-1">En tiempo</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                label="Período"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="iess">IESS</option>
                <option value="sri">SRI</option>
                <option value="internal">Internos</option>
                <option value="ministry">Ministerio de Trabajo</option>
              </select>
            </div>
            <div className="pt-6">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <Badge variant={getTypeColor(report.type) as any} size="sm">
                    {getTypeLabel(report.type)}
                  </Badge>
                </div>
                <Badge variant={getStatusColor(report.status) as any} size="sm">
                  {getStatusLabel(report.status)}
                </Badge>
              </div>
              <CardTitle className="text-lg">{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Frecuencia:</span>
                  <span className="capitalize">{report.frequency === 'monthly' ? 'Mensual' : 
                                                   report.frequency === 'quarterly' ? 'Trimestral' : 'Anual'}</span>
                </div>
                {report.lastGenerated && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Último generado:</span>
                    <span>{report.lastGenerated.toLocaleDateString('es-EC')}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={report.status !== 'available'}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Generar
                </Button>
                {report.status === 'available' && (
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Obligaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Declaración SRI 103</p>
                  <p className="text-sm text-yellow-700">Vence el 28 de febrero</p>
                </div>
              </div>
              <Badge variant="warning">Próximo</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Reporte IESS</p>
                  <p className="text-sm text-red-700">Vence el 15 de febrero</p>
                </div>
              </div>
              <Badge variant="danger">Urgente</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Reporte Ministerio de Trabajo</p>
                  <p className="text-sm text-green-700">Vence el 30 de marzo</p>
                </div>
              </div>
              <Badge variant="success">A tiempo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Plus, Calculator, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { useApp } from '../contexts/AppContext';

interface PayrollRecord {
  id: string;
  period: string;
  employees: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  createdAt: Date;
}

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    period: 'Enero 2024',
    employees: 15,
    grossAmount: 52500,
    deductions: 8750,
    netAmount: 43750,
    status: 'paid',
    createdAt: new Date('2024-01-31')
  },
  {
    id: '2',
    period: 'Febrero 2024',
    employees: 15,
    grossAmount: 53200,
    deductions: 8850,
    netAmount: 44350,
    status: 'processing',
    createdAt: new Date('2024-02-15')
  }
];

export function Payroll() {
  const { employees } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollRecord | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'processing': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'approved': return CheckCircle;
      case 'processing': return Clock;
      case 'draft': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'approved': return 'Aprobado';
      case 'processing': return 'Procesando';
      case 'draft': return 'Borrador';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'period',
      header: 'Período',
      sortable: true,
      render: (record: PayrollRecord) => (
        <div>
          <p className="font-medium text-gray-900">{record.period}</p>
          <p className="text-sm text-gray-500">
            {record.createdAt.toLocaleDateString('es-EC')}
          </p>
        </div>
      )
    },
    {
      key: 'employees',
      header: 'Empleados',
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-medium text-gray-900">{record.employees}</span>
      )
    },
    {
      key: 'grossAmount',
      header: 'Total Bruto',
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-medium text-gray-900">${record.grossAmount.toLocaleString()}</span>
      )
    },
    {
      key: 'deductions',
      header: 'Deducciones',
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="text-red-600">${record.deductions.toLocaleString()}</span>
      )
    },
    {
      key: 'netAmount',
      header: 'Total Neto',
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-bold text-green-600">${record.netAmount.toLocaleString()}</span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      render: (record: PayrollRecord) => {
        const StatusIcon = getStatusIcon(record.status);
        return (
          <Badge variant={getStatusColor(record.status) as any}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {getStatusText(record.status)}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (record: PayrollRecord) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPeriod(record)}
          >
            Ver Detalles
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Nómina</h1>
          <p className="text-gray-600 mt-1">
            Procesa y administra los pagos de tu equipo de trabajo
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Décimos
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nómina
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empleados en Nómina</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nómina Mensual</p>
                <p className="text-2xl font-bold text-gray-900">$53,200</p>
                <p className="text-sm text-green-600 mt-1">+1.3% vs mes anterior</p>
              </div>
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximo Pago</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-yellow-600 mt-1">días restantes</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado Actual</p>
                <p className="text-lg font-bold text-yellow-600">Procesando</p>
                <p className="text-sm text-gray-500 mt-1">Febrero 2024</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll history */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Nóminas</CardTitle>
            </CardHeader>
            <CardContent padding="none">
              <DataTable
                data={mockPayrollRecords}
                columns={columns}
                searchable={true}
                exportable={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Payroll details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPeriod ? `Detalles - ${selectedPeriod.period}` : 'Selecciona un Período'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPeriod ? (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="text-center">
                    <Badge
                      variant={getStatusColor(selectedPeriod.status) as any}
                      className="px-3 py-1 text-sm"
                    >
                      {getStatusText(selectedPeriod.status)}
                    </Badge>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600">Empleados:</span>
                      <span className="font-medium">{selectedPeriod.employees}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600">Total Bruto:</span>
                      <span className="font-medium">${selectedPeriod.grossAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600">Deducciones:</span>
                      <span className="font-medium text-red-600">-${selectedPeriod.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="font-medium text-gray-900">Total Neto:</span>
                      <span className="font-bold text-green-600">${selectedPeriod.netAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Desglose de Deducciones</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">IESS (Personal):</span>
                        <span>$4,956</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Impuesto a la Renta:</span>
                        <span>$2,180</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Préstamos:</span>
                        <span>$1,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Otros descuentos:</span>
                        <span>$414</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Roles de Pago
                    </Button>
                    <Button variant="outline" className="w-full">
                      Ver Comprobantes Individuales
                    </Button>
                    {selectedPeriod.status === 'approved' && (
                      <Button className="w-full">
                        Procesar Pagos
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecciona un período para ver los detalles</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Calculadoras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="w-4 h-4 mr-2" />
                Décimo Tercero
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="w-4 h-4 mr-2" />
                Décimo Cuarto
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="w-4 h-4 mr-2" />
                Vacaciones
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="w-4 h-4 mr-2" />
                Liquidaciones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
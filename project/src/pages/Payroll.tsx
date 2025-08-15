import { useMemo, useState } from "react";
import {
  Plus,
  Calculator,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable } from "../components/ui/DataTable";
import { useApp } from "../contexts/AppContext";
import type { PayrollRecord } from "../types";
import { Modal } from "../components/ui/Modal";
import { MultiSelect } from "../components/ui/MultiSelect";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

export function Payroll() {
  const { employees, payrollRecords, loading, error, refreshData } = useApp();
  const { token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollRecord | null>(
    null
  );
  const [openDecimo13, setOpenDecimo13] = useState(false);
  const [openDecimo14, setOpenDecimo14] = useState(false);
  const [openVacaciones, setOpenVacaciones] = useState(false);
  const [openLiquidacion, setOpenLiquidacion] = useState(false);
  const [openNewPayroll, setOpenNewPayroll] = useState(false);

  // Parámetros académicos
  const [year, setYear] = useState(new Date().getFullYear());
  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        value: e.id,
        label: `${e.name} (${e.department})`,
      })),
    [employees]
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Decimo tercero params
  const [d13IncludeVars, setD13IncludeVars] = useState(true);
  const [d13Base, setD13Base] = useState<"salary" | "salary_plus_variables">(
    "salary"
  );
  const [d13Method, setD13Method] = useState<"mensual" | "anual">("anual");
  const [d13Preview, setD13Preview] = useState<any[]>([]);

  // Decimo cuarto params
  const [SBU, setSBU] = useState(460);
  const [d14Mode, setD14Mode] = useState<"mensual" | "anual">("mensual");
  const [d14Preview, setD14Preview] = useState<any[]>([]);

  // Vacaciones
  const [vacEmpId, setVacEmpId] = useState<string>("");
  const [vacDaysPerYear, setVacDaysPerYear] = useState(15);
  const [vacDaysTaken, setVacDaysTaken] = useState(0);
  const [vacPayNow, setVacPayNow] = useState(false);
  const [vacPreview, setVacPreview] = useState<any | null>(null);

  // Liquidación
  const [liqEmpId, setLiqEmpId] = useState<string>("");
  const [liqIndemnN, setLiqIndemnN] = useState(0);
  const [liqIncludeDec, setLiqIncludeDec] = useState(true);
  const [liqIncludeVac, setLiqIncludeVac] = useState(true);
  const [liqPreview, setLiqPreview] = useState<any | null>(null);

  // Wizard Nueva Nómina (simplificado)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [periodStr, setPeriodStr] = useState<string>("");
  const [payrollType, setPayrollType] = useState<
    "monthly" | "decimos" | "liquidacion"
  >("monthly");
  const [rows, setRows] = useState<any[]>([]);
  const [statusToSave, setStatusToSave] = useState<"processing" | "paid">(
    "processing"
  );

  const openWizard = () => {
    setOpenNewPayroll(true);
    setWizardStep(1);
    const now = new Date();
    const defaultPeriod = `${now.toLocaleString("es-EC", {
      month: "long",
    })} ${now.getFullYear()}`;
    setPeriodStr(defaultPeriod);
    setPayrollType("monthly");
    const baseRows = employees
      .filter((e) => e.status === "active")
      .map((e) => ({
        employee: e.id,
        name: e.name,
        department: e.department,
        grossAmount: e.salary,
        bonuses: 0,
        overtime: 0,
        deductions: 0,
        netAmount: e.salary,
      }));
    try {
      const tplRaw = localStorage.getItem("paysmart_wizard_template");
      if (tplRaw) {
        const tpl = JSON.parse(tplRaw) as Record<
          string,
          { bonuses?: number; overtime?: number; deductions?: number }
        >;
        baseRows.forEach((r) => {
          const t = tpl[r.employee];
          if (t) {
            r.bonuses = Number(t.bonuses || 0);
            r.overtime = Number(t.overtime || 0);
            r.deductions = Number(t.deductions || 0);
            r.netAmount =
              Number(r.grossAmount || 0) +
              r.bonuses +
              r.overtime -
              r.deductions;
          }
        });
      }
    } catch {}
    setRows(baseRows);
  };

  const recalcNet = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        netAmount: Number(r.grossAmount || 0) - Number(r.deductions || 0),
      }))
    );
  };

  const totals = useMemo(() => {
    const totalGross = rows.reduce(
      (a, b) => a + (Number(b.grossAmount) || 0),
      0
    );
    const totalDeductions = rows.reduce(
      (a, b) => a + (Number(b.deductions) || 0),
      0
    );
    const totalNet = rows.reduce((a, b) => a + (Number(b.netAmount) || 0), 0);
    return { totalGross, totalDeductions, totalNet };
  }, [rows]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "approved":
        return "info";
      case "processing":
        return "warning";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "approved":
        return CheckCircle;
      case "processing":
        return Clock;
      case "draft":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "approved":
        return "Aprobado";
      case "processing":
        return "Procesando";
      case "draft":
        return "Borrador";
      default:
        return status;
    }
  };

  const columns = [
    {
      key: "period",
      header: "Período",
      sortable: true,
      render: (record: PayrollRecord) => (
        <div>
          <p className="font-medium text-gray-900">{record.period}</p>
          <p className="text-sm text-gray-500">
            {record.createdAt.toLocaleDateString("es-EC")}
          </p>
        </div>
      ),
    },
    {
      key: "employees",
      header: "Empleados",
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-medium text-gray-900">{record.employees}</span>
      ),
    },
    {
      key: "grossAmount",
      header: "Total Bruto",
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-medium text-gray-900">
          ${record.grossAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "deductions",
      header: "Deducciones",
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="text-red-600">
          ${record.deductions.toLocaleString()}
        </span>
      ),
    },
    {
      key: "netAmount",
      header: "Total Neto",
      sortable: true,
      render: (record: PayrollRecord) => (
        <span className="font-bold text-green-600">
          ${record.netAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (record: PayrollRecord) => {
        const StatusIcon = getStatusIcon(record.status);
        return (
          <Badge variant={getStatusColor(record.status) as any}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {getStatusText(record.status)}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Acciones",
      render: (record: PayrollRecord) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPeriod(record)}
          >
            Ver Detalles
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                const full = await api.getPayrollById(record.id);
                const rows = (full.employees || []).map((r: any) => ({
                  empleado: r.employee?.name || r.employee,
                  bruto: r.grossAmount,
                  deducciones: r.deductions,
                  neto: r.netAmount,
                }));
                const csv = ["Empleado,Bruto,Deducciones,Neto"]
                  .concat(
                    rows.map(
                      (r: {
                        empleado: string;
                        bruto: number;
                        deducciones: number;
                        neto: number;
                      }) =>
                        `${r.empleado},${r.bruto},${r.deducciones},${r.neto}`
                    )
                  )
                  .join("\n");
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nomina_${record.period}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (_) {}
            }}
            title="Descargar CSV"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Nómina
          </h1>
          <p className="text-gray-600 mt-1">
            Procesa y administra los pagos de tu equipo de trabajo
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button onClick={openWizard}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nómina
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
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
      {loading && payrollRecords.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando nóminas...</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      {!loading && payrollRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Empleados en Nómina
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {employees.length}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Nómina Mensual
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${payrollRecords[0]?.grossAmount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Último período</p>
                </div>
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Próximo Pago
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Estado Actual
                  </p>
                  <p className="text-lg font-bold text-yellow-600">
                    {getStatusText(payrollRecords[0]?.status || "draft")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {payrollRecords[0]?.period || "Sin período"}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main content */}
      {!loading && payrollRecords.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payroll history */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Nóminas</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={payrollRecords}
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
                  {selectedPeriod
                    ? `Detalles - ${selectedPeriod.period}`
                    : "Selecciona un Período"}
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
                        <span className="text-sm text-gray-600">
                          Empleados:
                        </span>
                        <span className="font-medium">
                          {selectedPeriod.employees}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-gray-600">
                          Total Bruto:
                        </span>
                        <span className="font-medium">
                          ${selectedPeriod.grossAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-gray-600">
                          Deducciones:
                        </span>
                        <span className="font-medium text-red-600">
                          -${selectedPeriod.deductions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="font-medium text-gray-900">
                          Total Neto:
                        </span>
                        <span className="font-bold text-green-600">
                          ${selectedPeriod.netAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Desglose de Deducciones
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            IESS (Personal):
                          </span>
                          <span>$4,956</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Impuesto a la Renta:
                          </span>
                          <span>$2,180</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Préstamos:</span>
                          <span>$1,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Otros descuentos:
                          </span>
                          <span>$414</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          if (!selectedPeriod) return;
                          try {
                            const full = await api.getPayrollById(
                              selectedPeriod.id
                            );
                            const rows = (full.employees || []).map(
                              (r: any) => ({
                                empleado: r.employee?.name || r.employee,
                                bruto: r.grossAmount,
                                deducciones: r.deductions,
                                neto: r.netAmount,
                              })
                            );
                            const csv = ["Empleado,Bruto,Deducciones,Neto"]
                              .concat(
                                rows.map(
                                  (r: {
                                    empleado: string;
                                    bruto: number;
                                    deducciones: number;
                                    neto: number;
                                  }) =>
                                    `${r.empleado},${r.bruto},${r.deducciones},${r.neto}`
                                )
                              )
                              .join("\n");
                            const blob = new Blob([csv], {
                              type: "text/csv;charset=utf-8;",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `nomina_${selectedPeriod.period}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          } catch (_) {}
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Roles de Pago
                      </Button>
                      {/* Botón removido: Ver Comprobantes Individuales */}
                      {selectedPeriod.status === "approved" && (
                        <Button className="w-full">Procesar Pagos</Button>
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenDecimo13(true)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Décimo Tercero
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenDecimo14(true)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Décimo Cuarto
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenVacaciones(true)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Vacaciones
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenLiquidacion(true)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Liquidaciones
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && payrollRecords.length === 0 && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay nóminas disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              No se han encontrado registros de nómina. Crea una nueva nómina
              para comenzar.
            </p>
            <Button onClick={openWizard}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Nómina
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modales: Décimo Tercero */}
      <Modal
        open={openDecimo13}
        title="Calcular Décimo Tercero"
        onClose={() => setOpenDecimo13(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenDecimo13(false)}>
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Descargar CSV
                const rows = d13Preview || [];
                const csv = ["Empleado,Base Acumulada,Valor,Observaciones"]
                  .concat(
                    rows.map(
                      (r: any) =>
                        `${r.name},${r.baseAcumulada},${r.value},${r.observations}`
                    )
                  )
                  .join("\n");
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `decimo13_${year}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Descargar CSV
            </Button>
            <Button
              onClick={async () => {
                const period = `Décimos ${year}`;
                await api.applyCalculator({
                  period,
                  type: "decimos",
                  calculator: "decimo_tercero",
                  rows: d13Preview,
                  params: {
                    year,
                    includeVariables: d13IncludeVars,
                    base: d13Base,
                    method: d13Method,
                  },
                });
                setOpenDecimo13(false);
                refreshData();
              }}
            >
              Aplicar a Nómina del periodo
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Año"
            type="number"
            value={year}
            onChange={(e) =>
              setYear(parseInt(e.target.value || `${new Date().getFullYear()}`))
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado(s)
            </label>
            <MultiSelect
              options={employeeOptions}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              placeholder="Seleccionar empleados"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="incvars"
              type="checkbox"
              checked={d13IncludeVars}
              onChange={(e) => setD13IncludeVars(e.target.checked)}
            />
            <label htmlFor="incvars" className="text-sm text-gray-700">
              Incluir variables (horas extra, bonos)
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Base
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={d13Base}
              onChange={(e) => setD13Base(e.target.value as any)}
            >
              <option value="salary">Sueldo fijo</option>
              <option value="salary_plus_variables">Sueldo + variables</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Método
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={d13Method}
              onChange={(e) => setD13Method(e.target.value as any)}
            >
              <option value="mensual">Prorrateo mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={async () => {
                const resp = await api.calcDecimoTercero({
                  year,
                  employeeIds: selectedEmployees,
                  includeVariables: d13IncludeVars,
                  base: d13Base,
                  method: d13Method,
                });
                setD13Preview(resp.rows || []);
              }}
            >
              Calcular vista previa
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-2">Vista previa</h4>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Empleado</th>
                  <th className="py-2 pr-4">Base Acumulada</th>
                  <th className="py-2 pr-4">Valor</th>
                  <th className="py-2 pr-4">Obs</th>
                </tr>
              </thead>
              <tbody>
                {d13Preview.map((r: any) => (
                  <tr key={r.employee} className="border-t">
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4">
                      ${r.baseAcumulada?.toLocaleString?.() || r.baseAcumulada}
                    </td>
                    <td className="py-2 pr-4 text-green-700 font-medium">
                      ${r.value?.toLocaleString?.() || r.value}
                    </td>
                    <td className="py-2 pr-4">{r.observations}</td>
                  </tr>
                ))}
                {d13Preview.length === 0 && (
                  <tr>
                    <td className="text-gray-500 py-3" colSpan={4}>
                      Sin datos. Calcula para ver resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Modales: Décimo Cuarto */}
      <Modal
        open={openDecimo14}
        title="Calcular Décimo Cuarto"
        onClose={() => setOpenDecimo14(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenDecimo14(false)}>
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const rows = d14Preview || [];
                const csv = ["Empleado,Valor,Obs"]
                  .concat(
                    rows.map(
                      (r: any) => `${r.name},${r.value},${r.observations}`
                    )
                  )
                  .join("\n");
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `decimo14_${year}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Descargar CSV
            </Button>
            <Button
              onClick={async () => {
                const period = `Décimos ${year}`;
                await api.applyCalculator({
                  period,
                  type: "decimos",
                  calculator: "decimo_cuarto",
                  rows: d14Preview,
                  params: { year, SBU, mode: d14Mode },
                });
                setOpenDecimo14(false);
                refreshData();
              }}
            >
              Aplicar a Nómina del periodo
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Año"
            type="number"
            value={year}
            onChange={(e) =>
              setYear(parseInt(e.target.value || `${new Date().getFullYear()}`))
            }
          />
          <Input
            label="SBU (editable)"
            type="number"
            value={SBU}
            onChange={(e) => setSBU(parseFloat(e.target.value || "0"))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado(s)
            </label>
            <MultiSelect
              options={employeeOptions}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Modo
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={d14Mode}
              onChange={(e) => setD14Mode(e.target.value as any)}
            >
              <option value="mensual">Mensual (SBU/12)</option>
              <option value="anual">Anual proporcional</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={async () => {
                const resp = await api.calcDecimoCuarto({
                  year,
                  SBU,
                  employeeIds: selectedEmployees,
                  mode: d14Mode,
                });
                setD14Preview(resp.rows || []);
              }}
            >
              Calcular vista previa
            </Button>
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Empleado</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Obs</th>
              </tr>
            </thead>
            <tbody>
              {d14Preview.map((r: any) => (
                <tr key={r.employee} className="border-t">
                  <td className="py-2 pr-4">{r.name}</td>
                  <td className="py-2 pr-4 text-green-700 font-medium">
                    ${r.value?.toLocaleString?.() || r.value}
                  </td>
                  <td className="py-2 pr-4">{r.observations}</td>
                </tr>
              ))}
              {d14Preview.length === 0 && (
                <tr>
                  <td className="text-gray-500 py-3" colSpan={3}>
                    Sin datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Modales: Vacaciones */}
      <Modal
        open={openVacaciones}
        title="Calcular Vacaciones"
        onClose={() => setOpenVacaciones(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenVacaciones(false)}>
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!vacPreview) return;
                await api.updateVacationBalance(
                  vacPreview.employee,
                  vacPreview.balanceDays,
                  token || undefined
                );
                setOpenVacaciones(false);
                refreshData();
              }}
            >
              Registrar saldo
            </Button>
            <Button
              onClick={async () => {
                if (!vacPreview) return;
                const period = `${new Date().toLocaleString("es-EC", {
                  month: "long",
                })} ${new Date().getFullYear()}`;
                await api.applyCalculator({
                  period,
                  type: "monthly",
                  calculator: "vacaciones",
                  rows: [
                    {
                      employee: vacPreview.employee,
                      name: employees.find((e) => e.id === vacPreview.employee)
                        ?.name,
                      value: vacPreview.payAmount,
                      observations: "Pago de vacaciones",
                    },
                  ],
                  params: {
                    daysPerYear: vacDaysPerYear,
                    daysTaken: vacDaysTaken,
                  },
                });
                setOpenVacaciones(false);
                refreshData();
              }}
            >
              Pagar ahora
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Empleado
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={vacEmpId}
              onChange={(e) => setVacEmpId(e.target.value)}
            >
              <option value="">Seleccione</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Días/año"
            type="number"
            value={vacDaysPerYear}
            onChange={(e) =>
              setVacDaysPerYear(parseFloat(e.target.value || "15"))
            }
          />
          <Input
            label="Días tomados (opcional)"
            type="number"
            value={vacDaysTaken}
            onChange={(e) => setVacDaysTaken(parseFloat(e.target.value || "0"))}
          />
          <div className="flex items-center space-x-2 mt-6">
            <input
              id="paynow"
              type="checkbox"
              checked={vacPayNow}
              onChange={(e) => setVacPayNow(e.target.checked)}
            />
            <label htmlFor="paynow" className="text-sm text-gray-700">
              Pago en dinero
            </label>
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={async () => {
                if (!vacEmpId) return;
                const e = employees.find((x) => x.id === vacEmpId);
                const resp = await api.calcVacaciones({
                  employeeId: vacEmpId,
                  startDate: e?.startDate,
                  daysPerYear: vacDaysPerYear,
                  daysTaken: vacDaysTaken,
                  payNow: vacPayNow,
                  salary: e?.salary,
                });
                setVacPreview(resp);
              }}
            >
              Calcular
            </Button>
          </div>
        </div>
        {vacPreview && (
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              Días Devengados:{" "}
              <span className="font-medium">{vacPreview.accruedDays}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Días Tomados:{" "}
              <span className="font-medium">{vacPreview.takenDays}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Saldo Días:{" "}
              <span className="font-medium">{vacPreview.balanceDays}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Pago Vacaciones:{" "}
              <span className="font-bold text-green-700">
                ${vacPreview.payAmount}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Modales: Liquidación */}
      <Modal
        open={openLiquidacion}
        title="Liquidación"
        onClose={() => setOpenLiquidacion(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenLiquidacion(false)}>
              Cerrar
            </Button>
            <Button
              onClick={async () => {
                if (!liqPreview) return;
                const period = `Liquidación ${new Date()
                  .toISOString()
                  .slice(0, 7)}`;
                await api.applyCalculator({
                  period,
                  type: "liquidacion",
                  calculator: "liquidacion",
                  rows: [
                    {
                      employee: liqPreview.employee,
                      name: employees.find((e) => e.id === liqPreview.employee)
                        ?.name,
                      value: liqPreview.total,
                      observations: "Liquidación",
                    },
                  ],
                  params: liqPreview,
                });
                setOpenLiquidacion(false);
                refreshData();
              }}
            >
              Registrar como nómina especial
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Empleado
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={liqEmpId}
              onChange={(e) => setLiqEmpId(e.target.value)}
            >
              <option value="">Seleccione</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              defaultValue={"renuncia"}
            >
              <option value="terminacion">Terminación</option>
              <option value="renuncia">Renuncia</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="liqd"
              type="checkbox"
              checked={liqIncludeDec}
              onChange={(e) => setLiqIncludeDec(e.target.checked)}
            />
            <label htmlFor="liqd" className="text-sm">
              Incluir décimos
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="liqv"
              type="checkbox"
              checked={liqIncludeVac}
              onChange={(e) => setLiqIncludeVac(e.target.checked)}
            />
            <label htmlFor="liqv" className="text-sm">
              Vacaciones no gozadas
            </label>
          </div>
          <Input
            label="Indemnización (n salarios)"
            type="number"
            value={liqIndemnN}
            onChange={(e) => setLiqIndemnN(parseFloat(e.target.value || "0"))}
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={async () => {
                if (!liqEmpId) return;
                const e = employees.find((x) => x.id === liqEmpId);
                const resp = await api.calcLiquidacion({
                  employeeId: liqEmpId,
                  includeDecimos: liqIncludeDec,
                  includeVacaciones: liqIncludeVac,
                  indemnizationNSalaries: liqIndemnN,
                  salary: e?.salary,
                  startDate: e?.startDate,
                });
                setLiqPreview(resp);
              }}
            >
              Calcular
            </Button>
          </div>
        </div>
        {liqPreview && (
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pendiente de sueldo</span>
              <span>${liqPreview.subtotals.pendingSalary}</span>
            </div>
            <div className="flex justify-between">
              <span>Décimo Tercero</span>
              <span>${liqPreview.subtotals.decimoTercero}</span>
            </div>
            <div className="flex justify-between">
              <span>Décimo Cuarto</span>
              <span>${liqPreview.subtotals.decimoCuarto}</span>
            </div>
            <div className="flex justify-between">
              <span>Vacaciones</span>
              <span>${liqPreview.subtotals.vacationPay}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total a Pagar</span>
              <span className="text-green-700">${liqPreview.total}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Wizard: Nueva Nómina */}
      <Modal
        open={openNewPayroll}
        title="Nueva Nómina"
        onClose={() => setOpenNewPayroll(false)}
        footer={
          <div className="flex items-center space-x-2">
            {wizardStep > 1 && (
              <Button
                variant="secondary"
                onClick={() => setWizardStep((s) => Math.max(1, s - 1) as any)}
              >
                Atrás
              </Button>
            )}
            {wizardStep < 3 && (
              <Button
                onClick={() => setWizardStep((s) => Math.min(3, s + 1) as any)}
              >
                Siguiente
              </Button>
            )}
            {wizardStep === 3 && (
              <>
                <select
                  className="border rounded-lg px-3 py-2"
                  value={statusToSave}
                  onChange={(e) => setStatusToSave(e.target.value as any)}
                >
                  <option value="processing">Guardar como borrador</option>
                  <option value="paid">Marcar como pagada</option>
                </select>
                <Button
                  onClick={async () => {
                    if (!periodStr.trim()) {
                      alert("Ingresa un período válido en el Paso 1");
                      setWizardStep(1);
                      return;
                    }
                    if (!rows.length) {
                      alert("No hay empleados para esta nómina.");
                      setWizardStep(2);
                      return;
                    }
                    await api.upsertPayroll({
                      period: periodStr,
                      type: payrollType,
                      params: { SBU },
                      employees: rows.map((r) => ({
                        employee: r.employee,
                        grossAmount:
                          Number(r.grossAmount || 0) +
                          Number(r.bonuses || 0) +
                          Number(r.overtime || 0),
                        deductions: Number(r.deductions || 0),
                        netAmount: Number(
                          r.netAmount ||
                            Number(r.grossAmount || 0) +
                              Number(r.bonuses || 0) +
                              Number(r.overtime || 0) -
                              Number(r.deductions || 0)
                        ),
                      })),
                      status: statusToSave,
                    });
                    setOpenNewPayroll(false);
                    refreshData();
                  }}
                >
                  Guardar
                </Button>
              </>
            )}
          </div>
        }
      >
        {wizardStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Período (Ej: Agosto 2025)"
              value={periodStr}
              onChange={(e) => setPeriodStr(e.target.value)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                className="border rounded-lg px-3 py-2 w-full"
                value={payrollType}
                onChange={(e) => setPayrollType(e.target.value as any)}
              >
                <option value="monthly">Mensual</option>
                <option value="decimos">Décimos</option>
                <option value="liquidacion">Liquidaciones</option>
              </select>
            </div>
            <Input
              label="SBU (parámetro)"
              type="number"
              value={SBU}
              onChange={(e) => setSBU(parseFloat(e.target.value || "0"))}
            />
            <div className="flex items-end">
              <Button
                onClick={() => setWizardStep(2)}
                disabled={!periodStr.trim()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
        {wizardStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Empleados activos: {rows.length}
              </div>
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const bono = 50;
                    setRows((prev) =>
                      prev.map((r) => ({
                        ...r,
                        bonuses: Number(r.bonuses || 0) + bono,
                        netAmount:
                          Number(r.grossAmount || 0) +
                          Number(r.bonuses || 0) +
                          bono +
                          Number(r.overtime || 0) -
                          Number(r.deductions || 0),
                      }))
                    );
                  }}
                >
                  Aplicar bono fijo +$50
                </Button>
                <Button variant="outline" onClick={recalcNet}>
                  Recalcular netos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const tpl: Record<
                      string,
                      {
                        bonuses?: number;
                        overtime?: number;
                        deductions?: number;
                      }
                    > = {};
                    rows.forEach((r) => {
                      tpl[r.employee] = {
                        bonuses: Number(r.bonuses || 0),
                        overtime: Number(r.overtime || 0),
                        deductions: Number(r.deductions || 0),
                      };
                    });
                    localStorage.setItem(
                      "paysmart_wizard_template",
                      JSON.stringify(tpl)
                    );
                    alert("Plantilla guardada localmente.");
                  }}
                >
                  Guardar plantilla
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      const tplRaw = localStorage.getItem(
                        "paysmart_wizard_template"
                      );
                      if (!tplRaw) return alert("No hay plantilla guardada.");
                      const tpl = JSON.parse(tplRaw) as Record<
                        string,
                        {
                          bonuses?: number;
                          overtime?: number;
                          deductions?: number;
                        }
                      >;
                      setRows((prev) =>
                        prev.map((r) => {
                          const t = tpl[r.employee];
                          if (!t) return r;
                          const bonuses = Number(t.bonuses || 0);
                          const overtime = Number(t.overtime || 0);
                          const deductions = Number(t.deductions || 0);
                          return {
                            ...r,
                            bonuses,
                            overtime,
                            deductions,
                            netAmount:
                              Number(r.grossAmount || 0) +
                              bonuses +
                              overtime -
                              deductions,
                          };
                        })
                      );
                    } catch {}
                  }}
                >
                  Aplicar plantilla
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    localStorage.removeItem("paysmart_wizard_template");
                    alert("Plantilla eliminada.");
                  }}
                >
                  Borrar plantilla
                </Button>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Empleado</th>
                    <th className="py-2 pr-4">Departamento</th>
                    <th className="py-2 pr-4">Sueldo base</th>
                    <th className="py-2 pr-4">Bonos</th>
                    <th className="py-2 pr-4">Horas extra</th>
                    <th className="py-2 pr-4">Deducciones</th>
                    <th className="py-2 pr-4">Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.employee} className="border-t">
                      <td className="py-2 pr-4">{r.name}</td>
                      <td className="py-2 pr-4">{r.department}</td>
                      <td className="py-2 pr-2">
                        <input
                          className="border rounded px-2 py-1 w-28"
                          type="number"
                          value={r.grossAmount}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value || "0");
                            setRows((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      grossAmount: v,
                                      netAmount:
                                        v +
                                        Number(x.bonuses || 0) +
                                        Number(x.overtime || 0) -
                                        Number(x.deductions || 0),
                                    }
                                  : x
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          className="border rounded px-2 py-1 w-24"
                          type="number"
                          value={r.bonuses || 0}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value || "0");
                            setRows((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      bonuses: v,
                                      netAmount:
                                        Number(x.grossAmount || 0) +
                                        v +
                                        Number(x.overtime || 0) -
                                        Number(x.deductions || 0),
                                    }
                                  : x
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          className="border rounded px-2 py-1 w-24"
                          type="number"
                          value={r.overtime || 0}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value || "0");
                            setRows((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      overtime: v,
                                      netAmount:
                                        Number(x.grossAmount || 0) +
                                        Number(x.bonuses || 0) +
                                        v -
                                        Number(x.deductions || 0),
                                    }
                                  : x
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          className="border rounded px-2 py-1 w-24"
                          type="number"
                          value={r.deductions}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value || "0");
                            setRows((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      deductions: v,
                                      netAmount:
                                        Number(x.grossAmount || 0) +
                                        Number(x.bonuses || 0) +
                                        Number(x.overtime || 0) -
                                        v,
                                    }
                                  : x
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="py-2 pr-4 font-medium text-green-700">
                        ${r.netAmount?.toLocaleString?.() || r.netAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded flex items-center justify-between">
              <div className="text-sm text-gray-700">Totales</div>
              <div className="space-x-6 text-sm">
                <span>
                  Bruto: <strong>${totals.totalGross.toLocaleString()}</strong>
                </span>
                <span>
                  Deducciones:{" "}
                  <strong>-${totals.totalDeductions.toLocaleString()}</strong>
                </span>
                <span>
                  Neto:{" "}
                  <strong className="text-green-700">
                    ${totals.totalNet.toLocaleString()}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}
        {wizardStep === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              Se incluirán {rows.length} empleados. Revisa los totales antes de
              confirmar.
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Bruto</span>
                <span>${totals.totalGross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deducciones</span>
                <span>-${totals.totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Neto</span>
                <span className="text-green-700">
                  ${totals.totalNet.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

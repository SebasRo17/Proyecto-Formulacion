import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  Employee,
  PayrollItem,
  PayrollRecord,
  AIInsight,
  Notification,
  Report,
} from "../types";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

interface AppContextType {
  employees: Employee[];
  payrollItems: PayrollItem[];
  payrollRecords: PayrollRecord[];
  aiInsights: AIInsight[];
  setAiInsights: (insights: AIInsight[]) => void;
  notifications: Notification[];
  reports: Report[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  markNotificationAsRead: (id: string) => void;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  createSampleData: () => Promise<void>;
  createSamplePayrolls: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    position: "Desarrollador Senior",
    department: "Tecnología",
    salary: 2500,
    startDate: new Date("2022-01-15"),
    status: "active",
    cedula: "1750123456",
    phone: "0998765432",
    address: "Quito, Ecuador",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  },
  {
    id: "2",
    name: "Sofia Martínez",
    email: "sofia.martinez@empresa.com",
    position: "Diseñadora UX",
    department: "Diseño",
    salary: 2000,
    startDate: new Date("2022-03-10"),
    status: "active",
    cedula: "1750654321",
    phone: "0991234567",
    address: "Guayaquil, Ecuador",
    avatar:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  },
  {
    id: "3",
    name: "Diego Ramos",
    email: "diego.ramos@empresa.com",
    position: "Analista de Marketing",
    department: "Marketing",
    salary: 1800,
    startDate: new Date("2021-11-05"),
    status: "active",
    cedula: "1750987654",
    phone: "0987654321",
    address: "Cuenca, Ecuador",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    type: "turnover_prediction",
    title: "Riesgo de Rotación Detectado",
    description:
      "El algoritmo ha identificado a 2 empleados con alta probabilidad de renunciar en los próximos 3 meses.",
    severity: "high",
    confidence: 87,
    recommendations: [
      "Programar reuniones 1:1 con los empleados identificados",
      "Revisar la estructura salarial del departamento",
      "Implementar plan de desarrollo profesional",
    ],
    affectedEmployees: ["2", "3"],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    type: "cost_optimization",
    title: "Oportunidad de Optimización de Costos",
    description:
      "Se detectaron patrones en horas extra que podrían optimizarse.",
    severity: "medium",
    confidence: 73,
    recommendations: [
      "Redistribuir carga de trabajo en el departamento de Tecnología",
      "Considerar contratación de personal adicional temporal",
      "Revisar procesos para mejorar eficiencia",
    ],
    createdAt: new Date("2024-01-12"),
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nómina de Enero Lista",
    message: "La nómina del mes de enero ha sido procesada exitosamente.",
    type: "success",
    read: false,
    createdAt: new Date("2024-01-15T10:30:00"),
    actionUrl: "/payroll",
  },
  {
    id: "2",
    title: "Reporte IESS Pendiente",
    message:
      "El reporte mensual del IESS debe ser enviado antes del 15 de febrero.",
    type: "warning",
    read: false,
    createdAt: new Date("2024-01-14T09:15:00"),
    actionUrl: "/reports",
  },
  {
    id: "3",
    title: "Nueva Actualización Disponible",
    message:
      "PaySmart AI v2.1 está disponible con mejoras en predicciones de IA.",
    type: "info",
    read: true,
    createdAt: new Date("2024-01-13T14:20:00"),
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [payrollItems] = useState<PayrollItem[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [reports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch AI insights from backend
  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAIInsights();

      // Transform backend data to match frontend interface
      const transformedData = data.map((insight: any) => ({
        id: insight._id || insight.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        confidence:
          typeof insight.confidence === "number"
            ? Math.round(
                insight.confidence <= 1
                  ? insight.confidence * 100
                  : insight.confidence
              )
            : 0,
        recommendations:
          insight.recommendations ||
          (insight.recommendedAction ? [insight.recommendedAction] : []),
        affectedEmployees: (
          insight.affectedEmployees ||
          insight.affectedEmployeeIds ||
          []
        ).map((emp: any) => emp?._id || emp),
        createdAt: new Date(insight.createdAt || Date.now()),
      }));

      setAiInsights(transformedData);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError("Error al cargar los insights de IA");
      // Fallback to mock data on error
      setAiInsights(mockAIInsights);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch payroll records from backend
  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPayrolls();

      // Transform backend data to match frontend interface
      const transformedData = data.map((payroll: any) => ({
        id: payroll._id,
        period: payroll.period,
        employees: payroll.employees?.length || 0,
        grossAmount: payroll.totalGross || 0,
        deductions: payroll.totalDeductions || 0,
        netAmount: payroll.totalNet || 0,
        status: payroll.status || "draft",
        createdAt: new Date(payroll.createdAt),
      }));

      setPayrollRecords(transformedData);
    } catch (err) {
      console.error("Error fetching payroll records:", err);
      setError("Error al cargar las nóminas");
      // Keep empty array on error
      setPayrollRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchAIInsights(),
      fetchPayrollRecords(),
      fetchEmployees(),
    ]);
  };

  // Function to create sample AI insights data
  const createSampleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("paysmart_token") || undefined;
      const now = new Date();
      const period = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      await api.generateAIInsights(period, token || undefined);
      // Refresh data after creating sample data
      await fetchAIInsights();
    } catch (err) {
      console.error("Error creating sample data:", err);
      setError("Error al crear datos de prueba");
    } finally {
      setLoading(false);
    }
  };

  // Function to create sample payroll data
  const createSamplePayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.createSamplePayrolls();
      // Refresh data after creating sample data
      await fetchPayrollRecords();
    } catch (err) {
      console.error("Error creating sample payrolls:", err);
      setError("Error al crear nóminas de prueba");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAIInsights();
    fetchPayrollRecords();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load employees from backend
  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees(token || undefined);
      const uiEmployees: Employee[] = data.map((e: any) => ({
        id: e._id || e.id,
        name: e.name,
        email: e.email,
        position: e.position,
        department: e.department,
        salary: e.salary,
        startDate: new Date(e.startDate),
        status: e.status,
        avatar: e.avatar,
        cedula: e.cedula,
        phone: e.phone,
        address: e.address,
      }));
      setEmployees(uiEmployees);
    } catch (err) {
      // Mantener mock si falla
      console.warn("No se pudieron cargar empleados, usando mock.");
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        payrollItems,
        payrollRecords,
        aiInsights,
        setAiInsights,
        notifications,
        reports,
        currentPage,
        setCurrentPage,
        markNotificationAsRead,
        loading,
        error,
        refreshData,
        createSampleData,
        createSamplePayrolls,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

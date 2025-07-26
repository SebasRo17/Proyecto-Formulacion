import React, { createContext, useContext, useState } from 'react';
import type { Employee, PayrollItem, AIInsight, Notification, Report } from '../types';

interface AppContextType {
  employees: Employee[];
  payrollItems: PayrollItem[];
  aiInsights: AIInsight[];
  notifications: Notification[];
  reports: Report[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    position: 'Desarrollador Senior',
    department: 'Tecnología',
    salary: 2500,
    startDate: new Date('2022-01-15'),
    status: 'active',
    cedula: '1750123456',
    phone: '0998765432',
    address: 'Quito, Ecuador',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
  },
  {
    id: '2',
    name: 'Sofia Martínez',
    email: 'sofia.martinez@empresa.com',
    position: 'Diseñadora UX',
    department: 'Diseño',
    salary: 2000,
    startDate: new Date('2022-03-10'),
    status: 'active',
    cedula: '1750654321',
    phone: '0991234567',
    address: 'Guayaquil, Ecuador',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
  },
  {
    id: '3',
    name: 'Diego Ramos',
    email: 'diego.ramos@empresa.com',
    position: 'Analista de Marketing',
    department: 'Marketing',
    salary: 1800,
    startDate: new Date('2021-11-05'),
    status: 'active',
    cedula: '1750987654',
    phone: '0987654321',
    address: 'Cuenca, Ecuador',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
  }
];

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'turnover_prediction',
    title: 'Riesgo de Rotación Detectado',
    description: 'El algoritmo ha identificado a 2 empleados con alta probabilidad de renunciar en los próximos 3 meses.',
    severity: 'high',
    confidence: 87,
    recommendations: [
      'Programar reuniones 1:1 con los empleados identificados',
      'Revisar la estructura salarial del departamento',
      'Implementar plan de desarrollo profesional'
    ],
    affectedEmployees: ['2', '3'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'cost_optimization',
    title: 'Oportunidad de Optimización de Costos',
    description: 'Se detectaron patrones en horas extra que podrían optimizarse.',
    severity: 'medium',
    confidence: 73,
    recommendations: [
      'Redistribuir carga de trabajo en el departamento de Tecnología',
      'Considerar contratación de personal adicional temporal',
      'Revisar procesos para mejorar eficiencia'
    ],
    createdAt: new Date('2024-01-12')
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nómina de Enero Lista',
    message: 'La nómina del mes de enero ha sido procesada exitosamente.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    actionUrl: '/payroll'
  },
  {
    id: '2',
    title: 'Reporte IESS Pendiente',
    message: 'El reporte mensual del IESS debe ser enviado antes del 15 de febrero.',
    type: 'warning',
    read: false,
    createdAt: new Date('2024-01-14T09:15:00'),
    actionUrl: '/reports'
  },
  {
    id: '3',
    title: 'Nueva Actualización Disponible',
    message: 'PaySmart AI v2.1 está disponible con mejoras en predicciones de IA.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-01-13T14:20:00')
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [payrollItems] = useState<PayrollItem[]>([]);
  const [aiInsights] = useState<AIInsight[]>(mockAIInsights);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [reports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <AppContext.Provider value={{
      employees,
      payrollItems,
      aiInsights,
      notifications,
      reports,
      currentPage,
      setCurrentPage,
      markNotificationAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
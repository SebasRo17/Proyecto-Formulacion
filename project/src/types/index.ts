// Types and interfaces for the PaySmart AI platform
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rrhh' | 'contador' | 'empleado';
  company: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  startDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  cedula: string;
  phone: string;
  address: string;
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  createdAt: Date;
}

export interface AIInsight {
  id: string;
  type: 'turnover_prediction' | 'performance_anomaly' | 'cost_optimization';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  affectedEmployees?: string[];
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  sector: string;
  employeeCount: number;
  plan: 'startup' | 'pyme-pro' | 'empresarial';
  logo?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'iess' | 'sri' | 'internal' | 'payroll';
  period: string;
  status: 'generating' | 'ready' | 'error';
  fileUrl?: string;
  createdAt: Date;
}
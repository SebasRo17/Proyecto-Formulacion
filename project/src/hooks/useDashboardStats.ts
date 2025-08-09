import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';


// Define el tipo de los datos que devuelve el backend
type DashboardStats = {
  totalActive: number;
  totalSalaries: number;
  turnover: number;
  departmentCosts: { [key: string]: number }; 
  activeInsights: number;
  netPayrolls: NetPayroll[];
};

//  Define el estado completo con loading y error
type DashboardStatsState = DashboardStats & {
  loading: boolean;
  error: string | null;
};

//Define un nuvo tipo para netPayrolls
type NetPayroll = {
  period: string;
  totalNet: number;
};


// Hook principal
export function useDashboardStats() {
    const [dashboardData, setDashboardData] = useState<DashboardStatsState>({
    totalActive: 0,
    totalSalaries: 0,
    turnover: 0,
    activeInsights: 0,
    departmentCosts: {},
    netPayrolls: [],
    loading: true,
    error: null
     });


const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
  const token = localStorage.getItem('paysmart_token');

      const [statsRes, insightsRes, netRes] = await Promise.all([
        axios.get<DashboardStats>(`${API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get<{ success: boolean; count: number }>(`${API_BASE_URL}/dashboard/active-insights-count`),
        axios.get<{ success: boolean; data: NetPayroll[] }>(`${API_BASE_URL}/dashboard/net-payrolls`) // <-- nuevo
      ]);

        setDashboardData({
          ...statsRes.data,
          activeInsights: insightsRes.data.count,
          netPayrolls: netRes.data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error en useDashboardStats', error);
        setDashboardData(prev => ({ ...prev, error: 'Error al cargar datos', loading: false }));
      }
    };

    fetchStats();
  }, [token]);

  return dashboardData;
}

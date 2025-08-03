import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';


// 1️⃣ Define el tipo de los datos que devuelve el backend
type DashboardStats = {
  totalActive: number;
  totalSalaries: number;
  turnover: number;
  departmentCosts: { [key: string]: number }; // objeto clave-valor
};

// 2️⃣ Define el estado completo con loading y error
type DashboardStatsState = DashboardStats & {
  loading: boolean;
  error: string | null;
};

// 3️⃣ Hook principal
export function useDashboardStats() {
    const [dashboardData, setDashboardData] = useState<DashboardStatsState>({
    totalActive: 0,
    totalSalaries: 0,
    turnover: 0,
    departmentCosts: {},
    loading: true,
    error: null
     });


const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DashboardStats>('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDashboardData({
          ...response.data,
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

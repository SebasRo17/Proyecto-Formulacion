import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Employee } from '../types';
import { API_BASE_URL } from '../config';

export function useEmployees() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  // const [activeCount, setActiveCount] = useState<number>(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [totalSalaries, setTotalSalaries] = useState<number>(0); // Total salaries of all employees

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const fetchEmployees = async () => {
      setLoading(true);
      try {
  const res = await fetch(`${API_BASE_URL}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data);
      } catch {
        setError('Error al cargar empleados');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    }, [token]);

  return { employees, loading, error, setEmployees };
}

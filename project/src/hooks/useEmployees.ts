import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Employee } from '../types';

export function useEmployees() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:5000/api/employees', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar empleados');
        setLoading(false);
      });
  }, [token]);

  return { employees, loading, error, setEmployees };
}

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AIInsight } from '../types';

export function useAIInsights() {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAIInsights();
      
      // Transform backend data to match frontend interface
      const transformedData = data.map((insight: any) => ({
        id: insight._id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        confidence: insight.confidence,
        recommendations: insight.recommendations || [],
        affectedEmployees: insight.affectedEmployees?.map((emp: any) => emp._id || emp) || [],
        createdAt: new Date(insight.createdAt)
      }));
      
      setAiInsights(transformedData);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Error al cargar los insights de IA');
      // Fallback to empty array on error
      setAiInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const refreshInsights = () => {
    fetchAIInsights();
  };

  return {
    aiInsights,
    loading,
    error,
    refreshInsights,
    setAiInsights
  };
}

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Payroll } from './pages/Payroll';
import { AIInsights } from './pages/AIInsights';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';

// Placeholder components for missing pages
const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500 mt-4">Esta funcionalidad estará disponible próximamente</p>
    </div>
  </div>
);

const Signup = () => <PlaceholderPage title="Registro de Empresa" description="Crea tu cuenta empresarial en PaySmart AI" />;
const Onboarding = () => <PlaceholderPage title="Configuración Inicial" description="Wizard de configuración paso a paso" />;
const Bonuses = () => <PlaceholderPage title="Gestión de Bonificaciones" description="Configura bonos e incentivos para tus empleados" />;
const PlansBilling = () => <PlaceholderPage title="Planes y Facturación" description="Gestiona tu suscripción y facturación SaaS" />;

export function Router() {
  const { user, isLoading } = useAuth();
  const { currentPage } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando PaySmart AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'payroll': return <Payroll />;
      case 'bonuses': return <Bonuses />;
      case 'ai-insights': return <AIInsights />;
      case 'reports': return <Reports />;
      case 'plans-billing': return <PlansBilling />;
      case 'settings': return <Settings />;
      case 'notifications': return <Notifications />;
      case 'support': return <Support />;
      case 'signup': return <Signup />;
      case 'onboarding': return <Onboarding />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}
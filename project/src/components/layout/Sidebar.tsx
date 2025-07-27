import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Gift, 
  Brain, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell, 
  HelpCircle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'rrhh', 'contador'] },
  { id: 'employees', icon: Users, label: 'Empleados', roles: ['admin', 'rrhh'] },
  { id: 'payroll', icon: Calculator, label: 'Nómina', roles: ['admin', 'rrhh', 'contador'] },
  { id: 'ai-insights', icon: Brain, label: 'IA Insights', roles: ['admin', 'rrhh'] },
  { id: 'reports', icon: FileText, label: 'Reportes', roles: ['admin', 'contador'] },
  { id: 'settings', icon: Settings, label: 'Configuración', roles: ['admin'] },
  { id: 'support', icon: HelpCircle, label: 'Soporte', roles: ['admin', 'rrhh', 'contador'] }
];

export function Sidebar() {
  const { user } = useAuth();
  const { currentPage, setCurrentPage } = useApp();

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Building2 className="w-8 h-8 text-blue-600" />
        <div className="ml-3">
          <h1 className="text-xl font-bold text-gray-900">PaySmart AI</h1>
          <p className="text-xs text-gray-500">by SENOVAJ SAS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt={user?.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
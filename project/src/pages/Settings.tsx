import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Database,
  Key,
  History,
  Save
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const settingsSections = [
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'integrations', label: 'Integraciones', icon: Database },
  { id: 'audit', label: 'Auditoría', icon: History }
];

export function Settings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('company');

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Razón Social"
            defaultValue="TechCorp Ecuador S.A."
            className="text-sm"
          />
          <Input
            label="RUC"
            defaultValue="1792146739001"
            className="text-sm"
          />
          <Input
            label="Dirección"
            defaultValue="Av. Amazonas N21-21 y Roca, Quito"
            className="text-sm"
          />
          <Input
            label="Sector Económico"
            defaultValue="Tecnología"
            className="text-sm"
          />
          <Input
            label="Teléfono"
            defaultValue="+593 2 2456789"
            className="text-sm"
          />
          <Input
            label="Email Corporativo"
            defaultValue="info@techcorp.ec"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Nómina</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Salario Básico Unificado"
            defaultValue="460"
            type="number"
            className="text-sm"
          />
          <Input
            label="Décimo Cuarto (SBU)"
            defaultValue="460"
            type="number"
            className="text-sm"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de Pago
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>15 de cada mes</option>
              <option>30 de cada mes</option>
              <option>Último día laboral</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>USD - Dólar Americano</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
        <Button size="sm">Invitar Usuario</Button>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Ana García', email: 'admin@empresa.com', role: 'admin', status: 'active' },
          { name: 'Carlos López', email: 'rrhh@empresa.com', role: 'rrhh', status: 'active' },
          { name: 'María Rodríguez', email: 'contador@empresa.com', role: 'contador', status: 'active' }
        ].map((userItem, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://images.pexels.com/photos/104343${index + 1}/pexels-photo-104343${index + 1}.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                    alt={userItem.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{userItem.name}</p>
                    <p className="text-sm text-gray-500">{userItem.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="success" size="sm">
                    {userItem.role === 'admin' ? 'Administrador' :
                     userItem.role === 'rrhh' ? 'RRHH' : 'Contador'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Autenticación de Dos Factores</h4>
                  <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Política de Contraseñas</h4>
                  <p className="text-sm text-gray-500">Configura requisitos de contraseña</p>
                </div>
                <Badge variant="success">Activa</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sesiones Activas</h4>
                  <p className="text-sm text-gray-500">Revisa y cierra sesiones</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Sesiones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Integraciones Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'SAP', description: 'Sistema de gestión empresarial', status: 'available', logo: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
            { name: 'Odoo', description: 'Suite de aplicaciones empresariales', status: 'connected', logo: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
            { name: 'Workday', description: 'Gestión de recursos humanos', status: 'available', logo: 'https://images.pexels.com/photos/1181624/pexels-photo-1181624.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
            { name: 'Slack', description: 'Comunicación empresarial', status: 'connected', logo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' }
          ].map((integration, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                  <div className="text-right">
                    {integration.status === 'connected' ? (
                      <Badge variant="success" size="sm">Conectado</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Conectar</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAuditSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Registro de Auditoría</h3>
        <div className="space-y-3">
          {[
            { action: 'Nómina procesada', user: 'Ana García', timestamp: '2024-01-15 10:30:00', type: 'success' },
            { action: 'Usuario agregado', user: 'Ana García', timestamp: '2024-01-14 15:45:00', type: 'info' },
            { action: 'Configuración modificada', user: 'Carlos López', timestamp: '2024-01-14 09:20:00', type: 'warning' },
            { action: 'Intento de acceso fallido', user: 'Sistema', timestamp: '2024-01-13 22:15:00', type: 'error' }
          ].map((log, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'warning' ? 'bg-yellow-500' :
                      log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-500">por {log.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'company': return renderCompanySettings();
      case 'users': return renderUsersSettings();
      case 'security': return renderSecuritySettings();
      case 'integrations': return renderIntegrationsSettings();
      case 'audit': return renderAuditSettings();
      default: return renderCompanySettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">
            Administra la configuración de tu cuenta y empresa
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <div>
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
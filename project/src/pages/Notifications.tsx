import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import type { Notification } from '../types';

export function Notifications() {
  const { notifications, markNotificationAsRead } = useApp();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'hace unos minutos';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-600 mt-1">
            Mantente al día con todas las actualizaciones importantes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="info" className="px-3 py-1">
            <Bell className="w-4 h-4 mr-1" />
            {unreadNotifications.length} sin leer
          </Badge>
          <Button variant="outline" size="sm">
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin leer</p>
                <p className="text-2xl font-bold text-blue-600">{unreadNotifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-red-600">
                  {notifications.filter(n => n.type === 'error' || n.type === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Éxitos</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.type === 'success').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unread notifications */}
      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificaciones Nuevas</h2>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              const colorClasses = getTypeColor(notification.type);
              
              return (
                <Card key={notification.id} className={`border-l-4 ${
                  notification.type === 'success' ? 'border-l-green-500' :
                  notification.type === 'warning' ? 'border-l-yellow-500' :
                  notification.type === 'error' ? 'border-l-red-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(notification.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm">
                                Ver
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Read notifications */}
      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificaciones Anteriores</h2>
          <div className="space-y-3">
            {readNotifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              const colorClasses = getTypeColor(notification.type);
              
              return (
                <Card key={notification.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(notification.createdAt)}
                              <CheckCircle className="w-3 h-3 ml-2 text-green-500" />
                              <span className="ml-1">Leído</span>
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <Button variant="ghost" size="sm" className="ml-4">
                              Ver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-500">
              Todas las notificaciones importantes aparecerán aquí
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
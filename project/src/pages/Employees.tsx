import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, MapPin, Phone, Mail, X, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DataTable } from '../components/ui/DataTable';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../contexts/AuthContext';
import type { Employee } from '../types';

export function Employees() {
  const { employees, loading, error, setEmployees } = useEmployees();
  const { token } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    cedula: '',
    phone: '',
    address: ''
  });
  const [adding, setAdding] = useState(false);

  // Agregar empleado - POST al backend
  const handleAddEmployee = async () => {
    setAdding(true);
    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newEmployee,
          salary: Number(newEmployee.salary), // asegúrate de enviar número
          startDate: new Date(selectedEmployee.startDate).toLocaleDateString('es-EC') // O deja que el backend lo gestione si es automático
        })
      });
      if (!res.ok) throw new Error('Error al crear empleado');
      const created = await res.json();
      setEmployees(prev => [...prev, created]);
      setShowAddModal(false);
      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        cedula: '',
        phone: '',
        address: ''
      });
    } catch {
      alert('No se pudo crear el empleado');
    }
    setAdding(false);
  };

  // Eliminar empleado - DELETE al backend
  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este empleado?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error('Error al eliminar empleado');
      setEmployees(prev => prev.filter(emp => emp._id !== id && emp.id !== id));
      if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.id === id)) {
        setSelectedEmployee(null);
      }
    } catch {
      alert('No se pudo eliminar el empleado');
    }
  };

  const columns = [
    {
      key: 'avatar',
      header: '',
      width: '60px',
      render: (employee: Employee) => (
        <img
          src={employee.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
          alt={employee.name}
          className="w-8 h-8 rounded-full"
        />
      )
    },
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (employee: Employee) => (
        <div>
          <p className="font-medium text-gray-900">{employee.name}</p>
          <p className="text-sm text-gray-500">{employee.cedula}</p>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Cargo',
      sortable: true,
      render: (employee: Employee) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{employee.position}</p>
          <p className="text-xs text-gray-500">{employee.department}</p>
        </div>
      )
    },
    {
      key: 'salary',
      header: 'Salario',
      sortable: true,
      render: (employee: Employee) => (
        <span className="font-medium text-gray-900">${employee.salary?.toLocaleString()}</span>
      )
    },
    {
      key: 'startDate',
      header: 'Fecha Ingreso',
      sortable: true,
      render: (employee: Employee) => (
        <span className="text-sm text-gray-600">
          {employee.startDate ? new Date(employee.startDate).toLocaleDateString('es-EC') : ''}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      render: (employee: Employee) => (
        <Badge
          variant={employee.status === 'active' ? 'success' : 'default'}
        >
          {employee.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (employee: Employee) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEmployee(employee)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEmployee(employee._id || employee.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) return <div>Cargando empleados...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600 mt-1">
            Administra la información de tu equipo de trabajo
          </p>
        </div>
        <Button 
          className="flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Empleado
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Empleados</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salario Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length).toLocaleString()}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(employees.map(e => e.department)).size}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Empleados</CardTitle>
            </CardHeader>
            <CardContent padding="none">
              <DataTable
                data={employees}
                columns={columns}
                searchable={true}
                filterable={true}
                exportable={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Employee details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedEmployee ? 'Detalles del Empleado' : 'Selecciona un Empleado'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmployee ? (
                <div className="space-y-6">
                  {/* Photo and basic info */}
                  <div className="text-center">
                    <img
                      src={selectedEmployee.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                      alt={selectedEmployee.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <Badge
                      variant={selectedEmployee.status === 'active' ? 'success' : 'default'}
                      className="mt-2"
                    >
                      {selectedEmployee.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{selectedEmployee.address}</span>
                    </div>
                  </div>

                  {/* Employment details */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Información Laboral</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departamento:</span>
                        <span className="font-medium">{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salario:</span>
                        <span className="font-medium">${selectedEmployee.salary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Ingreso:</span>
                        <span className="font-medium">
                          {selectedEmployee.startDate
                            ? new Date(selectedEmployee.startDate).toLocaleDateString('es-EC')
                            : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                        `  {selectedEmployee.startDate
                            ? Math.round((Date.now() - new Date(selectedEmployee.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
                            : 0} meses
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4 space-y-3">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Información
                    </Button>
                    <Button variant="outline" className="w-full">
                      Ver Historial Salarial
                    </Button>
                    <Button variant="outline" className="w-full">
                      Gestionar Ausencias
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Haz clic en un empleado para ver sus detalles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Empleado</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre Completo"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Juan Pérez"
                  required
                />
                <Input
                  label="Cédula"
                  value={newEmployee.cedula}
                  onChange={(e) => setNewEmployee({...newEmployee, cedula: e.target.value})}
                  placeholder="1750123456"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="juan.perez@empresa.com"
                  required
                />
                <Input
                  label="Teléfono"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="0998765432"
                  required
                />
                <Input
                  label="Cargo"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Desarrollador Senior"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RRHH">RRHH</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>
                <Input
                  label="Salario"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  placeholder="2500"
                  required
                />
              </div>
              
              <Input
                label="Dirección"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                placeholder="Av. Amazonas N21-21, Quito"
                required
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button 
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddEmployee}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Empleado
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
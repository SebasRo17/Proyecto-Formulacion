import React, { useState } from 'react';
import { Building2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
  setError('Credenciales inválidas. Verifica tu correo y contraseña.');
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PaySmart AI</h1>
          <p className="text-gray-600">Nómina inteligente para empresas modernas</p>
          <p className="text-sm text-gray-500 mt-1">by SENOVAJ SAS</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                required
                className="text-base"
              />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="text-base pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <Alert type="error" className="text-sm">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full text-base py-3"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Registrar empresa
              </button>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Credenciales de demostración:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Admin:</strong> admin@empresa.com / password</p>
            <p><strong>RRHH:</strong> rrhh@empresa.com / password</p>
            <p><strong>Contador:</strong> contador@empresa.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Página de login
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  UserCheck,
  Users
} from 'lucide-react';

const LoginPage = () => {
  const { login, loading, error, clearError } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  
  // Usuários de demonstração
  const demoUsers = [
    {
      email: 'gestor@empresa.com',
      password: '123456',
      name: 'João Silva',
      role: 'manager',
      type: 'Gestor'
    },
    {
      email: 'cliente@empresa.com',
      password: '123456',
      name: 'Maria Santos',
      role: 'client',
      type: 'Cliente'
    }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (error) {
      clearError();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }
    
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      console.error('Erro no login:', result.error);
    }
  };
  
  const handleDemoLogin = (user) => {
    setFormData({
      email: user.email,
      password: user.password
    });
    setSelectedUserType(user.type);
  };
  
  const quickLogin = async (user) => {
    const result = await login(user.email, user.password);
    if (!result.success) {
      console.error('Erro no login:', result.error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema de Projetos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar seus projetos
          </p>
        </div>
        
        {/* Usuários de demonstração */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Acesso Rápido - Demonstração
          </h3>
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  {user.role === 'manager' ? (
                    <UserCheck className="h-5 w-5 text-blue-600 mr-3" />
                  ) : (
                    <Users className="h-5 w-5 text-green-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user)}
                    className="text-xs"
                  >
                    Preencher
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => quickLogin(user)}
                    className="text-xs"
                  >
                    Entrar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Formulário de login */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo de email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            {/* Campo de senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Exibir erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}
            
            {/* Tipo de usuário selecionado */}
            {selectedUserType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    Entrando como: {selectedUserType}
                  </span>
                </div>
              </div>
            )}
            
            {/* Botão de login */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </div>
              )}
            </Button>
          </form>
        </div>
        
        {/* Informações adicionais */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sistema de demonstração - Use as credenciais acima para testar
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


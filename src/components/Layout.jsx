// Layout principal da aplicação
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Menu, 
  X, 
  Home, 
  FolderOpen, 
  Plus, 
  User, 
  LogOut,
  Settings,
  Search
} from 'lucide-react';

const Layout = ({ children, navigationItems = [] }) => {
  const { currentUser, isAuthenticated, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Se não estiver autenticado, renderizar apenas o conteúdo (página de login)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  const isManager = currentUser?.role === 'manager';
  
  // Itens de navegação padrão se não fornecidos
  const defaultNavigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      onClick: () => {},
      show: true,
      active: false
    },
    {
      name: 'Projetos',
      icon: FolderOpen,
      onClick: () => {},
      show: true,
      active: false
    },
    {
      name: 'Novo Projeto',
      icon: Plus,
      onClick: () => {},
      show: isManager,
      active: false
    },
    {
      name: 'Configurações',
      icon: Settings,
      onClick: () => {},
      show: isManager,
      active: false
    }
  ];
  
  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems;
  
  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e botão do menu mobile */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              
              <div className="flex items-center ml-2 lg:ml-0">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    ProjectManager
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Barra de pesquisa - apenas desktop */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Pesquisar projetos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Informações do usuário */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex sm:items-center sm:space-x-2">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{currentUser?.name}</p>
                  <p className="text-gray-500 text-xs">
                    {isManager ? 'Gestor' : 'Cliente'}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Navegação principal */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.filter(item => item.show).map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick && item.onClick();
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.active 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  {!item.icon && item.name === 'Dashboard' && <Home className="mr-3 h-5 w-5" />}
                  {!item.icon && item.name === 'Projetos' && <FolderOpen className="mr-3 h-5 w-5" />}
                  {!item.icon && item.name === 'Novo Projeto' && <Plus className="mr-3 h-5 w-5" />}
                  {!item.icon && item.name === 'Configurações' && <Settings className="mr-3 h-5 w-5" />}
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Informações do usuário no mobile */}
            <div className="lg:hidden border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">
                    {isManager ? 'Gestor' : 'Cliente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Conteúdo principal */}
        <main className="flex-1 lg:ml-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;


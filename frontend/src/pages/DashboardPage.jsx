// Página de dashboard principal
import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProgressBar, { CircularProgress } from '../components/ProgressBar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FolderOpen,
  Users,
  DollarSign
} from 'lucide-react';
import { formatCurrency, getStatusText } from '../utils/helpers.js';

const DashboardPage = () => {
  const { 
    currentUser, 
    projects, 
    stages, 
    tasks,
    projectFilter,
    setProjectFilter 
  } = useApp();
  
  const isManager = currentUser?.role === 'manager';
  
  // Filtrar projetos baseado no usuário
  const userProjects = useMemo(() => {
    if (isManager) {
      return projects.filter(project => project.managerId === currentUser.id);
    } else {
      return projects.filter(project => project.clientId === currentUser.id);
    }
  }, [projects, currentUser, isManager]);
  
  // Estatísticas dos projetos
  const projectStats = useMemo(() => {
    const total = userProjects.length;
    const pending = userProjects.filter(p => p.status === 'pending').length;
    const inProgress = userProjects.filter(p => p.status === 'in_progress').length;
    const completed = userProjects.filter(p => p.status === 'completed').length;
    const totalValue = userProjects.reduce((sum, p) => sum + (p.value || 0), 0);
    const avgProgress = total > 0 ? userProjects.reduce((sum, p) => sum + p.progress, 0) / total : 0;
    
    return {
      total,
      pending,
      inProgress,
      completed,
      totalValue,
      avgProgress: Math.round(avgProgress)
    };
  }, [userProjects]);
  
  // Projetos filtrados
  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') return userProjects;
    return userProjects.filter(project => project.status === projectFilter);
  }, [userProjects, projectFilter]);
  
  // Projetos recentes (últimos 5)
  const recentProjects = useMemo(() => {
    return [...userProjects]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [userProjects]);
  
  const handleProjectView = (project) => {
    // Navegar para página de detalhes do projeto
    console.log('Ver projeto:', project.id);
  };
  
  const handleProjectEdit = (project) => {
    // Navegar para página de edição do projeto
    console.log('Editar projeto:', project.id);
  };
  
  const handleProjectDelete = (project) => {
    // Confirmar e deletar projeto
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.title}"?`)) {
      console.log('Deletar projeto:', project.id);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo, {currentUser?.name}! 
            {isManager ? ' Gerencie seus projetos.' : ' Acompanhe o progresso dos seus projetos.'}
          </p>
        </div>
        
        {isManager && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        )}
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de projetos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">{projectStats.total}</p>
            </div>
          </div>
        </div>
        
        {/* Projetos em andamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{projectStats.inProgress}</p>
            </div>
          </div>
        </div>
        
        {/* Projetos concluídos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">{projectStats.completed}</p>
            </div>
          </div>
        </div>
        
        {/* Valor total */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(projectStats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progresso geral */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Progresso Geral</h3>
          <div className="flex items-center space-x-4">
            <CircularProgress 
              progress={projectStats.avgProgress} 
              size={60}
              color="blue"
            />
          </div>
        </div>
        <ProgressBar 
          progress={projectStats.avgProgress}
          size="lg"
          showLabel={false}
          color="blue"
        />
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Pendentes</p>
            <p className="font-medium text-yellow-600">{projectStats.pending}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Em Andamento</p>
            <p className="font-medium text-blue-600">{projectStats.inProgress}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Concluídos</p>
            <p className="font-medium text-green-600">{projectStats.completed}</p>
          </div>
        </div>
      </div>
      
      {/* Filtros de projetos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Projetos</h3>
          
          {/* Filtros */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Todos', count: projectStats.total },
              { key: 'pending', label: 'Pendentes', count: projectStats.pending },
              { key: 'in_progress', label: 'Em Andamento', count: projectStats.inProgress },
              { key: 'completed', label: 'Concluídos', count: projectStats.completed }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={projectFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProjectFilter(filter.key)}
                className="text-xs"
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>
        
        {/* Lista de projetos */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleProjectView}
                onEdit={handleProjectEdit}
                onDelete={handleProjectDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum projeto encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {projectFilter === 'all' 
                ? 'Você ainda não tem projetos.' 
                : `Não há projetos com status "${getStatusText(projectFilter)}".`
              }
            </p>
            {isManager && projectFilter === 'all' && (
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;


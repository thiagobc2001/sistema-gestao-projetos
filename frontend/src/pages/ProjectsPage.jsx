// Página de listagem de projetos
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Plus, 
  Search, 
  Filter,
  FolderOpen,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

const ProjectsPage = ({ onViewProject }) => {
  const { 
    currentUser, 
    projects, 
    projectFilter,
    setProjectFilter,
    searchTerm,
    setSearchTerm,
    deleteProject 
  } = useApp();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('updatedAt'); // 'title', 'startDate', 'endDate', 'value', 'progress', 'updatedAt'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' ou 'desc'
  
  const isManager = currentUser?.role === 'manager';
  
  // Filtrar projetos baseado no usuário
  const userProjects = useMemo(() => {
    if (isManager) {
      return projects.filter(project => project.managerId === currentUser.id);
    } else {
      return projects.filter(project => project.clientId === currentUser.id);
    }
  }, [projects, currentUser, isManager]);
  
  // Aplicar filtros, pesquisa e ordenação
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = userProjects;
    
    // Filtro por status
    if (projectFilter !== 'all') {
      filtered = filtered.filter(project => project.status === projectFilter);
    }
    
    // Filtro por termo de pesquisa
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.clientName.toLowerCase().includes(term) ||
        project.managerName.toLowerCase().includes(term)
      );
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Tratamento especial para datas
      if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Tratamento especial para strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [userProjects, projectFilter, searchTerm, sortBy, sortOrder]);
  
  // Estatísticas dos projetos filtrados
  const stats = useMemo(() => {
    const total = filteredAndSortedProjects.length;
    const pending = filteredAndSortedProjects.filter(p => p.status === 'pending').length;
    const inProgress = filteredAndSortedProjects.filter(p => p.status === 'in_progress').length;
    const completed = filteredAndSortedProjects.filter(p => p.status === 'completed').length;
    
    return { total, pending, inProgress, completed };
  }, [filteredAndSortedProjects]);
  
  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };
  
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };
  
  const handleDeleteProject = async (project) => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.title}"?`)) {
      const result = await deleteProject(project.id);
      if (!result.success) {
        alert('Erro ao excluir projeto: ' + result.error);
      }
    }
  };
  
  const handleFormSave = () => {
    setShowForm(false);
    setEditingProject(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };
  
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };
  
  // Se estiver mostrando formulário
  if (showForm) {
    return (
      <ProjectForm
        project={editingProject}
        isEditing={!!editingProject}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">
            {isManager ? 'Gerencie todos os seus projetos' : 'Acompanhe seus projetos'}
          </p>
        </div>
        
        {isManager && (
          <Button onClick={handleNewProject} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        )}
      </div>
      
      {/* Filtros e pesquisa */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Barra de pesquisa */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Pesquisar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex items-center space-x-4">
            {/* Filtros de status */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todos', count: stats.total },
                { key: 'pending', label: 'Pendentes', count: stats.pending },
                { key: 'in_progress', label: 'Em Andamento', count: stats.inProgress },
                { key: 'completed', label: 'Concluídos', count: stats.completed }
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
            
            {/* Modo de visualização */}
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Ordenação */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            {[
              { key: 'updatedAt', label: 'Última atualização' },
              { key: 'title', label: 'Título' },
              { key: 'startDate', label: 'Data de início' },
              { key: 'endDate', label: 'Data de conclusão' },
              { key: 'progress', label: 'Progresso' },
              { key: 'value', label: 'Valor' }
            ].map((sort) => (
              <Button
                key={sort.key}
                variant={sortBy === sort.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleSortChange(sort.key)}
                className="text-xs"
              >
                {sort.label}
                {sortBy === sort.key && (
                  sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Lista de projetos */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => onViewProject(project.id)}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum projeto encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm.trim() 
                ? `Nenhum projeto corresponde à pesquisa "${searchTerm}"`
                : projectFilter === 'all'
                  ? 'Você ainda não tem projetos cadastrados.'
                  : `Não há projetos com o status selecionado.`
              }
            </p>
            {isManager && !searchTerm.trim() && projectFilter === 'all' && (
              <div className="mt-6">
                <Button onClick={handleNewProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Resumo */}
      {filteredAndSortedProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredAndSortedProjects.length} de {userProjects.length} projeto{userProjects.length !== 1 ? 's' : ''}
            </span>
            <span>
              {searchTerm.trim() && `Pesquisa: "${searchTerm}"`}
              {projectFilter !== 'all' && ` • Filtro: ${projectFilter}`}
              {` • Ordenação: ${sortBy} (${sortOrder === 'asc' ? 'crescente' : 'decrescente'})`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;


// Componente principal da aplicação
import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext.jsx';
import { NotificationProvider } from './components/NotificationProvider.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import { userStorage, projectStorage, stageStorage, taskStorage } from './data/storage.js';
import { createUser, createProject, createStage, createTask } from './data/models.js';
import './App.css';

// Componente interno que usa o contexto
const AppContent = () => {
  const { isAuthenticated, currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  
  // Inicializar dados de exemplo
  useEffect(() => {
    initializeSampleData();
  }, []);
  
  const initializeSampleData = () => {
    // Verificar se já existem usuários
    const existingUsers = userStorage.getAll();
    if (existingUsers.length > 0) {
      return; // Dados já existem
    }
    
    // Criar usuários de exemplo
    const manager = createUser({
      name: 'João Silva',
      email: 'gestor@empresa.com',
      role: 'manager'
    });
    
    const client = createUser({
      name: 'Maria Santos',
      email: 'cliente@empresa.com',
      role: 'client'
    });
    
    userStorage.save(manager);
    userStorage.save(client);
    
    // Criar projetos de exemplo
    const project1 = createProject({
      title: 'Website Corporativo',
      description: 'Desenvolvimento de um novo website corporativo com design moderno e responsivo. O projeto inclui análise de requisitos, design UX/UI, desenvolvimento frontend e backend, testes e deploy.',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      value: 25000,
      managerId: manager.id,
      managerName: manager.name,
      clientId: client.id,
      clientName: client.name,
      status: 'in_progress',
      progress: 65
    });
    
    const project2 = createProject({
      title: 'Sistema de Gestão',
      description: 'Desenvolvimento de um sistema interno de gestão para controle de estoque, vendas e relatórios financeiros.',
      startDate: '2024-02-01',
      endDate: '2024-05-30',
      value: 45000,
      managerId: manager.id,
      managerName: manager.name,
      clientId: client.id,
      clientName: client.name,
      status: 'pending',
      progress: 15
    });
    
    const project3 = createProject({
      title: 'App Mobile',
      description: 'Aplicativo mobile para iOS e Android com funcionalidades de e-commerce e integração com sistemas existentes.',
      startDate: '2023-10-01',
      endDate: '2024-01-31',
      value: 35000,
      managerId: manager.id,
      managerName: manager.name,
      clientId: client.id,
      clientName: client.name,
      status: 'completed',
      progress: 100
    });
    
    projectStorage.save(project1);
    projectStorage.save(project2);
    projectStorage.save(project3);
    
    // Criar etapas para o projeto 1
    const stage1_1 = createStage({
      projectId: project1.id,
      title: 'Análise e Planejamento',
      description: 'Levantamento de requisitos, análise de concorrentes e definição da arquitetura do projeto.',
      order: 1,
      status: 'completed',
      progress: 100
    });
    
    const stage1_2 = createStage({
      projectId: project1.id,
      title: 'Design UX/UI',
      description: 'Criação de wireframes, protótipos e design visual das interfaces.',
      order: 2,
      status: 'completed',
      progress: 100
    });
    
    const stage1_3 = createStage({
      projectId: project1.id,
      title: 'Desenvolvimento Frontend',
      description: 'Implementação das interfaces e funcionalidades do lado cliente.',
      order: 3,
      status: 'in_progress',
      progress: 70
    });
    
    const stage1_4 = createStage({
      projectId: project1.id,
      title: 'Desenvolvimento Backend',
      description: 'Implementação da API, banco de dados e lógica de negócio.',
      order: 4,
      status: 'in_progress',
      progress: 40
    });
    
    const stage1_5 = createStage({
      projectId: project1.id,
      title: 'Testes e Deploy',
      description: 'Testes de qualidade, correções e publicação em produção.',
      order: 5,
      status: 'pending',
      progress: 0
    });
    
    stageStorage.save(stage1_1);
    stageStorage.save(stage1_2);
    stageStorage.save(stage1_3);
    stageStorage.save(stage1_4);
    stageStorage.save(stage1_5);
    
    // Criar tarefas para a etapa de desenvolvimento frontend
    const tasks = [
      {
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Instalar dependências e configurar ferramentas',
        completed: true,
        order: 1
      },
      {
        title: 'Implementar página inicial',
        description: 'Criar layout e componentes da homepage',
        completed: true,
        order: 2
      },
      {
        title: 'Desenvolver páginas internas',
        description: 'Criar páginas de produtos, sobre e contato',
        completed: true,
        order: 3
      },
      {
        title: 'Implementar formulários',
        description: 'Criar formulários de contato e newsletter',
        completed: false,
        order: 4
      },
      {
        title: 'Otimizar para mobile',
        description: 'Ajustar responsividade e performance mobile',
        completed: false,
        order: 5
      }
    ];
    
    tasks.forEach(taskData => {
      const task = createTask({
        ...taskData,
        stageId: stage1_3.id,
        projectId: project1.id
      });
      taskStorage.save(task);
    });
    
    // Criar algumas tarefas para o backend
    const backendTasks = [
      {
        title: 'Configurar banco de dados',
        description: 'Criar estrutura e tabelas do banco',
        completed: true,
        order: 1
      },
      {
        title: 'Implementar autenticação',
        description: 'Sistema de login e controle de acesso',
        completed: true,
        order: 2
      },
      {
        title: 'Criar APIs principais',
        description: 'Endpoints para CRUD de dados',
        completed: false,
        order: 3
      },
      {
        title: 'Integrar com frontend',
        description: 'Conectar APIs com interface',
        completed: false,
        order: 4
      }
    ];
    
    backendTasks.forEach(taskData => {
      const task = createTask({
        ...taskData,
        stageId: stage1_4.id,
        projectId: project1.id
      });
      taskStorage.save(task);
    });
    
    console.log('Dados de exemplo inicializados com sucesso!');
  };
  
  // Funções de navegação
  const navigateTo = (page, projectId = null, project = null) => {
    setCurrentPage(page);
    setSelectedProjectId(projectId);
    setEditingProject(project);
  };
  
  const handleProjectView = (projectId) => {
    navigateTo('project-details', projectId);
  };
  
  const handleProjectEdit = (project) => {
    setEditingProject(project);
    navigateTo('project-form');
  };
  
  const handleNewProject = () => {
    setEditingProject(null);
    navigateTo('project-form');
  };
  
  const handleFormSave = () => {
    navigateTo('projects');
  };
  
  const handleFormCancel = () => {
    navigateTo('projects');
  };
  
  // Atualizar Layout para incluir navegação
  const LayoutWithNavigation = ({ children }) => {
    const isManager = currentUser?.role === 'manager';
    
    // Atualizar itens de navegação com handlers
    const navigationItems = [
      {
        name: 'Dashboard',
        onClick: () => navigateTo('dashboard'),
        active: currentPage === 'dashboard',
        show: true
      },
      {
        name: 'Projetos',
        onClick: () => navigateTo('projects'),
        active: currentPage === 'projects' || currentPage === 'project-details' || currentPage === 'project-form',
        show: true
      },
      {
        name: 'Novo Projeto',
        onClick: handleNewProject,
        active: false,
        show: isManager
      }
    ];
    
    return (
      <Layout navigationItems={navigationItems}>
        {children}
      </Layout>
    );
  };
  
  // Renderizar baseado no estado de autenticação
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  // Renderizar página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onViewProject={handleProjectView} onNewProject={handleNewProject} />;
      
      case 'projects':
        return <ProjectsPage onViewProject={handleProjectView} />;
      
      case 'project-details':
        return (
          <ProjectDetailsPage
            projectId={selectedProjectId}
            onBack={() => navigateTo('projects')}
            onEdit={handleProjectEdit}
          />
        );
      
      case 'project-form':
        return (
          <ProjectForm
            project={editingProject}
            isEditing={!!editingProject}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        );
      
      default:
        return <DashboardPage onViewProject={handleProjectView} onNewProject={handleNewProject} />;
    }
  };
  
  return (
    <LayoutWithNavigation>
      {renderCurrentPage()}
    </LayoutWithNavigation>
  );
};

// Componente principal com providers
function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;


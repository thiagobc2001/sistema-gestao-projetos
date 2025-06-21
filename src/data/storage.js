// Sistema de armazenamento local usando localStorage

const STORAGE_KEYS = {
  PROJECTS: 'projects',
  STAGES: 'stages',
  TASKS: 'tasks',
  USERS: 'users',
  CURRENT_USER: 'currentUser'
};

// Funções auxiliares para localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
    return false;
  }
};

// Gerenciamento de Projetos
export const projectStorage = {
  // Buscar todos os projetos
  getAll: () => getFromStorage(STORAGE_KEYS.PROJECTS),
  
  // Buscar projeto por ID
  getById: (id) => {
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
    return projects.find(project => project.id === id);
  },
  
  // Buscar projetos por gestor
  getByManager: (managerId) => {
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
    return projects.filter(project => project.managerId === managerId);
  },
  
  // Buscar projetos por cliente
  getByClient: (clientId) => {
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
    return projects.filter(project => project.clientId === clientId);
  },
  
  // Salvar projeto
  save: (project) => {
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push(project);
    }
    
    return saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  },
  
  // Deletar projeto
  delete: (id) => {
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
    const filteredProjects = projects.filter(project => project.id !== id);
    return saveToStorage(STORAGE_KEYS.PROJECTS, filteredProjects);
  }
};

// Gerenciamento de Etapas
export const stageStorage = {
  // Buscar todas as etapas
  getAll: () => getFromStorage(STORAGE_KEYS.STAGES),
  
  // Buscar etapa por ID
  getById: (id) => {
    const stages = getFromStorage(STORAGE_KEYS.STAGES);
    return stages.find(stage => stage.id === id);
  },
  
  // Buscar etapas por projeto
  getByProject: (projectId) => {
    const stages = getFromStorage(STORAGE_KEYS.STAGES);
    return stages.filter(stage => stage.projectId === projectId)
                 .sort((a, b) => a.order - b.order);
  },
  
  // Salvar etapa
  save: (stage) => {
    const stages = getFromStorage(STORAGE_KEYS.STAGES);
    const existingIndex = stages.findIndex(s => s.id === stage.id);
    
    if (existingIndex >= 0) {
      stages[existingIndex] = { ...stage, updatedAt: new Date().toISOString() };
    } else {
      stages.push(stage);
    }
    
    return saveToStorage(STORAGE_KEYS.STAGES, stages);
  },
  
  // Deletar etapa
  delete: (id) => {
    const stages = getFromStorage(STORAGE_KEYS.STAGES);
    const filteredStages = stages.filter(stage => stage.id !== id);
    return saveToStorage(STORAGE_KEYS.STAGES, filteredStages);
  }
};

// Gerenciamento de Tarefas
export const taskStorage = {
  // Buscar todas as tarefas
  getAll: () => getFromStorage(STORAGE_KEYS.TASKS),
  
  // Buscar tarefa por ID
  getById: (id) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.find(task => task.id === id);
  },
  
  // Buscar tarefas por etapa
  getByStage: (stageId) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.filter(task => task.stageId === stageId)
                .sort((a, b) => a.order - b.order);
  },
  
  // Buscar tarefas por projeto
  getByProject: (projectId) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.filter(task => task.projectId === projectId);
  },
  
  // Salvar tarefa
  save: (task) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      tasks.push(task);
    }
    
    return saveToStorage(STORAGE_KEYS.TASKS, tasks);
  },
  
  // Deletar tarefa
  delete: (id) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    const filteredTasks = tasks.filter(task => task.id !== id);
    return saveToStorage(STORAGE_KEYS.TASKS, filteredTasks);
  }
};

// Gerenciamento de Usuários
export const userStorage = {
  // Buscar todos os usuários
  getAll: () => getFromStorage(STORAGE_KEYS.USERS),
  
  // Buscar usuário por ID
  getById: (id) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    return users.find(user => user.id === id);
  },
  
  // Buscar usuário por email
  getByEmail: (email) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    return users.find(user => user.email === email);
  },
  
  // Salvar usuário
  save: (user) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    return saveToStorage(STORAGE_KEYS.USERS, users);
  },
  
  // Deletar usuário
  delete: (id) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const filteredUsers = users.filter(user => user.id !== id);
    return saveToStorage(STORAGE_KEYS.USERS, filteredUsers);
  }
};

// Gerenciamento de Usuário Atual
export const currentUserStorage = {
  // Buscar usuário atual
  get: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao ler usuário atual:', error);
      return null;
    }
  },
  
  // Salvar usuário atual
  set: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário atual:', error);
      return false;
    }
  },
  
  // Remover usuário atual (logout)
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário atual:', error);
      return false;
    }
  }
};

// Função para inicializar dados de exemplo (apenas para desenvolvimento)
export const initializeSampleData = () => {
  // Verificar se já existem dados
  const existingProjects = getFromStorage(STORAGE_KEYS.PROJECTS);
  if (existingProjects.length > 0) {
    return; // Dados já existem, não inicializar
  }
  
  // Criar usuários de exemplo
  const sampleUsers = [
    {
      id: 'user1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      role: 'manager',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user2',
      name: 'Maria Santos',
      email: 'maria@cliente.com',
      role: 'client',
      createdAt: new Date().toISOString()
    }
  ];
  
  saveToStorage(STORAGE_KEYS.USERS, sampleUsers);
  
  console.log('Dados de exemplo inicializados');
};


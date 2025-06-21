// Estrutura de dados para o sistema de gerenciamento de projetos

// Modelo de Usuário
export const UserModel = {
  id: '',
  name: '',
  email: '',
  role: 'client', // 'manager' ou 'client'
  createdAt: new Date().toISOString()
};

// Modelo de Projeto
export const ProjectModel = {
  id: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  value: 0,
  managerId: '',
  managerName: '',
  clientId: '',
  clientName: '',
  status: 'pending', // 'pending', 'in_progress', 'completed', 'cancelled'
  progress: 0, // Calculado automaticamente baseado nas etapas
  stages: [], // Array de IDs das etapas
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Modelo de Etapa
export const StageModel = {
  id: '',
  projectId: '',
  title: '',
  description: '',
  order: 0, // Ordem da etapa no projeto
  status: 'pending', // 'pending', 'in_progress', 'completed'
  progress: 0, // Calculado automaticamente baseado nas tarefas
  tasks: [], // Array de IDs das tarefas
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Modelo de Tarefa
export const TaskModel = {
  id: '',
  stageId: '',
  projectId: '',
  title: '',
  description: '',
  completed: false,
  order: 0, // Ordem da tarefa na etapa
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Função para gerar IDs únicos
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Função para criar um novo projeto
export const createProject = (projectData) => {
  return {
    ...ProjectModel,
    ...projectData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Função para criar uma nova etapa
export const createStage = (stageData) => {
  return {
    ...StageModel,
    ...stageData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Função para criar uma nova tarefa
export const createTask = (taskData) => {
  return {
    ...TaskModel,
    ...taskData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Função para criar um novo usuário
export const createUser = (userData) => {
  return {
    ...UserModel,
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
};


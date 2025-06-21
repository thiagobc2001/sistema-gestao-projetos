// Funções utilitárias para cálculos de progresso e outras operações

import { taskStorage, stageStorage, projectStorage } from '../data/storage.js';

// Calcular progresso de uma etapa baseado nas tarefas concluídas
export const calculateStageProgress = (stageId) => {
  const tasks = taskStorage.getByStage(stageId);
  
  if (tasks.length === 0) {
    return 0;
  }
  
  const completedTasks = tasks.filter(task => task.completed);
  return Math.round((completedTasks.length / tasks.length) * 100);
};

// Calcular progresso de um projeto baseado nas etapas
export const calculateProjectProgress = (projectId) => {
  const stages = stageStorage.getByProject(projectId);
  
  if (stages.length === 0) {
    return 0;
  }
  
  let totalProgress = 0;
  stages.forEach(stage => {
    totalProgress += calculateStageProgress(stage.id);
  });
  
  return Math.round(totalProgress / stages.length);
};

// Atualizar progresso de uma etapa e salvar
export const updateStageProgress = (stageId) => {
  const stage = stageStorage.getById(stageId);
  if (!stage) return false;
  
  const newProgress = calculateStageProgress(stageId);
  const updatedStage = {
    ...stage,
    progress: newProgress,
    status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending'
  };
  
  return stageStorage.save(updatedStage);
};

// Atualizar progresso de um projeto e salvar
export const updateProjectProgress = (projectId) => {
  const project = projectStorage.getById(projectId);
  if (!project) return false;
  
  const newProgress = calculateProjectProgress(projectId);
  const updatedProject = {
    ...project,
    progress: newProgress,
    status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending'
  };
  
  return projectStorage.save(updatedProject);
};

// Atualizar todos os progressos relacionados quando uma tarefa é modificada
export const updateAllProgress = (taskId) => {
  const task = taskStorage.getById(taskId);
  if (!task) return false;
  
  // Atualizar progresso da etapa
  updateStageProgress(task.stageId);
  
  // Atualizar progresso do projeto
  updateProjectProgress(task.projectId);
  
  return true;
};

// Formatar data para exibição
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatar valor monetário
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Calcular dias restantes para conclusão
export const calculateDaysRemaining = (endDate) => {
  if (!endDate) return null;
  
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Obter status em português
export const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Pendente',
    'in_progress': 'Em Andamento',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  };
  
  return statusMap[status] || status;
};

// Obter cor do status para exibição
export const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'in_progress': 'text-blue-600 bg-blue-100',
    'completed': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100'
  };
  
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

// Gerar link do projeto para compartilhamento
export const generateProjectLink = (projectId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/projeto/${projectId}`;
};

// Gerar template de mensagem para WhatsApp
export const generateWhatsAppMessage = (projectTitle, projectId, stageName) => {
  const projectLink = generateProjectLink(projectId);
  
  const message = `Olá! 👋

Gostaria de compartilhar uma atualização sobre o projeto "${projectTitle}".

📋 Etapa: ${stageName}

Você pode acompanhar o progresso completo através do link:
${projectLink}

Qualquer dúvida, estou à disposição!`;
  
  return encodeURIComponent(message);
};

// Gerar URL do WhatsApp com mensagem pré-preenchida
export const generateWhatsAppUrl = (phoneNumber, message) => {
  const cleanPhone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
  const baseUrl = 'https://wa.me/';
  
  if (cleanPhone) {
    return `${baseUrl}${cleanPhone}?text=${message}`;
  } else {
    return `${baseUrl}?text=${message}`;
  }
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar data
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Verificar se uma data é futura
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};


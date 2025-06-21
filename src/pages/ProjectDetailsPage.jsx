// Página de detalhes do projeto
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import ProgressBar, { CircularProgress } from '../components/ProgressBar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { 
  formatDate, 
  formatCurrency, 
  getStatusText, 
  getStatusColor,
  calculateDaysRemaining,
  generateWhatsAppMessage,
  generateWhatsAppUrl
} from '../utils/helpers.js';

const ProjectDetailsPage = ({ projectId, onBack, onEdit }) => {
  const { 
    currentUser, 
    projects, 
    stages, 
    tasks,
    updateTask,
    updateAllProgress 
  } = useApp();
  
  const [expandedStages, setExpandedStages] = useState({});
  const [whatsappModal, setWhatsappModal] = useState({ open: false, stage: null });
  
  const isManager = currentUser?.role === 'manager';
  
  // Buscar projeto
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId);
  }, [projects, projectId]);
  
  // Buscar etapas do projeto
  const projectStages = useMemo(() => {
    return stages.filter(stage => stage.projectId === projectId)
                 .sort((a, b) => a.order - b.order);
  }, [stages, projectId]);
  
  // Buscar tarefas por etapa
  const getStageTasksMap = useMemo(() => {
    const tasksMap = {};
    projectStages.forEach(stage => {
      tasksMap[stage.id] = tasks.filter(task => task.stageId === stage.id)
                               .sort((a, b) => a.order - b.order);
    });
    return tasksMap;
  }, [tasks, projectStages]);
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Projeto não encontrado
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          O projeto solicitado não existe ou você não tem permissão para visualizá-lo.
        </p>
        <div className="mt-6">
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }
  
  const daysRemaining = calculateDaysRemaining(project.endDate);
  
  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };
  
  const handleTaskToggle = async (task) => {
    if (!isManager) return; // Apenas gestores podem marcar tarefas
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
    
    const result = await updateTask(updatedTask);
    if (result.success) {
      // Atualizar progresso de etapa e projeto
      updateAllProgress(task.id);
    }
  };
  
  const handleWhatsAppShare = (stage) => {
    setWhatsappModal({ open: true, stage });
  };
  
  const openWhatsApp = (phoneNumber = '') => {
    const message = generateWhatsAppMessage(
      project.title,
      project.id,
      whatsappModal.stage?.title || ''
    );
    const url = generateWhatsAppUrl(phoneNumber, message);
    window.open(url, '_blank');
    setWhatsappModal({ open: false, stage: null });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
              {project.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
              {project.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
              {getStatusText(project.status)}
            </div>
          </div>
        </div>
        
        {isManager && (
          <Button onClick={() => onEdit(project)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Projeto
          </Button>
        )}
      </div>
      
      {/* Informações principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes do projeto */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>
          
          {/* Etapas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Etapas do Projeto</h3>
              {isManager && (
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Etapa
                </Button>
              )}
            </div>
            
            {projectStages.length > 0 ? (
              <div className="space-y-4">
                {projectStages.map((stage, index) => {
                  const stageTasks = getStageTasksMap[stage.id] || [];
                  const isExpanded = expandedStages[stage.id];
                  
                  return (
                    <div key={stage.id} className="border border-gray-200 rounded-lg">
                      {/* Header da etapa */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleStageExpansion(stage.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {index + 1}. {stage.title}
                              </h4>
                              <p className="text-sm text-gray-500">{stage.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                                {getStatusText(stage.status)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {stage.progress}% concluído
                              </div>
                            </div>
                            
                            <CircularProgress 
                              progress={stage.progress} 
                              size={40}
                              showPercentage={false}
                            />
                            
                            {isManager && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWhatsAppShare(stage)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Barra de progresso da etapa */}
                        <div className="mt-3">
                          <ProgressBar 
                            progress={stage.progress}
                            showLabel={false}
                            showPercentage={false}
                            size="sm"
                          />
                        </div>
                      </div>
                      
                      {/* Tarefas da etapa */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {stageTasks.length > 0 ? (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">
                                Tarefas ({stageTasks.filter(t => t.completed).length}/{stageTasks.length})
                              </h5>
                              {stageTasks.map((task) => (
                                <div key={task.id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskToggle(task)}
                                    disabled={!isManager}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <div className="flex-1">
                                    <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                      {task.title}
                                    </p>
                                    {task.description && (
                                      <p className="text-xs text-gray-500">{task.description}</p>
                                    )}
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {task.completed ? 'Concluída' : 'Pendente'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Nenhuma tarefa cadastrada para esta etapa
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Nenhuma etapa cadastrada ainda
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar com informações */}
        <div className="space-y-6">
          {/* Progresso geral */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progresso Geral</h3>
            <div className="flex items-center justify-center mb-4">
              <CircularProgress 
                progress={project.progress} 
                size={80}
                color="blue"
              />
            </div>
            <ProgressBar 
              progress={project.progress}
              showLabel={false}
              color="blue"
            />
          </div>
          
          {/* Informações do projeto */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">Início</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">Conclusão</p>
                  <p className="font-medium">{formatDate(project.endDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">Valor</p>
                  <p className="font-medium">{formatCurrency(project.value)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">{isManager ? 'Cliente' : 'Gestor'}</p>
                  <p className="font-medium">
                    {isManager ? project.clientName : project.managerName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Alerta de prazo */}
          {daysRemaining !== null && daysRemaining <= 7 && (
            <div className={`rounded-lg p-4 ${
              daysRemaining < 0 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center">
                <AlertCircle className={`h-4 w-4 mr-2 ${
                  daysRemaining < 0 ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    daysRemaining < 0 ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {daysRemaining < 0 
                      ? `Prazo vencido há ${Math.abs(daysRemaining)} dia${Math.abs(daysRemaining) > 1 ? 's' : ''}`
                      : daysRemaining === 0
                        ? 'Prazo vence hoje!'
                        : `${daysRemaining} dia${daysRemaining > 1 ? 's' : ''} restante${daysRemaining > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal do WhatsApp */}
      {whatsappModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Compartilhar via WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Envie uma atualização sobre a etapa "{whatsappModal.stage?.title}" para o cliente.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => openWhatsApp()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Abrir WhatsApp
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setWhatsappModal({ open: false, stage: null })}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;


// Componente para gerenciar etapas e tarefas
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle,
  Circle,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { createStage, createTask } from '../data/models.js';
import { updateAllProgress, generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/helpers.js';

const StageTaskManager = ({ projectId, stages, tasks, onUpdate }) => {
  const { 
    currentUser, 
    addStage, 
    updateStage, 
    deleteStage,
    addTask,
    updateTask,
    deleteTask 
  } = useApp();
  
  const [editingStage, setEditingStage] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(null); // stageId
  const [whatsappModal, setWhatsappModal] = useState({ open: false, stage: null });
  
  const isManager = currentUser?.role === 'manager';
  
  // Formulário de etapa
  const StageForm = ({ stage = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: stage?.title || '',
      description: stage?.description || '',
      order: stage?.order || stages.length + 1
    });
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!formData.title.trim()) return;
      
      const stageData = {
        ...formData,
        projectId,
        status: stage?.status || 'pending',
        progress: stage?.progress || 0
      };
      
      let result;
      if (stage) {
        result = await updateStage({ ...stage, ...stageData });
      } else {
        const newStage = createStage(stageData);
        result = await addStage(newStage);
      }
      
      if (result.success) {
        onSave();
        onUpdate && onUpdate();
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Etapa *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Desenvolvimento Frontend"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o que será feito nesta etapa..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordem
            </label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {stage ? 'Atualizar' : 'Criar'} Etapa
            </Button>
          </div>
        </div>
      </form>
    );
  };
  
  // Formulário de tarefa
  const TaskForm = ({ stageId, task = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: task?.title || '',
      description: task?.description || '',
      order: task?.order || (tasks.filter(t => t.stageId === stageId).length + 1)
    });
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!formData.title.trim()) return;
      
      const taskData = {
        ...formData,
        stageId,
        projectId,
        completed: task?.completed || false
      };
      
      let result;
      if (task) {
        result = await updateTask({ ...task, ...taskData });
      } else {
        const newTask = createTask(taskData);
        result = await addTask(newTask);
      }
      
      if (result.success) {
        updateAllProgress(task?.id || newTask?.id);
        onSave();
        onUpdate && onUpdate();
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="bg-blue-50 p-3 rounded border">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Tarefa *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Implementar página inicial"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detalhes da tarefa..."
            />
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              <Save className="h-4 w-4 mr-1" />
              {task ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </form>
    );
  };
  
  const handleTaskToggle = async (task) => {
    if (!isManager) return;
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
    
    const result = await updateTask(updatedTask);
    if (result.success) {
      updateAllProgress(task.id);
      onUpdate && onUpdate();
    }
  };
  
  const handleDeleteStage = async (stage) => {
    if (!isManager) return;
    
    if (window.confirm(`Tem certeza que deseja excluir a etapa "${stage.title}"?`)) {
      const result = await deleteStage(stage.id);
      if (result.success) {
        onUpdate && onUpdate();
      }
    }
  };
  
  const handleDeleteTask = async (task) => {
    if (!isManager) return;
    
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      const result = await deleteTask(task.id);
      if (result.success) {
        updateAllProgress(task.id);
        onUpdate && onUpdate();
      }
    }
  };
  
  const handleWhatsAppShare = (stage) => {
    setWhatsappModal({ open: true, stage });
  };
  
  const openWhatsApp = (phoneNumber = '') => {
    const message = generateWhatsAppMessage(
      'Projeto', // Você pode passar o título do projeto aqui
      projectId,
      whatsappModal.stage?.title || ''
    );
    const url = generateWhatsAppUrl(phoneNumber, message);
    window.open(url, '_blank');
    setWhatsappModal({ open: false, stage: null });
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Etapas e Tarefas</h3>
        {isManager && (
          <Button
            onClick={() => setShowStageForm(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Etapa
          </Button>
        )}
      </div>
      
      {/* Formulário de nova etapa */}
      {showStageForm && (
        <StageForm
          onSave={() => setShowStageForm(false)}
          onCancel={() => setShowStageForm(false)}
        />
      )}
      
      {/* Lista de etapas */}
      {stages.map((stage) => {
        const stageTasks = tasks.filter(task => task.stageId === stage.id)
                               .sort((a, b) => a.order - b.order);
        
        return (
          <div key={stage.id} className="border border-gray-200 rounded-lg">
            {/* Header da etapa */}
            <div className="p-4 bg-white">
              {editingStage === stage.id ? (
                <StageForm
                  stage={stage}
                  onSave={() => setEditingStage(null)}
                  onCancel={() => setEditingStage(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{stage.title}</h4>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      {stageTasks.filter(t => t.completed).length} de {stageTasks.length} tarefas concluídas
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm">
                      <div className="font-medium">{stage.progress}%</div>
                      <div className="text-gray-500">{stage.status}</div>
                    </div>
                    
                    {isManager && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsAppShare(stage)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStage(stage.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStage(stage)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tarefas da etapa */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {/* Formulário de nova tarefa */}
              {showTaskForm === stage.id && (
                <div className="mb-4">
                  <TaskForm
                    stageId={stage.id}
                    onSave={() => setShowTaskForm(null)}
                    onCancel={() => setShowTaskForm(null)}
                  />
                </div>
              )}
              
              {/* Lista de tarefas */}
              {stageTasks.length > 0 ? (
                <div className="space-y-2">
                  {stageTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-white rounded border">
                      <button
                        onClick={() => handleTaskToggle(task)}
                        disabled={!isManager}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        {editingTask === task.id ? (
                          <TaskForm
                            stageId={stage.id}
                            task={task}
                            onSave={() => setEditingTask(null)}
                            onCancel={() => setEditingTask(null)}
                          />
                        ) : (
                          <>
                            <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-gray-500">{task.description}</p>
                            )}
                          </>
                        )}
                      </div>
                      
                      {isManager && editingTask !== task.id && (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingTask(task.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Nenhuma tarefa cadastrada</p>
                </div>
              )}
              
              {/* Botão para adicionar tarefa */}
              {isManager && showTaskForm !== stage.id && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTaskForm(stage.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Tarefa
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Estado vazio */}
      {stages.length === 0 && (
        <div className="text-center py-8 border border-gray-200 rounded-lg">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Nenhuma etapa cadastrada ainda
          </p>
          {isManager && (
            <Button
              onClick={() => setShowStageForm(true)}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Etapa
            </Button>
          )}
        </div>
      )}
      
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

export default StageTaskManager;


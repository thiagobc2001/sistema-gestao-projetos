// Formulário para criação e edição de projetos
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Save, 
  X, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { createProject } from '../data/models.js';
import { isValidDate, isFutureDate, formatCurrency } from '../utils/helpers.js';

const ProjectForm = ({ project = null, onSave, onCancel, isEditing = false }) => {
  const { currentUser, users, addProject, updateProject } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    value: '',
    clientId: '',
    clientName: ''
  });
  
  // Carregar dados do projeto se estiver editando
  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        value: project.value || '',
        clientId: project.clientId || '',
        clientName: project.clientName || ''
      });
    }
  }, [isEditing, project]);
  
  // Filtrar apenas clientes
  const clients = users.filter(user => user.role === 'client');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Atualizar nome do cliente quando ID for selecionado
    if (name === 'clientId') {
      const selectedClient = clients.find(client => client.id === value);
      setFormData(prev => ({
        ...prev,
        clientName: selectedClient ? selectedClient.name : ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }
    
    // Validar descrição
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }
    
    // Validar data de início
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    } else if (!isValidDate(formData.startDate)) {
      newErrors.startDate = 'Data de início inválida';
    }
    
    // Validar data de fim
    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória';
    } else if (!isValidDate(formData.endDate)) {
      newErrors.endDate = 'Data de fim inválida';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
    }
    
    // Validar valor
    if (!formData.value) {
      newErrors.value = 'Valor é obrigatório';
    } else {
      const numValue = parseFloat(formData.value);
      if (isNaN(numValue) || numValue <= 0) {
        newErrors.value = 'Valor deve ser um número positivo';
      }
    }
    
    // Validar cliente
    if (!formData.clientId) {
      newErrors.clientId = 'Cliente é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        value: parseFloat(formData.value),
        managerId: currentUser.id,
        managerName: currentUser.name
      };
      
      let result;
      if (isEditing) {
        result = await updateProject({
          ...project,
          ...projectData,
          updatedAt: new Date().toISOString()
        });
      } else {
        const newProject = createProject(projectData);
        result = await addProject(newProject);
      }
      
      if (result.success) {
        onSave && onSave();
      } else {
        setErrors({ submit: result.error || 'Erro ao salvar projeto' });
      }
    } catch (error) {
      setErrors({ submit: 'Erro inesperado ao salvar projeto' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título do Projeto *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Website Corporativo"
            />
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>
        
        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descreva os objetivos e escopo do projeto..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>
        
        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data de início */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.startDate}
              </p>
            )}
          </div>
          
          {/* Data de fim */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Conclusão *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.endDate}
              </p>
            )}
          </div>
        </div>
        
        {/* Valor e Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Projeto *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="value"
                name="value"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.value ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
            </div>
            {errors.value && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.value}
              </p>
            )}
            {formData.value && !errors.value && (
              <p className="mt-1 text-sm text-gray-500">
                {formatCurrency(parseFloat(formData.value) || 0)}
              </p>
            )}
          </div>
          
          {/* Cliente */}
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.clientId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.clientId}
              </p>
            )}
          </div>
        </div>
        
        {/* Erro geral */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">{errors.submit}</span>
            </div>
          </div>
        )}
        
        {/* Botões */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Projeto
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;


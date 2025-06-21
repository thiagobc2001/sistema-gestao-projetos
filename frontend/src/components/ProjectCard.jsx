// Componente de card para exibir projetos
import React from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Calendar, 
  DollarSign, 
  User, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  formatDate, 
  formatCurrency, 
  getStatusText, 
  getStatusColor,
  calculateDaysRemaining 
} from '../utils/helpers.js';

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const { currentUser } = useApp();
  const isManager = currentUser?.role === 'manager';
  const daysRemaining = calculateDaysRemaining(project.endDate);
  
  // Determinar ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Determinar cor da barra de progresso
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header do card */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {project.description}
            </p>
          </div>
          
          {/* Status badge */}
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1">{getStatusText(project.status)}</span>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm text-gray-500">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        
        {/* Informações do projeto */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Início: {formatDate(project.startDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Fim: {formatDate(project.endDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{formatCurrency(project.value)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>{isManager ? project.clientName : project.managerName}</span>
          </div>
        </div>
        
        {/* Alerta de prazo */}
        {daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                {daysRemaining === 0 
                  ? 'Prazo vence hoje!' 
                  : `${daysRemaining} dia${daysRemaining > 1 ? 's' : ''} restante${daysRemaining > 1 ? 's' : ''}`
                }
              </span>
            </div>
          </div>
        )}
        
        {/* Prazo vencido */}
        {daysRemaining !== null && daysRemaining < 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                Prazo vencido há {Math.abs(daysRemaining)} dia{Math.abs(daysRemaining) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer com ações */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Atualizado em {formatDate(project.updatedAt)}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botão visualizar */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(project)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            
            {/* Botões de ação para gestores */}
            {isManager && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(project)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;


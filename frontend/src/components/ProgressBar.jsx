// Componente de barra de progresso personalizada
import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  size = 'md', 
  showLabel = true, 
  showPercentage = true,
  color = 'blue',
  className = '',
  animated = false
}) => {
  // Definir tamanhos
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };
  
  // Definir cores
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  };
  
  // Determinar cor baseada no progresso se não especificada
  const getProgressColor = () => {
    if (color !== 'blue') return colors[color] || colors.blue;
    
    if (progress >= 80) return colors.green;
    if (progress >= 50) return colors.blue;
    if (progress >= 25) return colors.yellow;
    return colors.gray;
  };
  
  // Garantir que o progresso esteja entre 0 e 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label e porcentagem */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">
              Progresso
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {normalizedProgress}%
            </span>
          )}
        </div>
      )}
      
      {/* Barra de progresso */}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div 
          className={`
            ${sizes[size]} 
            rounded-full 
            transition-all 
            duration-500 
            ease-out
            ${getProgressColor()}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      
      {/* Texto adicional baseado no progresso */}
      {showLabel && (
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            {normalizedProgress === 0 && 'Não iniciado'}
            {normalizedProgress > 0 && normalizedProgress < 100 && 'Em andamento'}
            {normalizedProgress === 100 && 'Concluído'}
          </span>
        </div>
      )}
    </div>
  );
};

// Componente de progresso circular
export const CircularProgress = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 4,
  color = 'blue',
  showPercentage = true,
  className = ''
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  
  // Cores para progresso circular
  const colors = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    gray: '#6B7280'
  };
  
  const getProgressColor = () => {
    if (color !== 'blue') return colors[color] || colors.blue;
    
    if (normalizedProgress >= 80) return colors.green;
    if (normalizedProgress >= 50) return colors.blue;
    if (normalizedProgress >= 25) return colors.yellow;
    return colors.gray;
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Círculo de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Círculo de progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Porcentagem no centro */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {normalizedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;


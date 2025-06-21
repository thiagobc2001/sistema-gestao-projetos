// Contexto principal da aplicação para gerenciar estado global
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  projectStorage, 
  stageStorage, 
  taskStorage, 
  userStorage, 
  currentUserStorage,
  initializeSampleData 
} from '../data/storage.js';

// Estado inicial da aplicação
const initialState = {
  // Autenticação
  currentUser: null,
  isAuthenticated: false,
  
  // Dados
  projects: [],
  stages: [],
  tasks: [],
  users: [],
  
  // UI
  loading: false,
  error: null,
  
  // Filtros e visualização
  projectFilter: 'all', // 'all', 'pending', 'in_progress', 'completed'
  searchTerm: ''
};

// Tipos de ações
const ActionTypes = {
  // Autenticação
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  
  // Loading e Error
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Dados
  LOAD_DATA: 'LOAD_DATA',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_STAGE: 'ADD_STAGE',
  UPDATE_STAGE: 'UPDATE_STAGE',
  DELETE_STAGE: 'DELETE_STAGE',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  
  // Filtros
  SET_PROJECT_FILTER: 'SET_PROJECT_FILTER',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM'
};

// Reducer para gerenciar o estado
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        error: null
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ActionTypes.LOAD_DATA:
      return {
        ...state,
        projects: action.payload.projects || [],
        stages: action.payload.stages || [],
        tasks: action.payload.tasks || [],
        users: action.payload.users || [],
        loading: false
      };
      
    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
      
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
      
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };
      
    case ActionTypes.ADD_STAGE:
      return {
        ...state,
        stages: [...state.stages, action.payload]
      };
      
    case ActionTypes.UPDATE_STAGE:
      return {
        ...state,
        stages: state.stages.map(stage =>
          stage.id === action.payload.id ? action.payload : stage
        )
      };
      
    case ActionTypes.DELETE_STAGE:
      return {
        ...state,
        stages: state.stages.filter(stage => stage.id !== action.payload)
      };
      
    case ActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
      
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
      
    case ActionTypes.SET_PROJECT_FILTER:
      return {
        ...state,
        projectFilter: action.payload
      };
      
    case ActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
      
    default:
      return state;
  }
};

// Criar contexto
const AppContext = createContext();

// Provider do contexto
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);
  
  // Verificar usuário logado ao inicializar
  useEffect(() => {
    const currentUser = currentUserStorage.get();
    if (currentUser) {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: currentUser });
    }
  }, []);
  
  // Função para carregar dados iniciais
  const loadInitialData = () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      // Inicializar dados de exemplo se necessário
      initializeSampleData();
      
      // Carregar dados do localStorage
      const projects = projectStorage.getAll();
      const stages = stageStorage.getAll();
      const tasks = taskStorage.getAll();
      const users = userStorage.getAll();
      
      dispatch({
        type: ActionTypes.LOAD_DATA,
        payload: { projects, stages, tasks, users }
      });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao carregar dados' });
    }
  };
  
  // Ações de autenticação
  const login = (email, password) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      // Simulação de login simples
      const user = userStorage.getByEmail(email);
      
      if (user) {
        currentUserStorage.set(user);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
        return { success: true };
      } else {
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Usuário não encontrado' });
        return { success: false, error: 'Usuário não encontrado' };
      }
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao fazer login' });
      return { success: false, error: 'Erro ao fazer login' };
    }
  };
  
  const logout = () => {
    currentUserStorage.clear();
    dispatch({ type: ActionTypes.LOGOUT });
  };
  
  // Ações de projetos
  const addProject = (projectData) => {
    try {
      const success = projectStorage.save(projectData);
      if (success) {
        dispatch({ type: ActionTypes.ADD_PROJECT, payload: projectData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar projeto' };
    } catch (error) {
      return { success: false, error: 'Erro ao adicionar projeto' };
    }
  };
  
  const updateProject = (projectData) => {
    try {
      const success = projectStorage.save(projectData);
      if (success) {
        dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: projectData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar projeto' };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar projeto' };
    }
  };
  
  const deleteProject = (projectId) => {
    try {
      const success = projectStorage.delete(projectId);
      if (success) {
        dispatch({ type: ActionTypes.DELETE_PROJECT, payload: projectId });
        return { success: true };
      }
      return { success: false, error: 'Erro ao deletar projeto' };
    } catch (error) {
      return { success: false, error: 'Erro ao deletar projeto' };
    }
  };
  
  // Ações de etapas
  const addStage = (stageData) => {
    try {
      const success = stageStorage.save(stageData);
      if (success) {
        dispatch({ type: ActionTypes.ADD_STAGE, payload: stageData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar etapa' };
    } catch (error) {
      return { success: false, error: 'Erro ao adicionar etapa' };
    }
  };
  
  const updateStage = (stageData) => {
    try {
      const success = stageStorage.save(stageData);
      if (success) {
        dispatch({ type: ActionTypes.UPDATE_STAGE, payload: stageData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar etapa' };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar etapa' };
    }
  };
  
  const deleteStage = (stageId) => {
    try {
      const success = stageStorage.delete(stageId);
      if (success) {
        dispatch({ type: ActionTypes.DELETE_STAGE, payload: stageId });
        return { success: true };
      }
      return { success: false, error: 'Erro ao deletar etapa' };
    } catch (error) {
      return { success: false, error: 'Erro ao deletar etapa' };
    }
  };
  
  // Ações de tarefas
  const addTask = (taskData) => {
    try {
      const success = taskStorage.save(taskData);
      if (success) {
        dispatch({ type: ActionTypes.ADD_TASK, payload: taskData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar tarefa' };
    } catch (error) {
      return { success: false, error: 'Erro ao adicionar tarefa' };
    }
  };
  
  const updateTask = (taskData) => {
    try {
      const success = taskStorage.save(taskData);
      if (success) {
        dispatch({ type: ActionTypes.UPDATE_TASK, payload: taskData });
        return { success: true };
      }
      return { success: false, error: 'Erro ao salvar tarefa' };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar tarefa' };
    }
  };
  
  const deleteTask = (taskId) => {
    try {
      const success = taskStorage.delete(taskId);
      if (success) {
        dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId });
        return { success: true };
      }
      return { success: false, error: 'Erro ao deletar tarefa' };
    } catch (error) {
      return { success: false, error: 'Erro ao deletar tarefa' };
    }
  };
  
  // Ações de filtros
  const setProjectFilter = (filter) => {
    dispatch({ type: ActionTypes.SET_PROJECT_FILTER, payload: filter });
  };
  
  const setSearchTerm = (term) => {
    dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term });
  };
  
  // Limpar erro
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };
  
  // Valor do contexto
  const value = {
    // Estado
    ...state,
    
    // Ações de autenticação
    login,
    logout,
    
    // Ações de dados
    addProject,
    updateProject,
    deleteProject,
    addStage,
    updateStage,
    deleteStage,
    addTask,
    updateTask,
    deleteTask,
    
    // Ações de filtros
    setProjectFilter,
    setSearchTerm,
    
    // Utilitários
    clearError,
    loadInitialData
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};


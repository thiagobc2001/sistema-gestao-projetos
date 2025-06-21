// Componente para modal do WhatsApp
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { 
  MessageCircle, 
  X, 
  Copy, 
  ExternalLink,
  Phone,
  User
} from 'lucide-react';
import { generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/helpers.js';

const WhatsAppModal = ({ 
  isOpen, 
  onClose, 
  projectTitle, 
  projectId, 
  stageTitle = '', 
  clientName = '',
  clientPhone = '' 
}) => {
  const [phoneNumber, setPhoneNumber] = useState(clientPhone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  
  if (!isOpen) return null;
  
  const defaultMessage = generateWhatsAppMessage(projectTitle, projectId, stageTitle);
  const finalMessage = useCustomMessage ? customMessage : defaultMessage;
  
  const handleSendWhatsApp = () => {
    const url = generateWhatsAppUrl(phoneNumber, finalMessage);
    window.open(url, '_blank');
    onClose();
  };
  
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(finalMessage);
    // Aqui você pode adicionar uma notificação de sucesso
  };
  
  const handleCopyLink = () => {
    const url = generateWhatsAppUrl(phoneNumber, finalMessage);
    navigator.clipboard.writeText(url);
    // Aqui você pode adicionar uma notificação de sucesso
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Compartilhar via WhatsApp
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Informações do projeto */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Detalhes do Compartilhamento</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-500 w-16">Projeto:</span>
              <span className="text-gray-900">{projectTitle}</span>
            </div>
            {stageTitle && (
              <div className="flex items-center">
                <span className="text-gray-500 w-16">Etapa:</span>
                <span className="text-gray-900">{stageTitle}</span>
              </div>
            )}
            {clientName && (
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-500 w-14">Cliente:</span>
                <span className="text-gray-900">{clientName}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Número do telefone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do WhatsApp (opcional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: +5511999999999"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Deixe em branco para abrir o WhatsApp sem número específico
          </p>
        </div>
        
        {/* Opção de mensagem personalizada */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Mensagem
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useCustomMessage}
                onChange={(e) => {
                  setUseCustomMessage(e.target.checked);
                  if (e.target.checked && !customMessage) {
                    setCustomMessage(defaultMessage);
                  }
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Personalizar mensagem</span>
            </label>
          </div>
          
          {useCustomMessage ? (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Digite sua mensagem personalizada..."
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{defaultMessage}</p>
            </div>
          )}
        </div>
        
        {/* Ações */}
        <div className="space-y-3">
          {/* Botão principal */}
          <Button
            onClick={handleSendWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Abrir WhatsApp
          </Button>
          
          {/* Ações secundárias */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCopyMessage}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Mensagem
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
          </div>
          
          {/* Botão cancelar */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
        
        {/* Dica */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Dica:</strong> O link do projeto será incluído automaticamente na mensagem para que o cliente possa acessar os detalhes diretamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;


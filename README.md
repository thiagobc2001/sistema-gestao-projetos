# Sistema de Gerenciamento de Projetos

Um sistema web completo e intuitivo para gerenciamento de projetos, desenvolvido com React e focado na experiência do usuário. O sistema permite que gestores criem e acompanhem projetos detalhados, enquanto clientes podem visualizar o progresso de seus projetos em tempo real.

## 🚀 Demonstração

**URL de Produção:** https://htplpqlu.manus.space

### Credenciais de Teste

**Gestor:**
- Email: gestor@empresa.com
- Senha: 123456

**Cliente:**
- Email: cliente@empresa.com  
- Senha: 123456

## ✨ Funcionalidades Principais

### Para Gestores
- **Dashboard Completo**: Visão geral de todos os projetos com estatísticas e métricas
- **Gerenciamento de Projetos**: Criar, editar e excluir projetos
- **Sistema de Etapas**: Organizar projetos em etapas sequenciais
- **Checklist de Tarefas**: Criar e gerenciar tarefas dentro de cada etapa
- **Cálculo Automático de Progresso**: Progresso calculado automaticamente baseado na conclusão das tarefas
- **Integração WhatsApp**: Compartilhar atualizações de etapas via WhatsApp
- **Filtros e Pesquisa**: Filtrar projetos por status e pesquisar por termos
- **Controle de Acesso**: Funcionalidades restritas apenas para gestores

### Para Clientes
- **Visualização de Projetos**: Acompanhar todos os projetos atribuídos
- **Detalhes Completos**: Ver informações detalhadas, etapas e progresso
- **Interface Simplificada**: Acesso apenas às informações relevantes
- **Atualizações em Tempo Real**: Progresso atualizado conforme tarefas são concluídas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 com Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Armazenamento**: LocalStorage (para demonstração)
- **Deploy**: Manus Platform

## 📋 Estrutura do Sistema

### Modelos de Dados

**Usuário**
- ID único
- Nome, email, função (gestor/cliente)
- Timestamps de criação/atualização

**Projeto**
- Informações básicas (título, descrição, datas, valor)
- Relacionamentos (gestor, cliente)
- Status e progresso calculado
- Timestamps de criação/atualização

**Etapa**
- Título, descrição, ordem
- Status e progresso individual
- Relacionamento com projeto
- Timestamps de criação/atualização

**Tarefa**
- Título, descrição, ordem
- Status de conclusão
- Relacionamento com etapa e projeto
- Timestamps de criação/atualização

### Funcionalidades Detalhadas

#### Sistema de Progresso
- **Cálculo Automático**: O progresso é calculado automaticamente baseado na conclusão das tarefas
- **Hierarquia**: Tarefa → Etapa → Projeto
- **Atualização em Tempo Real**: Mudanças refletem imediatamente em toda a hierarquia

#### Integração WhatsApp
- **Templates Automáticos**: Mensagens pré-formatadas com informações do projeto
- **Links Diretos**: Inclui link para visualização do projeto
- **Personalização**: Possibilidade de editar mensagem antes do envio
- **Múltiplas Opções**: Copiar mensagem, copiar link ou abrir WhatsApp diretamente

#### Interface Responsiva
- **Design Mobile-First**: Funciona perfeitamente em dispositivos móveis
- **Navegação Intuitiva**: Sidebar colapsível e navegação clara
- **Componentes Reutilizáveis**: Interface consistente em toda aplicação

## 🎯 Casos de Uso

### Fluxo do Gestor
1. **Login** no sistema como gestor
2. **Visualizar Dashboard** com resumo de todos os projetos
3. **Criar Novo Projeto** com informações completas
4. **Adicionar Etapas** sequenciais ao projeto
5. **Criar Tarefas** dentro de cada etapa
6. **Marcar Tarefas** como concluídas conforme progresso
7. **Compartilhar Atualizações** via WhatsApp com cliente
8. **Acompanhar Progresso** em tempo real

### Fluxo do Cliente
1. **Login** no sistema como cliente
2. **Visualizar Projetos** atribuídos
3. **Acompanhar Progresso** detalhado de cada projeto
4. **Ver Etapas e Tarefas** em andamento
5. **Receber Atualizações** via WhatsApp do gestor

## 🔧 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone [url-do-repositorio]

# Instalar dependências
cd project-manager
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal
│   ├── ProjectCard.jsx # Card de projeto
│   ├── ProgressBar.jsx # Barra de progresso
│   └── ...
├── contexts/           # Contextos React
│   └── AppContext.jsx  # Contexto principal
├── data/              # Modelos e armazenamento
│   ├── models.js      # Modelos de dados
│   └── storage.js     # Sistema de armazenamento
├── pages/             # Páginas principais
│   ├── LoginPage.jsx  # Página de login
│   ├── DashboardPage.jsx # Dashboard
│   └── ...
├── utils/             # Funções utilitárias
│   └── helpers.js     # Funções auxiliares
└── App.jsx           # Componente principal
```

## 🎨 Design e UX

### Princípios de Design
- **Simplicidade**: Interface limpa e intuitiva
- **Consistência**: Padrões visuais consistentes
- **Acessibilidade**: Cores e contrastes adequados
- **Responsividade**: Funciona em todos os dispositivos

### Paleta de Cores
- **Primária**: Azul (#3B82F6) - Ações principais
- **Sucesso**: Verde (#10B981) - Status positivos
- **Aviso**: Amarelo (#F59E0B) - Alertas
- **Erro**: Vermelho (#EF4444) - Erros e exclusões
- **Neutro**: Cinza (#6B7280) - Textos e bordas

## 📱 Responsividade

O sistema foi desenvolvido com abordagem mobile-first:

- **Mobile (< 768px)**: Layout em coluna única, sidebar colapsível
- **Tablet (768px - 1024px)**: Layout adaptado com sidebar fixa
- **Desktop (> 1024px)**: Layout completo com todas as funcionalidades

## 🔒 Segurança e Controle de Acesso

### Autenticação
- Sistema simples de login por email/senha
- Sessão persistente no localStorage
- Logout seguro com limpeza de dados

### Autorização
- **Gestores**: Acesso completo a todas as funcionalidades
- **Clientes**: Acesso apenas à visualização de projetos
- Validação de permissões em todos os componentes

## 🚀 Deploy e Produção

### Build de Produção
```bash
npm run build
```

### Deploy Automático
O sistema está configurado para deploy automático na plataforma Manus:
- Build otimizado com Vite
- Assets minificados e comprimidos
- CDN global para performance

## 📈 Métricas e Analytics

### Dados Rastreados
- Progresso de projetos em tempo real
- Status de etapas e tarefas
- Tempo de conclusão de projetos
- Valor total de projetos

### Relatórios Disponíveis
- Dashboard com estatísticas gerais
- Progresso individual por projeto
- Filtros por status e período

## 🔄 Atualizações Futuras

### Funcionalidades Planejadas
- **Notificações Push**: Alertas em tempo real
- **Relatórios Avançados**: Exportação em PDF/Excel
- **Integração de Calendário**: Sincronização com Google Calendar
- **Chat Interno**: Comunicação direta entre gestor e cliente
- **API REST**: Integração com sistemas externos
- **Backup Automático**: Sincronização com banco de dados

### Melhorias Técnicas
- **Banco de Dados**: Migração do localStorage para PostgreSQL
- **Autenticação JWT**: Sistema de tokens mais seguro
- **Testes Automatizados**: Cobertura completa de testes
- **PWA**: Aplicativo web progressivo
- **Performance**: Otimizações adicionais de carregamento

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### Padrões de Código
- ESLint para linting
- Prettier para formatação
- Comentários em português
- Nomes de variáveis descritivos

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- **Email**: suporte@empresa.com
- **Documentação**: Este README
- **Demo**: https://htplpqlu.manus.space

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando React e Manus Platform**


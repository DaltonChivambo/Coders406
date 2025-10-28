# HUMAI - Sistema de Monitoramento de Tráfico Humano

Sistema integrado para denúncias e monitoramento de casos de tráfico humano, conectando instituições e cidadãos na luta contra este crime em Moçambique.

## 🎯 Visão Geral

O HUMAI é uma plataforma completa desenvolvida para combater o tráfico humano através da tecnologia, oferecendo:

- **Sistema de Denúncias**: Interface para cidadãos e instituições reportarem casos suspeitos
- **Monitoramento de Casos**: Acompanhamento do progresso das denúncias em tempo real
- **Colaboração Institucional**: Conexão entre diferentes organizações para investigação coordenada
- **Transparência Pública**: Acesso a estatísticas e casos resolvidos (anonimizados)

## 🏢 Instituições Suportadas

- **Associação Coordenadora HUMAI**
- **ONG Proteção da Mulher**
- **SERNIC** (Serviço Nacional de Investigação Criminal)
- **PRM** (Polícia da República de Moçambique)
- **PGR** (Procuradoria-Geral da República)
- **Escolas** (Josina Machel, 25 de Setembro)
- **Hospitais** (Central Maputo, Provincial Nampula)
- **Igreja Católica de Maputo**

## 🚀 Tecnologias

### Backend
- **Node.js** com **Express**
- **TypeScript** para tipagem estática
- **MongoDB** com **Mongoose** para banco de dados
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Zod** para validação de dados

### Frontend
- **React** com **TypeScript**
- **Vite** para build e desenvolvimento
- **TailwindCSS** para estilização
- **Zustand** para gerenciamento de estado
- **React Hook Form** com **Zod** para formulários
- **React Query** para cache de dados

## 📊 Funcionalidades

### Para Cidadãos
- Fazer denúncias anônimas ou identificadas
- Verificar status de denúncias
- Verificar oportunidades suspeitas
- Acessar relatórios públicos

### Para Instituições
- Gerenciar denúncias recebidas
- Criar novas denúncias internas
- Rastrear casos em andamento
- Colaborar com outras instituições
- Gerar relatórios e estatísticas

### Para Operadores
- Dashboard completo com métricas
- Criação de denúncias institucionais
- Gerenciamento de casos
- Sistema de priorização e classificação

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Credenciais de Teste

Consulte o arquivo `CREDENCIAIS_TESTE.md` para credenciais de acesso ao sistema.

## 🌐 Acesso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## 📄 Licença

Este projeto foi desenvolvido para o Hackathon UNODC - Tráfico de Pessoas em Moçambique.

## 👥 Equipe

Desenvolvido pela equipe **Coders406** durante o Hackathon UNODC.
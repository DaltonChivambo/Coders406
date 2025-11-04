```markdown
# 🧭 SafePath — Combate ao Tráfico de Pessoas com Dados e Inteligência Artificial
> **Projeto desenvolvido pela equipe CODER406**
> 🏆 Hackathon Contra o Tráfico de Pessoas — Em parceria com **UNODC**, **UEM** e **Knowledge Foundation**
---
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![LangChain](https://img.shields.io/badge/AI-LangChain-blue)
![Google-API](https://img.shields.io/badge/API-Google-lightgrey?logo=google)
![Multer](https://img.shields.io/badge/Uploads-Multer-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
---
## 🌍 Visão Geral
**SafePath** é uma plataforma integrada que utiliza **IA e análise de dados** para **prevenir, detectar e combater o tráfico de seres humanos** em Moçambique.
O sistema conecta cidadãos, instituições e autoridades, permitindo tanto o **envio de denúncias anônimas** quanto a **verificação de oportunidades suspeitas de emprego ou viagem**.
> 💡 “Se com dados é possível prever onde vai chover, também é possível prever onde haverá tráfico humano.”
---
## 🧩 Módulos Principais
### 🔍 **SafePath Verificar Oportunidades**
Sistema inteligente para detectar anúncios fraudulentos e proteger pessoas contra esquemas de tráfico humano.
- Analisa textos e anúncios suspeitos usando IA (RAG + LLMs).
- Identifica linguagem manipuladora e elementos de risco.
- Permite à PGR (Procuradoria-Geral da República) visualizar padrões de suspeita.
- Monitora **domínios, emails, números e empresas** com alto índice de risco.
🧠 *Utiliza LangChain e RAG integrados à API do Google para análise semântica e busca contextual.*
### 🚨 **SafePath Denúncias TSH**
Sistema seguro e anônimo para envio de denúncias sobre tráfico humano.
- Envio de denúncias por cidadãos e instituições (escolas, igrejas, hospitais, ONGs).
- Classificação automática por **urgência e risco**.
- Armazenamento seguro e estruturado em **MongoDB**.
- Acesso controlado para autoridades, com histórico e status das denúncias.
- Geração de relatórios públicos com dados anonimizados.
---
## ⚙️ Tecnologias Utilizadas
| Camada | Tecnologia | Descrição |
|:--|:--|:--|
| **Frontend** | React.js | Interface moderna, responsiva e interativa. |
| **Backend** | Node.js + Express | API central para autenticação, denúncias e verificações. |
| **Banco de Dados** | MongoDB | Armazenamento de dados estruturados e relatórios. |
| **IA & Análise** | LangChain + RAG + Google API | Detecção de linguagem manipuladora e risco em anúncios. |
| **Upload de Arquivos** | Multer | Gerenciamento seguro de anexos em denúncias. |
| **Integrações** | Google Custom Search API, LLM local ou em nuvem | Enriquecimento de dados e análise contextual. |
---
---
## 📊 Funcionalidades Principais
✅ Detectar anúncios fraudulentos
✅ Identificar linguagem manipuladora
✅ Enviar denúncias anônimas
✅ Painel para autoridades (PGR)
✅ Análise por província, distrito e instituição
✅ Rastreamento de domínios, emails e telefones suspeitos
✅ Relatórios públicos e anonimizados
✅ Geração automática de indicadores e estatísticas
---
## 🧠 Como Funciona
1. **Cidadãos ou instituições** enviam denúncias ou verificam oportunidades suspeitas.
2. **O sistema de IA (LangChain + Google API)** analisa texto, metadados e contexto.
3. **A PGR e outras autoridades** visualizam as verificações e denúncias em dashboards.
4. **Relatórios públicos** são gerados automaticamente com dados anonimizados.
---
## 💾 Estrutura do Projeto
```
SafePath/
│
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── services/ # Lógica de IA, LangChain e integração RAG
│ │ └── utils/
│ ├── .env.example
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── services/
│ └── package.json
│
├── README.md
└── package.json
```
---
## 🚀 Como Executar Localmente
### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/Coders406/humai-verify-opportunity.git
cd humai-verify-opportunity
```
### 2️⃣ Configurar o Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
### 3️⃣ Configurar o Frontend
```bash
cd frontend
npm install
npm run dev
```
---
## 🧩 Integrações Futuras
* 🔔 Integração com WhatsApp Cloud API para notificações em tempo real
* 🗺️ Mapa interativo com casos por província
* 🤖 Aprendizado contínuo com feedback de autoridades
* 🛡️ Sistema de reputação para fontes de denúncias
---
## 👥 Equipe CODER406
| Nome | Função | GitHub |
| ------------------- | -------------------------------- | ---------------------------------------------------- |
| **Dalton Chivambo** | Software Developer | [@DaltonChivambo](https://github.com/DaltonChivambo) |
| **Túlio Nhantumbo** | Fullstack Developer | [@BeneditoTulio](https://github.com/beneditotulio) |
| **Elina Tsovo** | Frontend Developer | [@ElinaTsovo](https://github.com/ElinaTsovo) |
| **Liliano Licumba** | Backend Developer | [@Ailinol](https://github.com/Ailinol) |
| **Michael Mabombe** | Flutter Developer | [@MichaelMabombe](https://github.com/MichaelMabombe) |
---
## 🤝 Parcerias
Projeto desenvolvido em colaboração com:
🟦 **UNODC** — Escritório das Nações Unidas sobre Drogas e Crime
🎓 **UEM** — Universidade Eduardo Mondlane
💡 **Knowledge Foundation**
---
## 📜 Licença
Este projeto é de código aberto sob a licença **MIT License**.
Sinta-se livre para usar, melhorar e contribuir.
---
---
> “Com dados e IA, podemos proteger vidas e construir um Moçambique mais seguro.”
```
```

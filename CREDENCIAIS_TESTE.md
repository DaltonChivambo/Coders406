# 🔑 CREDENCIAIS DE TESTE - HUMAI (REFATORADO)

## 📊 Status do Sistema
- ✅ **Backend**: http://localhost:5000 (funcionando)
- ✅ **Frontend**: http://localhost:3001 (funcionando)
- ✅ **Banco de Dados**: 5 instituições, 6 usuários criados
- ✅ **Sistema Refatorado**: Novos perfis e fluxos de denúncia

## 👥 USUÁRIOS DISPONÍVEIS

### 🏢 Associação Coordenadora HUMAI (GESTORA)
- **Email**: maria@humai.org.mz
- **Senha**: 123456
- **Perfil**: Gestor Sistema
- **Código da Instituição**: HUMAI1

### 🏢 ONG Proteção da Mulher (RECEPTORA)
- **Email**: ana@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Operador
- **Código da Instituição**: ONG001

- **Email**: carlos@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Analista
- **Código da Instituição**: ONG001

### 🏢 PGR (Procuradoria-Geral da República) - AUTORIDADE
- **Email**: rita@pgr.gov.mz
- **Senha**: 123456
- **Perfil**: Autoridade
- **Código da Instituição**: PGR001

### 🏢 ESCOLA SECUNDÁRIA JOSINA MACHEL (ESJM)
- **Email**: joao@esjm.edu.mz
- **Senha**: 123456
- **Perfil**: Operador
- **Código da Instituição**: ESC001
- **Bairro**: Mafalala

### 🏢 ESCOLA PRIMÁRIA 25 DE SETEMBRO (EPS25)
- **Email**: sofia@eps25.edu.mz
- **Senha**: 123456
- **Perfil**: Operador
- **Código da Instituição**: ESC002
- **Bairro**: Alto Maé

## 🔧 COMO TESTAR

### 🔐 Login no Sistema
1. **Acesse**: http://localhost:3001/login
2. **Preencha**:
   - Email: maria@humai.org.mz
   - Senha: 123456
   - Código da Instituição: HUMAI1
3. **Clique**: "Acessar Sistema"

**Nota**: Agora o login usa códigos de acesso ao invés de seleção de instituição!

### 📊 Fluxos de Denúncia

#### 🏫 Escola → PGR
1. **Login como Operador da Escola** (joao@esjm.edu.mz / ESC001)
2. **Criar denúncia** → Status: AGUARDANDO_TRIAGEM
3. **Sistema submete automaticamente** → Status: SUBMETIDO_AUTORIDADE
4. **PGR vê o caso** e pode atualizar status

#### 🏢 ONG → PGR
1. **Login como Operador da ONG** (ana@protecaomulher.org.mz / ONG001)
2. **Criar denúncia** → Status: AGUARDANDO_TRIAGEM
3. **Analista analisa** (carlos@protecaomulher.org.mz) → Status: EM_ANALISE
4. **Analista submete** → Status: SUBMETIDO_AUTORIDADE
5. **PGR atualiza status** → EM_INVESTIGACAO → CASO_ENCERRADO

### 📊 Verificação de Status de Denúncias
1. **Acesse**: http://localhost:3000/verificar-status
2. **Digite o código de rastreio** da denúncia
3. **Clique**: "Verificar Status"
4. **Visualize**:
   - Status atual da denúncia
   - Progresso do processo
   - Etapas concluídas e pendentes
   - Detalhes da denúncia (opcional)

### 🏢 Novas Instituições
- **Escolas**: Podem fazer denúncias de casos suspeitos
- **Hospitais**: Podem reportar vítimas atendidas
- **Igrejas**: Podem denunciar casos da comunidade

## 🐛 DEBUG

Se houver problemas:

1. **Abra o Console do navegador** (F12)
2. **Verifique os logs** de debug que foram adicionados
3. **Verifique a aba Network** para ver as requisições
4. **Teste o backend diretamente**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"maria@humai.org.mz","senha":"123456","instituicaoId":"69009dcfa0029e193e745a86"}'
   ```

## 📝 NOTAS

- **Senha padrão** para todos os usuários: `123456`
- **instituicaoId** é obrigatório no login
- **Logs de debug** foram adicionados à página de login
- **Teste de login** disponível em: http://localhost:8080/test-login.html

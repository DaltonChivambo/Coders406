# 🔑 CREDENCIAIS DE TESTE - HUMAI

## 📊 Status do Sistema
- ✅ **Backend**: http://localhost:5000 (funcionando)
- ✅ **Frontend**: http://localhost:3000 (funcionando)
- ✅ **Banco de Dados**: 10 instituições, 14 usuários criados
- ✅ **Novas Funcionalidades**: Verificação de status de denúncias

## 👥 USUÁRIOS DISPONÍVEIS

### 🏢 Associação Coordenadora HUMAI (ACH)
- **Email**: maria@humai.org.mz
- **Senha**: 123456
- **Perfil**: Coordenador Associação
- **ID da Instituição**: 68ff5b9a31867c9647a99a5a

### 🏢 ONG Proteção da Mulher (PM)
- **Email**: joao@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **ID da Instituição**: 68ff5b9a31867c9647a99a5b

- **Email**: ana@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Operador
- **ID da Instituição**: 68ff5b9a31867c9647a99a5b

- **Email**: carlos@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Analista
- **ID da Instituição**: 68ff5b9a31867c9647a99a5b

- **Email**: sofia@protecaomulher.org.mz
- **Senha**: 123456
- **Perfil**: Supervisor
- **ID da Instituição**: 68ff5b9a31867c9647a99a5b

### 🏢 SERNIC (Serviço Nacional de Investigação Criminal)
- **Email**: miguel@sernic.gov.mz
- **Senha**: 123456
- **Perfil**: Coordenador Local
- **ID da Instituição**: 68ff5b9a31867c9647a99a5c

- **Email**: isabel@sernic.gov.mz
- **Senha**: 123456
- **Perfil**: Investigador
- **ID da Instituição**: 68ff5b9a31867c9647a99a5c

### 🏢 PRM (Polícia da República de Moçambique)
- **Email**: pedro@prm.gov.mz
- **Senha**: 123456
- **Perfil**: Investigador
- **ID da Instituição**: 68ff5b9a31867c9647a99a5d

### 🏢 PGR (Procuradoria-Geral da República)
- **Email**: rita@pgr.gov.mz
- **Senha**: 123456
- **Perfil**: Investigador
- **ID da Instituição**: 68ff5b9a31867c9647a99a5e

### 🏢 ESCOLA SECUNDÁRIA JOSINA MACHEL (ESJM)
- **Email**: carlos@esjm.edu.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **Tipo**: Escola

### 🏢 HOSPITAL CENTRAL DE MAPUTO (HCM)
- **Email**: ana@hcm.saude.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **Tipo**: Hospital

### 🏢 IGREJA CATÓLICA DE MAPUTO (ICM)
- **Email**: joao@igreja.maputo.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **Tipo**: Igreja

### 🏢 ESCOLA PRIMÁRIA 25 DE SETEMBRO (EPS25)
- **Email**: maria@eps25.edu.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **Tipo**: Escola

### 🏢 HOSPITAL PROVINCIAL DE NAMPULA (HPN)
- **Email**: pedro@hpn.saude.mz
- **Senha**: 123456
- **Perfil**: Agente Comunitário
- **Tipo**: Hospital

## 🔧 COMO TESTAR

### 🔐 Login no Sistema
1. **Acesse**: http://localhost:3000/login
2. **Preencha**:
   - Email: maria@humai.org.mz
   - Senha: 123456
   - Instituição: Associação Coordenadora HUMAI (ACH)
3. **Clique**: "Entrar"

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
     -d '{"email":"maria@humai.org.mz","senha":"123456","instituicaoId":"68ff5b9a31867c9647a99a5a"}'
   ```

## 📝 NOTAS

- **Senha padrão** para todos os usuários: `123456`
- **instituicaoId** é obrigatório no login
- **Logs de debug** foram adicionados à página de login
- **Teste de login** disponível em: http://localhost:8080/test-login.html

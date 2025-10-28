// Script de debug para testar login
console.log('🔍 Iniciando debug do login...');

// Testar carregamento de instituições
fetch('http://localhost:5000/api/instituicoes')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Instituições carregadas:', data);
  })
  .catch(error => {
    console.error('❌ Erro ao carregar instituições:', error);
  });

// Testar login
const testLogin = async () => {
  try {
    console.log('🔐 Testando login...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'maria@humai.org.mz',
        senha: '123456',
        instituicaoId: '68ff5b9a31867c9647a99a5a'
      })
    });
    
    const data = await response.json();
    console.log('📊 Resposta do login:', data);
    
    if (data.success) {
      console.log('✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', data.data.user.nome);
      console.log('🏢 Instituição:', data.data.user.instituicao.nome);
    } else {
      console.error('❌ Erro no login:', data.message);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
};

// Executar teste após 2 segundos
setTimeout(testLogin, 2000);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/humai');
    console.log('✅ Conectado ao MongoDB');

    const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false }));

    const user = await Usuario.findOne({ 
      email: 'joao@humai.org.mz',
      ativo: true 
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('👤 Usuário encontrado:', user.nome);
    console.log('📧 Email:', user.email);
    console.log('🏢 Instituição ID:', user.instituicaoId);
    console.log('🔐 Senha hash:', user.senha.substring(0, 20) + '...');
    console.log('✅ Ativo:', user.ativo);

    // Testar comparação de senha
    const isPasswordValid = await bcrypt.compare('123456', user.senha);
    console.log('🔑 Senha válida:', isPasswordValid);

    // Testar com senha errada
    const isPasswordInvalid = await bcrypt.compare('senhaerrada', user.senha);
    console.log('❌ Senha inválida (teste):', isPasswordInvalid);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testLogin();

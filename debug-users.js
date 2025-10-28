const mongoose = require('mongoose');

async function debugUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/humai');
    console.log('✅ Conectado ao MongoDB');

    const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false }));
    const Instituicao = mongoose.model('Instituicao', new mongoose.Schema({}, { strict: false }));

    const usuarios = await Usuario.find({});
    console.log('\n👥 Usuários encontrados:');
    usuarios.forEach(user => {
      console.log(`- ${user.nome} (${user.email})`);
      console.log(`  Instituição: ${user.instituicaoId?.nome} (${user.instituicaoId?._id})`);
      console.log(`  Perfil: ${user.perfil}`);
      console.log(`  Ativo: ${user.ativo}`);
      console.log('');
    });

    const instituicoes = await Instituicao.find({});
    console.log('\n🏢 Instituições encontradas:');
    instituicoes.forEach(inst => {
      console.log(`- ${inst.nome} (${inst.sigla}) - ${inst._id}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugUsers();

import mongoose from 'mongoose';
import { config } from '../config';
import { Instituicao, Usuario } from '../models';
import { TipoInstituicao, PerfilUsuario } from '../types';

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Conectar ao MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    await Instituicao.deleteMany({});
    await Usuario.deleteMany({});
    console.log('🧹 Dados existentes removidos');

    // Criar instituições
    const instituicoes = [
      {
        nome: 'Associação Coordenadora HUMAI',
        tipo: TipoInstituicao.COORDENADORA,
        sigla: 'ACH',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 123456',
          email: 'coordenacao@humai.org.mz'
        },
        ativa: true
      },
      {
        nome: 'ONG Proteção da Mulher',
        tipo: TipoInstituicao.RECEPTORA,
        sigla: 'PM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 234567',
          email: 'contato@protecaomulher.org.mz'
        },
        ativa: true
      },
      {
        nome: 'SERNIC - Serviço Nacional de Investigação Criminal',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'SERNIC',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 345678',
          email: 'sernic@gov.mz'
        },
        ativa: true
      },
      {
        nome: 'PRM - Polícia da República de Moçambique',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'PRM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 456789',
          email: 'prm@gov.mz'
        },
        ativa: true
      },
      {
        nome: 'PGR - Procuradoria Geral da República',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'PGR',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 567890',
          email: 'pgr@gov.mz'
        },
        ativa: true
      }
    ];

    const instituicoesCriadas = await Instituicao.insertMany(instituicoes);
    console.log(`✅ ${instituicoesCriadas.length} instituições criadas`);

    // Criar usuários
    const usuarios = [
      {
        nome: 'João Silva',
        email: 'joao@humai.org.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[0]._id, // ACH
        perfil: PerfilUsuario.COORDENADOR_ASSOCIACAO,
        ativo: true
      },
      {
        nome: 'Maria Santos',
        email: 'maria@protecaomulher.org.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[1]._id, // PM
        perfil: PerfilUsuario.ANALISTA,
        ativo: true
      },
      {
        nome: 'Carlos Mendes',
        email: 'carlos@protecaomulher.org.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[1]._id, // PM
        perfil: PerfilUsuario.SUPERVISOR,
        ativo: true
      },
      {
        nome: 'Ana Costa',
        email: 'ana@sernic.gov.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[2]._id, // SERNIC
        perfil: PerfilUsuario.COORDENADOR_LOCAL,
        ativo: true
      },
      {
        nome: 'Pedro Oliveira',
        email: 'pedro@sernic.gov.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[2]._id, // SERNIC
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      },
      {
        nome: 'Sofia Pereira',
        email: 'sofia@prm.gov.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[3]._id, // PRM
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      },
      {
        nome: 'Miguel Fernandes',
        email: 'miguel@pgr.gov.mz',
        senha: '123456',
        instituicaoId: instituicoesCriadas[4]._id, // PGR
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      }
    ];

    // Criar usuários individualmente para executar middlewares
    const usuariosCriados = [];
    for (const usuarioData of usuarios) {
      const usuario = new Usuario(usuarioData);
      await usuario.save();
      usuariosCriados.push(usuario);
    }
    console.log(`✅ ${usuariosCriados.length} usuários criados`);

    console.log('\n📊 Resumo dos dados criados:');
    console.log(`- Instituições: ${instituicoesCriadas.length}`);
    console.log(`- Usuários: ${usuariosCriados.length}`);
    
    console.log('\n🔑 Credenciais de teste:');
    console.log('Coordenador da Associação:');
    console.log('  Email: joao@humai.org.mz');
    console.log('  Senha: 123456');
    console.log('  Instituição: ACH');
    
    console.log('\nAnalista:');
    console.log('  Email: maria@protecaomulher.org.mz');
    console.log('  Senha: 123456');
    console.log('  Instituição: PM');
    
    console.log('\nSupervisor:');
    console.log('  Email: carlos@protecaomulher.org.mz');
    console.log('  Senha: 123456');
    console.log('  Instituição: PM');

    console.log('\n✅ Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
};

// Executar seed se chamado diretamente
if (require.main === module) {
  seedData();
}

export default seedData;

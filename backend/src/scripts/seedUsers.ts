import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Instituicao from '../models/Instituicao';
import Usuario from '../models/Usuario';
import { TipoInstituicao, PerfilUsuario } from '../types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humai';

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Buscar instituições existentes
    const instituicoes = await Instituicao.find({});
    console.log('Instituições encontradas:', instituicoes.length);

    // Criar usuários de teste
    const senhaPadrao = await bcrypt.hash('123456', 10);

    const usuarios = await Usuario.insertMany([
      // Coordenador da Associação
      {
        nome: 'Maria Santos',
        email: 'maria@humai.org.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[0]._id,
        perfil: PerfilUsuario.COORDENADOR_ASSOCIACAO,
        ativo: true
      },
      // Agente Comunitário
      {
        nome: 'João Silva',
        email: 'joao@protecaomulher.org.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[1]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
        ativo: true
      },
      // Operador
      {
        nome: 'Ana Costa',
        email: 'ana@protecaomulher.org.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[1]._id,
        perfil: PerfilUsuario.OPERADOR,
        ativo: true
      },
      // Analista
      {
        nome: 'Carlos Mendes',
        email: 'carlos@protecaomulher.org.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[1]._id,
        perfil: PerfilUsuario.ANALISTA,
        ativo: true
      },
      // Supervisor
      {
        nome: 'Sofia Pereira',
        email: 'sofia@protecaomulher.org.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[1]._id,
        perfil: PerfilUsuario.SUPERVISOR,
        ativo: true
      },
      // Coordenador Local SERNIC
      {
        nome: 'Miguel Santos',
        email: 'miguel@sernic.gov.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[2]._id,
        perfil: PerfilUsuario.COORDENADOR_LOCAL,
        ativo: true
      },
      // Investigador SERNIC
      {
        nome: 'Isabel Fernandes',
        email: 'isabel@sernic.gov.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[2]._id,
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      },
      // Investigador PRM
      {
        nome: 'Pedro Alves',
        email: 'pedro@prm.gov.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[3]._id,
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      },
      // Investigador PGR
      {
        nome: 'Rita Oliveira',
        email: 'rita@pgr.gov.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[4]._id,
        perfil: PerfilUsuario.INVESTIGADOR,
        ativo: true
      }
    ]);

    console.log('Usuários criados:', usuarios.length);
    console.log('\n=== CREDENCIAIS DE TESTE ===');
    console.log('Senha padrão para todos: 123456');
    console.log('\n--- COORDENADOR ASSOCIAÇÃO ---');
    console.log('Email: maria@humai.org.mz');
    console.log('Instituição: Associação Coordenadora HUMAI');
    console.log('\n--- AGENTE COMUNITÁRIO ---');
    console.log('Email: joao@protecaomulher.org.mz');
    console.log('Instituição: ONG Proteção da Mulher');
    console.log('\n--- OPERADOR ---');
    console.log('Email: ana@protecaomulher.org.mz');
    console.log('Instituição: ONG Proteção da Mulher');
    console.log('\n--- ANALISTA ---');
    console.log('Email: carlos@protecaomulher.org.mz');
    console.log('Instituição: ONG Proteção da Mulher');
    console.log('\n--- SUPERVISOR ---');
    console.log('Email: sofia@protecaomulher.org.mz');
    console.log('Instituição: ONG Proteção da Mulher');
    console.log('\n--- COORDENADOR LOCAL SERNIC ---');
    console.log('Email: miguel@sernic.gov.mz');
    console.log('Instituição: SERNIC');
    console.log('\n--- INVESTIGADOR SERNIC ---');
    console.log('Email: isabel@sernic.gov.mz');
    console.log('Instituição: SERNIC');
    console.log('\n--- INVESTIGADOR PRM ---');
    console.log('Email: pedro@prm.gov.mz');
    console.log('Instituição: PRM');
    console.log('\n--- INVESTIGADOR PGR ---');
    console.log('Email: rita@pgr.gov.mz');
    console.log('Instituição: PGR');

  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  }
}

seedUsers();

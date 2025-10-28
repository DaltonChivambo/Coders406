import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Instituicao from '../models/Instituicao';
import Usuario from '../models/Usuario';
import { TipoInstituicao, PerfilUsuario } from '../types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humai';

async function seedUsersSafe() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Buscar instituições existentes
    const instituicoes = await Instituicao.find({});
    console.log('Instituições encontradas:', instituicoes.length);

    const senhaPadrao = await bcrypt.hash('123456', 10);

    // Lista de usuários para criar
    const usuariosParaCriar = [
      {
        nome: 'Maria Santos',
        email: 'maria@humai.org.mz',
        instituicao: 'ACH',
        perfil: PerfilUsuario.COORDENADOR_ASSOCIACAO
      },
      {
        nome: 'João Silva',
        email: 'joao@protecaomulher.org.mz',
        instituicao: 'PM',
        perfil: PerfilUsuario.AGENTE_COMUNITARIO
      },
      {
        nome: 'Ana Costa',
        email: 'ana@protecaomulher.org.mz',
        instituicao: 'PM',
        perfil: PerfilUsuario.OPERADOR
      },
      {
        nome: 'Carlos Mendes',
        email: 'carlos@protecaomulher.org.mz',
        instituicao: 'PM',
        perfil: PerfilUsuario.ANALISTA
      },
      {
        nome: 'Sofia Pereira',
        email: 'sofia@protecaomulher.org.mz',
        instituicao: 'PM',
        perfil: PerfilUsuario.SUPERVISOR
      },
      {
        nome: 'Miguel Santos',
        email: 'miguel@sernic.gov.mz',
        instituicao: 'SERNIC',
        perfil: PerfilUsuario.COORDENADOR_LOCAL
      },
      {
        nome: 'Isabel Fernandes',
        email: 'isabel@sernic.gov.mz',
        instituicao: 'SERNIC',
        perfil: PerfilUsuario.INVESTIGADOR
      },
      {
        nome: 'Pedro Alves',
        email: 'pedro@prm.gov.mz',
        instituicao: 'PRM',
        perfil: PerfilUsuario.INVESTIGADOR
      },
      {
        nome: 'Rita Oliveira',
        email: 'rita@pgr.gov.mz',
        instituicao: 'PGR',
        perfil: PerfilUsuario.INVESTIGADOR
      }
    ];

    let usuariosCriados = 0;
    let usuariosExistentes = 0;

    for (const userData of usuariosParaCriar) {
      // Verificar se usuário já existe
      const usuarioExistente = await Usuario.findOne({ email: userData.email });
      
      if (usuarioExistente) {
        console.log(`Usuário ${userData.email} já existe`);
        usuariosExistentes++;
        continue;
      }

      // Encontrar instituição pela sigla
      const instituicao = instituicoes.find(inst => inst.sigla === userData.instituicao);
      
      if (!instituicao) {
        console.log(`Instituição ${userData.instituicao} não encontrada`);
        continue;
      }

      // Criar usuário
      const usuario = new Usuario({
        nome: userData.nome,
        email: userData.email,
        senha: senhaPadrao,
        instituicaoId: instituicao._id,
        perfil: userData.perfil,
        ativo: true
      });

      await usuario.save();
      console.log(`Usuário ${userData.email} criado com sucesso`);
      usuariosCriados++;
    }

    console.log(`\n=== RESUMO ===`);
    console.log(`Usuários criados: ${usuariosCriados}`);
    console.log(`Usuários já existentes: ${usuariosExistentes}`);

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

seedUsersSafe();


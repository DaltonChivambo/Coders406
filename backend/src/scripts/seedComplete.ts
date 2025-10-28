import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Instituicao from '../models/Instituicao';
import Usuario from '../models/Usuario';
import { TipoInstituicao, PerfilUsuario } from '../types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humai';

async function seedComplete() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes
    await Usuario.deleteMany({});
    await Instituicao.deleteMany({});
    console.log('Dados existentes removidos');

    // Criar instituições
    const instituicoes = await Instituicao.insertMany([
      {
        nome: 'Associação Coordenadora HUMAI',
        tipo: TipoInstituicao.COORDENADORA,
        sigla: 'ACH',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 123 456',
          email: 'contato@humai.org.mz'
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
          telefone: '+258 21 234 567',
          email: 'contato@protecaomulher.org.mz'
        },
        ativa: true
      },
      {
        nome: 'Serviço Nacional de Investigação Criminal',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'SERNIC',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 345 678',
          email: 'contato@sernic.gov.mz'
        },
        ativa: true
      },
      {
        nome: 'Polícia da República de Moçambique',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'PRM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 456 789',
          email: 'contato@prm.gov.mz'
        },
        ativa: true
      },
      {
        nome: 'Procuradoria-Geral da República',
        tipo: TipoInstituicao.INVESTIGATIVA,
        sigla: 'PGR',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 567 890',
          email: 'contato@pgr.gov.mz'
        },
        ativa: true
      },
      // Novas instituições
      {
        nome: 'Escola Secundária Josina Machel',
        tipo: TipoInstituicao.ESCOLA,
        sigla: 'ESJM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 678 901',
          email: 'contato@esjm.edu.mz'
        },
        ativa: true
      },
      {
        nome: 'Hospital Central de Maputo',
        tipo: TipoInstituicao.HOSPITAL,
        sigla: 'HCM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 789 012',
          email: 'contato@hcm.saude.mz'
        },
        ativa: true
      },
      {
        nome: 'Igreja Católica de Maputo',
        tipo: TipoInstituicao.IGREJA,
        sigla: 'ICM',
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258 21 890 123',
          email: 'contato@igreja.maputo.mz'
        },
        ativa: true
      },
      {
        nome: 'Escola Primária 25 de Setembro',
        tipo: TipoInstituicao.ESCOLA,
        sigla: 'EPS25',
        provincia: 'Sofala',
        distrito: 'Beira',
        contacto: {
          telefone: '+258 23 123 456',
          email: 'contato@eps25.edu.mz'
        },
        ativa: true
      },
      {
        nome: 'Hospital Provincial de Nampula',
        tipo: TipoInstituicao.HOSPITAL,
        sigla: 'HPN',
        provincia: 'Nampula',
        distrito: 'Nampula Cidade',
        contacto: {
          telefone: '+258 26 123 456',
          email: 'contato@hpn.saude.mz'
        },
        ativa: true
      }
    ]);

    console.log('Instituições criadas:', instituicoes.length);

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
      },
      // Usuários das novas instituições
      // Escola Secundária Josina Machel
      {
        nome: 'Carlos Mendes',
        email: 'carlos@esjm.edu.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[5]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
        ativo: true
      },
      // Hospital Central de Maputo
      {
        nome: 'Dr. Ana Silva',
        email: 'ana@hcm.saude.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[6]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
        ativo: true
      },
      // Igreja Católica de Maputo
      {
        nome: 'Padre João Baptista',
        email: 'joao@igreja.maputo.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[7]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
        ativo: true
      },
      // Escola Primária 25 de Setembro
      {
        nome: 'Professora Maria José',
        email: 'maria@eps25.edu.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[8]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
        ativo: true
      },
      // Hospital Provincial de Nampula
      {
        nome: 'Dr. Pedro Nampula',
        email: 'pedro@hpn.saude.mz',
        senha: senhaPadrao,
        instituicaoId: instituicoes[9]._id,
        perfil: PerfilUsuario.AGENTE_COMUNITARIO,
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
    console.log('\n--- NOVAS INSTITUIÇÕES ---');
    console.log('\n--- ESCOLA SECUNDÁRIA JOSINA MACHEL ---');
    console.log('Email: carlos@esjm.edu.mz');
    console.log('Instituição: Escola Secundária Josina Machel');
    console.log('\n--- HOSPITAL CENTRAL DE MAPUTO ---');
    console.log('Email: ana@hcm.saude.mz');
    console.log('Instituição: Hospital Central de Maputo');
    console.log('\n--- IGREJA CATÓLICA DE MAPUTO ---');
    console.log('Email: joao@igreja.maputo.mz');
    console.log('Instituição: Igreja Católica de Maputo');
    console.log('\n--- ESCOLA PRIMÁRIA 25 DE SETEMBRO ---');
    console.log('Email: maria@eps25.edu.mz');
    console.log('Instituição: Escola Primária 25 de Setembro');
    console.log('\n--- HOSPITAL PROVINCIAL DE NAMPULA ---');
    console.log('Email: pedro@hpn.saude.mz');
    console.log('Instituição: Hospital Provincial de Nampula');

  } catch (error) {
    console.error('Erro ao criar dados:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  }
}

seedComplete();


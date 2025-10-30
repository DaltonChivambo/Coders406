import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Instituicao from '../models/Instituicao';
import Usuario from '../models/Usuario';
import Denuncia from '../models/Denuncia';
import { TipoInstituicao, PerfilUsuario, StatusDenuncia } from '../types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humai';

async function seedRefatorado() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Conectado ao MongoDB');

    // Limpar banco de dados
    console.log('🧹 Limpando banco de dados...');
    await Usuario.deleteMany({});
    await Instituicao.deleteMany({});
    await Denuncia.deleteMany({});
    console.log('✅ Banco de dados limpo');

    const senhaPadrao = await bcrypt.hash('123456', 10);

    // Criar instituições
    console.log('🏢 Criando instituições...');
    
    const instituicoes = [
      {
        nome: 'Associação Coordenadora HUMAI',
        sigla: 'ACH',
        tipo: TipoInstituicao.GESTORA,
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258841234567',
          email: 'contato@humai.org.mz'
        },
        codigoAcesso: 'HUMAI1'
      },
      {
        nome: 'ONG Proteção da Mulher',
        sigla: 'PM',
        tipo: TipoInstituicao.RECEPTORA,
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258841234568',
          email: 'contato@protecaomulher.org.mz'
        },
        codigoAcesso: 'ONG001'
      },
      {
        nome: 'Procuradoria-Geral da República',
        sigla: 'PGR',
        tipo: TipoInstituicao.AUTORIDADE,
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        contacto: {
          telefone: '+258841234569',
          email: 'contato@pgr.gov.mz'
        },
        codigoAcesso: 'PGR001'
      },
      {
        nome: 'Escola Secundária Josina Machel',
        sigla: 'ESJM',
        tipo: TipoInstituicao.ESCOLA,
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        bairro: 'Mafalala',
        contacto: {
          telefone: '+258841234570',
          email: 'contato@esjm.edu.mz'
        },
        codigoAcesso: 'ESC001'
      },
      {
        nome: 'Escola Primária 25 de Setembro',
        sigla: 'EPS25',
        tipo: TipoInstituicao.ESCOLA,
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        bairro: 'Alto Maé',
        contacto: {
          telefone: '+258841234571',
          email: 'contato@eps25.edu.mz'
        },
        codigoAcesso: 'ESC002'
      }
    ];

    const instituicoesCriadas = [];
    for (const instData of instituicoes) {
      const instituicao = new Instituicao(instData);
      await instituicao.save();
      instituicoesCriadas.push(instituicao);
      console.log(`✅ Instituição criada: ${instituicao.nome} (${instituicao.codigoAcesso})`);
    }

    // Criar usuários
    console.log('👥 Criando usuários...');
    
    const usuarios = [
      {
        nome: 'Maria Santos',
        email: 'maria@humai.org.mz',
        instituicao: 'ACH',
        perfil: PerfilUsuario.GESTOR_SISTEMA
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
        nome: 'Rita Oliveira',
        email: 'rita@pgr.gov.mz',
        instituicao: 'PGR',
        perfil: PerfilUsuario.AUTORIDADE
      },
      {
        nome: 'João Silva',
        email: 'joao@esjm.edu.mz',
        instituicao: 'ESJM',
        perfil: PerfilUsuario.OPERADOR
      },
      {
        nome: 'Sofia Pereira',
        email: 'sofia@eps25.edu.mz',
        instituicao: 'EPS25',
        perfil: PerfilUsuario.OPERADOR
      }
    ];

    const usuariosCriados = [];
    for (const userData of usuarios) {
      const instituicao = instituicoesCriadas.find(inst => inst.sigla === userData.instituicao);
      if (!instituicao) {
        console.log(`❌ Instituição ${userData.instituicao} não encontrada`);
        continue;
      }

      const usuario = new Usuario({
        nome: userData.nome,
        email: userData.email,
        senha: senhaPadrao,
        instituicaoId: instituicao._id,
        perfil: userData.perfil,
        ativo: true
      });

      await usuario.save();
      usuariosCriados.push(usuario);
      console.log(`✅ Usuário criado: ${userData.nome} (${userData.perfil})`);
    }

    // Criar denúncias de exemplo
    console.log('📋 Criando denúncias de exemplo...');
    
    const maria = usuariosCriados.find(u => u.email === 'maria@humai.org.mz');
    const ong = instituicoesCriadas.find(i => i.sigla === 'PM');
    const escola = instituicoesCriadas.find(i => i.sigla === 'ESJM');
    const pgr = instituicoesCriadas.find(i => i.sigla === 'PGR');

    if (maria && ong && escola && pgr) {
      const denunciasExemplo = [
        {
          codigoRastreio: 'HUMAI-ONG001-ABC',
          tipoDenuncia: 'INSTITUCIONAL_PRIVADA',
          canalDenuncia: 'WEB',
          instituicaoOrigemId: ong._id,
          usuarioCriadorId: maria._id,
          tipoTrafico: ['SEXUAL'],
          nivelRisco: 'ALTO',
          status: StatusDenuncia.AGUARDANDO_TRIAGEM,
          localizacao: {
            provincia: 'Maputo',
            distrito: 'Maputo Cidade',
            bairro: 'Mafalala',
            localEspecifico: 'Rua da Resistência, 123'
          },
          descricao: 'Denúncia da ONG: Caso de tráfico sexual envolvendo menores de idade.',
          vitimas: [{
            genero: 'FEMININO',
            faixaEtaria: 'ADOLESCENTE',
            nacionalidade: 'Moçambicana',
            vulnerabilidade: ['MENOR', 'ESTUDANTE']
          }],
          suspeitos: [{
            sexo: 'Masculino',
            relacaoVitima: 'DESCONHECIDO',
            descricaoFisica: 'Homem de meia-idade, altura média'
          }],
          contatos: {
            telefoneDenunciante: '+258841111111',
            outrosContatos: 'Caso reportado pela ONG Proteção da Mulher'
          },
          denunciante: {
            nome: 'Ana Costa',
            telefone: '+258841111111',
            localizacao: 'Maputo, Moçambique',
            anonimo: false
          },
          observacoesInternas: [],
          prioridade: 'ALTA',
          visibilidade: 'INSTITUICAO_ORIGEM',
          instituicoesComAcesso: [ong._id]
        },
        {
          codigoRastreio: 'HUMAI-ESC001-DEF',
          tipoDenuncia: 'INSTITUCIONAL_PRIVADA',
          canalDenuncia: 'WEB',
          instituicaoOrigemId: escola._id,
          usuarioCriadorId: maria._id,
          tipoTrafico: ['LABORAL'],
          nivelRisco: 'MEDIO',
          status: StatusDenuncia.SUBMETIDO_AUTORIDADE,
          localizacao: {
            provincia: 'Maputo',
            distrito: 'Maputo Cidade',
            bairro: 'Mafalala',
            localEspecifico: 'Escola Secundária Josina Machel'
          },
          descricao: 'Denúncia da Escola: Aluno relatou ser forçado a trabalhar em casa de família.',
          vitimas: [{
            genero: 'MASCULINO',
            faixaEtaria: 'ADOLESCENTE',
            nacionalidade: 'Moçambicana',
            vulnerabilidade: ['MENOR', 'ESTUDANTE']
          }],
          suspeitos: [{
            sexo: 'Feminino',
            relacaoVitima: 'EMPREGADOR',
            descricaoFisica: 'Mulher de meia-idade, proprietária da casa'
          }],
          contatos: {
            telefoneDenunciante: '+258842222222',
            outrosContatos: 'Caso reportado pela Escola Secundária Josina Machel'
          },
          denunciante: {
            nome: 'João Silva',
            telefone: '+258842222222',
            localizacao: 'Maputo, Moçambique',
            anonimo: false
          },
          observacoesInternas: [],
          prioridade: 'MEDIA',
          visibilidade: 'INSTITUICAO_ORIGEM',
          instituicoesComAcesso: [escola._id, pgr._id]
        }
      ];

      for (const denunciaData of denunciasExemplo) {
        const denuncia = new Denuncia(denunciaData);
        await denuncia.save();
        console.log(`✅ Denúncia criada: ${denuncia.codigoRastreio}`);
      }
    }

    console.log('\n🎉 Seed refatorado concluído com sucesso!');
    console.log('\n📊 RESUMO:');
    console.log(`- Instituições: ${instituicoesCriadas.length}`);
    console.log(`- Usuários: ${usuariosCriados.length}`);
    console.log(`- Denúncias: 2`);
    
    console.log('\n🔑 CREDENCIAIS DE TESTE:');
    console.log('Senha padrão para todos: 123456');
    console.log('\n--- GESTOR SISTEMA (HUMAI) ---');
    console.log('Email: maria@humai.org.mz');
    console.log('Código Instituição: HUMAI1');
    console.log('\n--- OPERADOR (ONG) ---');
    console.log('Email: ana@protecaomulher.org.mz');
    console.log('Código Instituição: ONG001');
    console.log('\n--- ANALISTA (ONG) ---');
    console.log('Email: carlos@protecaomulher.org.mz');
    console.log('Código Instituição: ONG001');
    console.log('\n--- AUTORIDADE (PGR) ---');
    console.log('Email: rita@pgr.gov.mz');
    console.log('Código Instituição: PGR001');
    console.log('\n--- OPERADOR (ESCOLA) ---');
    console.log('Email: joao@esjm.edu.mz');
    console.log('Código Instituição: ESC001');
    console.log('Email: sofia@eps25.edu.mz');
    console.log('Código Instituição: ESC002');

  } catch (error) {
    console.error('❌ Erro no seed refatorado:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

seedRefatorado();

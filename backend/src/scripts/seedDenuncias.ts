import mongoose from 'mongoose';
import { Denuncia, Instituicao, Usuario } from '../models';
import { 
  TipoDenuncia, 
  CanalDenuncia, 
  TipoTrafico, 
  Genero, 
  FaixaEtaria, 
  Vulnerabilidade, 
  RelacaoVitima,
  StatusDenuncia,
  NivelRisco,
  Prioridade
} from '../types';

const getDenunciasHipoteticas = (usuarioId: any) => [
  {
    tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
    canalDenuncia: CanalDenuncia.WEB,
    tipoTrafico: [TipoTrafico.SEXUAL],
    localizacao: {
      provincia: 'Maputo',
      distrito: 'Maputo Cidade',
      bairro: 'Sommerschield',
      localEspecifico: 'Rua da Liberdade, 123, Apartamento 4B'
    },
    descricao: 'Denúncia de tráfico sexual envolvendo jovens moçambicanas sendo recrutadas para trabalho sexual em casas noturnas. As vítimas são abordadas com promessas de emprego como garçonetes e depois forçadas à prostituição.',
    vitimas: [
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADOLESCENTE,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.MENOR, Vulnerabilidade.DESEMPREGADO]
      },
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      }
    ],
    suspeitos: [
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Homem de meia-idade, altura média, cabelo grisalho, sempre bem vestido'
      },
      {
        sexo: 'Feminino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Mulher jovem, alta, cabelo preto, trabalha como "gerente" do local'
      }
    ],
    contatos: {
      telefoneDenunciante: '+258841234567',
      telefoneSuspeito: '+258849876543',
      telefoneVitima: '+258841111111',
      outrosContatos: 'Local suspeito: Bar "Noite Dourada" na Avenida Julius Nyerere'
    },
    denunciante: {
      nome: 'Maria dos Santos',
      telefone: '+258841234567',
      localizacao: 'Maputo, Moçambique',
      anonimo: false
    },
    status: StatusDenuncia.SUSPEITA,
    nivelRisco: NivelRisco.ALTO,
    prioridade: Prioridade.ALTA,
    observacoesInternas: [{
      usuarioId: usuarioId,
      texto: 'Caso prioritário - vítimas menores de idade envolvidas. Investigação urgente necessária.',
      data: new Date(),
      tipo: 'NOTA'
    }]
  },
  {
    tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
    canalDenuncia: CanalDenuncia.TELEFONE,
    tipoTrafico: [TipoTrafico.LABORAL],
    localizacao: {
      provincia: 'Nampula',
      distrito: 'Nampula Cidade',
      bairro: 'Muthita',
      localEspecifico: 'Fazenda de algodão "Verde Esperança", Km 15 da EN1'
    },
    descricao: 'Trabalho forçado em fazenda de algodão. Trabalhadores são mantidos em condições análogas à escravidão, com jornadas de 16 horas, sem pagamento adequado e sob ameaças constantes.',
    vitimas: [
      {
        genero: Genero.MASCULINO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      },
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      }
    ],
    suspeitos: [
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.EMPREGADOR,
        descricaoFisica: 'Homem alto, corpulento, cabelo grisalho, sempre com chapéu de fazendeiro'
      }
    ],
    contatos: {
      telefoneDenunciante: '+258849876543',
      telefoneSuspeito: '+258841111222',
      outrosContatos: 'Fazenda tem cerca de 50 trabalhadores. Alguns relatam não poder sair do local há meses.'
    },
    denunciante: {
      nome: 'João António',
      telefone: '+258849876543',
      localizacao: 'Nampula, Moçambique',
      anonimo: false
    },
    status: StatusDenuncia.PROVAVEL,
    nivelRisco: NivelRisco.CRITICO,
    prioridade: Prioridade.ALTA,
    observacoesInternas: [{
      usuarioId: usuarioId,
      texto: 'Caso crítico - múltiplas vítimas em situação de escravidão. Ação imediata necessária.',
      data: new Date(),
      tipo: 'NOTA'
    }]
  },
  {
    tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
    canalDenuncia: CanalDenuncia.WHATSAPP,
    tipoTrafico: [TipoTrafico.ADOCAO_ILEGAL],
    localizacao: {
      provincia: 'Sofala',
      distrito: 'Beira',
      bairro: 'Matacuane',
      localEspecifico: 'Casa de acolhimento "Lar das Crianças", Rua da Esperança, 456'
    },
    descricao: 'Suspeita de adoção ilegal de crianças órfãs. Crianças são retiradas do país sem documentação adequada, alegando adoção internacional, mas evidências sugerem tráfico.',
    vitimas: [
      {
        genero: Genero.MASCULINO,
        faixaEtaria: FaixaEtaria.CRIANCA,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.MENOR, Vulnerabilidade.MENOR]
      },
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.CRIANCA,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.MENOR, Vulnerabilidade.MENOR]
      }
    ],
    suspeitos: [
      {
        sexo: 'Feminino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Mulher estrangeira, loira, altura média, sempre bem vestida, fala português com sotaque'
      },
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Homem estrangeiro, alto, cabelo escuro, sempre com documentos e pastas'
      }
    ],
    contatos: {
      telefoneDenunciante: '+258841111333',
      telefoneSuspeito: '+258842222444',
      outrosContatos: 'Casa de acolhimento suspeita de irregularidades. Crianças desaparecem sem explicação.'
    },
    denunciante: {
      nome: 'Ana Maria',
      telefone: '+258841111333',
      localizacao: 'Beira, Moçambique',
      anonimo: false
    },
    status: StatusDenuncia.SUSPEITA,
    nivelRisco: NivelRisco.ALTO,
    prioridade: Prioridade.ALTA,
    observacoesInternas: [{
      usuarioId: usuarioId,
      texto: 'Caso sensível - crianças envolvidas. Investigação discreta necessária para não alertar suspeitos.',
      data: new Date(),
      tipo: 'NOTA'
    }]
  },
  {
    tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
    canalDenuncia: CanalDenuncia.PRESENCIAL,
    tipoTrafico: [TipoTrafico.MIGRACAO_FORCADA],
    localizacao: {
      provincia: 'Tete',
      distrito: 'Tete Cidade',
      bairro: 'Matundo',
      localEspecifico: 'Ponto de passagem clandestino na fronteira com Zimbábue, próximo ao Rio Zambeze'
    },
    descricao: 'Rede de tráfico de pessoas para trabalho forçado na África do Sul. Vítimas são transportadas clandestinamente através da fronteira com promessas de emprego, mas acabam em situação de escravidão.',
    vitimas: [
      {
        genero: Genero.MASCULINO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      },
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      }
    ],
    suspeitos: [
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Homem jovem, altura média, cabelo preto, sempre com dinheiro e documentos falsos'
      },
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.RECRUTADOR,
        descricaoFisica: 'Homem de meia-idade, alto, cabelo grisalho, conhecido como "coordenador" da operação'
      }
    ],
    contatos: {
      telefoneDenunciante: '+258842222555',
      telefoneSuspeito: '+258843333666',
      outrosContatos: 'Rede opera há pelo menos 6 meses. Já transportaram dezenas de pessoas.'
    },
    denunciante: {
      nome: 'Carlos Manuel',
      telefone: '+258842222555',
      localizacao: 'Tete, Moçambique',
      anonimo: false
    },
    status: StatusDenuncia.EM_INVESTIGACAO_INTERNA,
    nivelRisco: NivelRisco.ALTO,
    prioridade: Prioridade.ALTA,
    observacoesInternas: [{
      usuarioId: usuarioId,
      texto: 'Rede organizada de tráfico. Coordenação com autoridades sul-africanas necessária.',
      data: new Date(),
      tipo: 'NOTA'
    }]
  },
  {
    tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
    canalDenuncia: CanalDenuncia.APP,
    tipoTrafico: [TipoTrafico.SEXUAL, TipoTrafico.LABORAL],
    localizacao: {
      provincia: 'Gaza',
      distrito: 'Xai-Xai',
      bairro: 'Praia do Bilene',
      localEspecifico: 'Resort "Paraíso Tropical", Km 8 da estrada para Bilene'
    },
    descricao: 'Exploração sexual e laboral em resort turístico. Funcionárias são forçadas à prostituição com turistas estrangeiros, além de trabalharem em condições degradantes no hotel.',
    vitimas: [
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADOLESCENTE,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.MENOR, Vulnerabilidade.DESEMPREGADO]
      },
      {
        genero: Genero.FEMININO,
        faixaEtaria: FaixaEtaria.ADULTO,
        nacionalidade: 'Moçambicana',
        vulnerabilidade: [Vulnerabilidade.DESEMPREGADO, Vulnerabilidade.MIGRANTE]
      }
    ],
    suspeitos: [
      {
        sexo: 'Masculino',
        relacaoVitima: RelacaoVitima.EMPREGADOR,
        descricaoFisica: 'Homem estrangeiro, alto, cabelo loiro, proprietário do resort'
      },
      {
        sexo: 'Feminino',
        relacaoVitima: RelacaoVitima.EMPREGADOR,
        descricaoFisica: 'Mulher estrangeira, altura média, cabelo escuro, "gerente" do resort'
      }
    ],
    contatos: {
      telefoneDenunciante: '+258843333777',
      telefoneSuspeito: '+258844444888',
      outrosContatos: 'Resort tem cerca de 20 funcionárias. Muitas são de famílias pobres da região.'
    },
    denunciante: {
      nome: 'Isabel Fernando',
      telefone: '+258843333777',
      localizacao: 'Xai-Xai, Moçambique',
      anonimo: false
    },
    status: StatusDenuncia.PROVAVEL,
    nivelRisco: NivelRisco.CRITICO,
    prioridade: Prioridade.ALTA,
    observacoesInternas: [{
      usuarioId: usuarioId,
      texto: 'Caso crítico - turismo sexual com menores. Coordenação com autoridades de turismo necessária.',
      data: new Date(),
      tipo: 'NOTA'
    }]
  }
];

async function seedDenuncias() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/humai');
    console.log('✅ Conectado ao MongoDB');

    // Buscar instituição coordenadora
    const instituicao = await Instituicao.findOne({ tipo: 'COORDENADORA' });
    if (!instituicao) {
      console.error('❌ Instituição coordenadora não encontrada');
      return;
    }

    // Buscar usuário para associar às denúncias
    const usuario = await Usuario.findOne({ email: 'maria@humai.org.mz' });
    if (!usuario) {
      console.error('❌ Usuário não encontrado');
      return;
    }

    // Limpar denúncias existentes (opcional)
    await Denuncia.deleteMany({});
    console.log('🗑️ Denúncias existentes removidas');

    // Criar denúncias
    const denunciasHipoteticas = getDenunciasHipoteticas(usuario._id);
    const denunciasCriadas = [];
    for (const denunciaData of denunciasHipoteticas) {
      const denuncia = new Denuncia({
        ...denunciaData,
        instituicaoOrigemId: instituicao._id,
        usuarioCriadorId: usuario._id,
        instituicoesComAcesso: [instituicao._id],
        dataRegistro: new Date(),
        dataUltimaAtualizacao: new Date(),
        codigoRastreio: `HUMAI-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
      });

      const denunciaSalva = await denuncia.save();
      denunciasCriadas.push(denunciaSalva);
      console.log(`✅ Denúncia criada: ${denunciaSalva.codigoRastreio}`);
    }

    console.log(`\n🎉 ${denunciasCriadas.length} denúncias hipotéticas criadas com sucesso!`);
    console.log('\n📋 Resumo das denúncias:');
    denunciasCriadas.forEach((denuncia, index) => {
      console.log(`${index + 1}. ${denuncia.codigoRastreio} - ${denuncia.tipoTrafico.join(', ')} - ${denuncia.localizacao.provincia}`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar denúncias:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDenuncias();
}

export default seedDenuncias;

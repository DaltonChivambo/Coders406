import mongoose, { Schema } from 'mongoose';
import { 
  IDenuncia, 
  TipoDenuncia, 
  CanalDenuncia, 
  TipoTrafico, 
  NivelRisco, 
  StatusDenuncia,
  Genero,
  FaixaEtaria,
  Vulnerabilidade,
  RelacaoVitima,
  TipoEvidencia,
  TipoObservacao,
  Prioridade,
  Visibilidade,
  NivelVisibilidadeRelatorio
} from '../types';

// Sub-schemas
const VitimaSchema = new Schema({
  nome: {
    type: String,
    trim: true,
    maxlength: 200
  },
  genero: {
    type: String,
    enum: Object.values(Genero),
    required: true
  },
  idade: {
    type: Number,
    min: 0,
    max: 120
  },
  faixaEtaria: {
    type: String,
    enum: Object.values(FaixaEtaria),
    required: true
  },
  nacionalidade: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  vulnerabilidade: [{
    type: String,
    enum: Object.values(Vulnerabilidade)
  }]
}, { _id: false });

const SuspeitoSchema = new Schema({
  identificacao: {
    type: String,
    trim: true,
    maxlength: 200
  },
  sexo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  idadeAproximada: {
    type: Number,
    min: 0,
    max: 120
  },
  relacaoVitima: {
    type: String,
    enum: Object.values(RelacaoVitima),
    required: true
  },
  descricaoFisica: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { _id: false });

const EvidenciaSchema = new Schema({
  tipo: {
    type: String,
    enum: Object.values(TipoEvidencia),
    required: true
  },
  nomeArquivo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  caminhoArquivo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  url: {
    type: String,
    trim: true,
    maxlength: 500
  },
  dataUpload: {
    type: Date,
    default: Date.now
  },
  uploadPorId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, { _id: false });

const ContatosSchema = new Schema({
  telefoneDenunciante: {
    type: String,
    trim: true,
    maxlength: 20
  },
  telefoneSuspeito: {
    type: String,
    trim: true,
    maxlength: 20
  },
  telefoneVitima: {
    type: String,
    trim: true,
    maxlength: 20
  },
  urls: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  outrosContatos: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { _id: false });

const DenuncianteSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  telefone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  localizacao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  anonimo: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const LocalizacaoSchema = new Schema({
  provincia: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  distrito: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bairro: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  localEspecifico: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  coordenadas: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  }
}, { _id: false });

const ObservacaoInternaSchema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  texto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  data: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: Object.values(TipoObservacao),
    required: true
  }
}, { _id: false });

const RelatorioFinalSchema = new Schema({
  resultado: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  autoridadesEnvolvidas: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  evidenciasEncontradas: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  vitimasResgatadas: {
    type: Number,
    required: true,
    min: 0
  },
  acoesLegais: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  dificuldades: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  recomendacoes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  licoesAprendidas: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  nivelVisibilidade: {
    type: String,
    enum: Object.values(NivelVisibilidadeRelatorio),
    required: true
  }
}, { _id: false });

const DenunciaSchema = new Schema<IDenuncia>({
  codigoRastreio: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  
  // Origem
  tipoDenuncia: {
    type: String,
    enum: Object.values(TipoDenuncia),
    required: true
  },
  canalDenuncia: {
    type: String,
    enum: Object.values(CanalDenuncia),
    required: true
  },
  instituicaoOrigemId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: true
  },
  usuarioCriadorId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  
  // Classificação
  tipoTrafico: [{
    type: String,
    enum: Object.values(TipoTrafico),
    required: true
  }],
  nivelRisco: {
    type: String,
    enum: Object.values(NivelRisco),
    required: true
  },
  
  // Status e Fluxo
  status: {
    type: String,
    enum: Object.values(StatusDenuncia),
    required: true,
    default: StatusDenuncia.INCOMPLETA
  },
  
  // Localização
  localizacao: {
    type: LocalizacaoSchema,
    required: true
  },
  
  // Descrição
  descricao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  contextoAdicional: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Vítima(s)
  vitimas: [VitimaSchema],
  
  // Suspeito(s)
  suspeitos: [SuspeitoSchema],
  
  // Evidências
  evidencias: [EvidenciaSchema],
  
  // Contatos
  contatos: {
    type: ContatosSchema,
    required: true
  },
  
  // Denunciante (se não anônimo)
  denunciante: DenuncianteSchema,
  
  // Análise e Triagem
  analistaResponsavelId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  tempoAnalise: {
    type: Number,
    min: 0
  },
  observacoesInternas: [ObservacaoInternaSchema],
  
  // Encaminhamento
  encaminhadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  dataEncaminhamento: {
    type: Date
  },
  instituicaoDestinoId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao'
  },
  
  // Investigação
  investigadorResponsavelId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  equipaInvestigacao: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  prioridade: {
    type: String,
    enum: Object.values(Prioridade),
    default: Prioridade.MEDIA
  },
  
  // Visibilidade
  visibilidade: {
    type: String,
    enum: Object.values(Visibilidade),
    required: true,
    default: Visibilidade.INSTITUICAO_ORIGEM
  },
  instituicoesComAcesso: [{
    type: Schema.Types.ObjectId,
    ref: 'Instituicao'
  }],
  
  // Relatório Final (quando encerrado)
  relatorioFinal: RelatorioFinalSchema,
  
  // Timestamps e Auditoria
  dataRegistro: {
    type: Date,
    default: Date.now
  },
  dataUltimaAtualizacao: {
    type: Date,
    default: Date.now
  },
  dataIncidente: {
    type: Date
  },
  tempoResolucao: {
    type: Number,
    min: 0
  }
}, {
  timestamps: false, // Usando timestamps customizados
  versionKey: false
});

// Índices
DenunciaSchema.index({ codigoRastreio: 1 });
DenunciaSchema.index({ instituicaoOrigemId: 1 });
DenunciaSchema.index({ usuarioCriadorId: 1 });
DenunciaSchema.index({ status: 1 });
DenunciaSchema.index({ tipoTrafico: 1 });
DenunciaSchema.index({ nivelRisco: 1 });
DenunciaSchema.index({ 'localizacao.provincia': 1, 'localizacao.distrito': 1 });
DenunciaSchema.index({ dataRegistro: -1 });
DenunciaSchema.index({ dataUltimaAtualizacao: -1 });
DenunciaSchema.index({ analistaResponsavelId: 1 });
DenunciaSchema.index({ investigadorResponsavelId: 1 });
DenunciaSchema.index({ instituicaoDestinoId: 1 });
DenunciaSchema.index({ visibilidade: 1 });
DenunciaSchema.index({ instituicoesComAcesso: 1 });

// Middleware para atualizar dataUltimaAtualizacao
DenunciaSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.dataUltimaAtualizacao = new Date();
  }
  next();
});

// Middleware para gerar código de rastreio
DenunciaSchema.pre('save', function(next) {
  if (this.isNew && !this.codigoRastreio) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.codigoRastreio = `HUMAI-${timestamp}-${random}`;
  }
  next();
});

// Método para calcular tempo de resolução
DenunciaSchema.methods.calcularTempoResolucao = function() {
  if (this.status === StatusDenuncia.ENCERRADO_AUTORIDADE && this.dataRegistro) {
    const inicio = this.dataRegistro;
    const fim = this.dataUltimaAtualizacao || new Date();
    this.tempoResolucao = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  }
  return this.tempoResolucao;
};

export default mongoose.model<IDenuncia>('Denuncia', DenunciaSchema);

import { Document, Types } from 'mongoose';
import { Request } from 'express';

// Enums
export enum TipoInstituicao {
  GESTORA = 'GESTORA',      // HUMAI - gestão geral do sistema
  RECEPTORA = 'RECEPTORA',   // ONGs que recebem denúncias
  AUTORIDADE = 'AUTORIDADE', // PGR - atualiza status
  ESCOLA = 'ESCOLA'          // Escolas - fazem denúncias diretas
}

export enum PerfilUsuario {
  GESTOR_SISTEMA = 'GESTOR_SISTEMA',     // HUMAI - gestão geral
  OPERADOR = 'OPERADOR',                  // ONGs e Escolas
  ANALISTA = 'ANALISTA',                  // ONGs - especialista de tráfico
  AUTORIDADE = 'AUTORIDADE'               // PGR - atualiza status
}

export enum TipoDenuncia {
  PUBLICA = 'PUBLICA',
  INSTITUCIONAL_PRIVADA = 'INSTITUCIONAL_PRIVADA',
  INTERNA_INVESTIGACAO = 'INTERNA_INVESTIGACAO'
}

export enum CanalDenuncia {
  WEB = 'WEB',
  APP = 'APP',
  TELEFONE = 'TELEFONE',
  WHATSAPP = 'WHATSAPP',
  PRESENCIAL = 'PRESENCIAL'
}

export enum TipoTrafico {
  SEXUAL = 'SEXUAL',
  LABORAL = 'LABORAL',
  ADOCAO_ILEGAL = 'ADOCAO_ILEGAL',
  ORGAOS = 'ORGAOS',
  SERVIDAO = 'SERVIDAO',
  MIGRACAO_FORCADA = 'MIGRACAO_FORCADA'
}

export enum NivelRisco {
  CRITICO = 'CRITICO',
  ALTO = 'ALTO',
  MEDIO = 'MEDIO',
  BAIXO = 'BAIXO',
  MINIMO = 'MINIMO'
}

export enum StatusDenuncia {
  // Operador (ONG/Escola)
  AGUARDANDO_TRIAGEM = 'AGUARDANDO_TRIAGEM',
  
  // Analista (ONG)
  EM_ANALISE = 'EM_ANALISE',
  AGUARDANDO_INFORMACOES = 'AGUARDANDO_INFORMACOES',
  
  // Submissão
  SUBMETIDO_AUTORIDADE = 'SUBMETIDO_AUTORIDADE',
  
  // PGR (Autoridade)
  EM_INVESTIGACAO = 'EM_INVESTIGACAO',
  ARQUIVADO = 'ARQUIVADO',
  ENCAMINHADO_JUSTICA = 'ENCAMINHADO_JUSTICA',
  CASO_ENCERRADO = 'CASO_ENCERRADO'
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
  NAO_INFORMADO = 'NAO_INFORMADO'
}

export enum FaixaEtaria {
  CRIANCA = 'CRIANCA',
  ADOLESCENTE = 'ADOLESCENTE',
  ADULTO = 'ADULTO',
  IDOSO = 'IDOSO'
}

export enum Vulnerabilidade {
  DESEMPREGADO = 'DESEMPREGADO',
  ESTUDANTE = 'ESTUDANTE',
  MIGRANTE = 'MIGRANTE',
  MENOR = 'MENOR',
  DEFICIENTE = 'DEFICIENTE'
}

export enum RelacaoVitima {
  VIZINHO = 'VIZINHO',
  FAMILIAR = 'FAMILIAR',
  DESCONHECIDO = 'DESCONHECIDO',
  RECRUTADOR = 'RECRUTADOR',
  EMPREGADOR = 'EMPREGADOR'
}

export enum TipoEvidencia {
  IMAGEM = 'IMAGEM',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENTO = 'DOCUMENTO',
  URL = 'URL'
}

export enum TipoObservacao {
  NOTA = 'NOTA',
  SOLICITACAO = 'SOLICITACAO',
  REVISAO = 'REVISAO'
}

export enum Prioridade {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA'
}

export enum Visibilidade {
  PUBLICA = 'PUBLICA',
  INSTITUICAO_ORIGEM = 'INSTITUICAO_ORIGEM',
  INSTITUICAO_DESTINO = 'INSTITUICAO_DESTINO',
  TODAS_ENVOLVIDAS = 'TODAS_ENVOLVIDAS',
  APENAS_COORDENADORA = 'APENAS_COORDENADORA'
}

export enum TipoAcaoHistorico {
  CRIACAO = 'CRIACAO',
  MUDANCA_STATUS = 'MUDANCA_STATUS',
  ADICAO_EVIDENCIA = 'ADICAO_EVIDENCIA',
  COMENTARIO = 'COMENTARIO',
  ENCAMINHAMENTO = 'ENCAMINHAMENTO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  ATRIBUICAO = 'ATRIBUICAO',
  ENCERRAMENTO = 'ENCERRAMENTO'
}

export enum StatusTransferencia {
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  REJEITADA = 'REJEITADA'
}

export enum TipoComentario {
  MENSAGEM = 'MENSAGEM',
  SOLICITACAO_APOIO = 'SOLICITACAO_APOIO',
  ATUALIZACAO = 'ATUALIZACAO'
}

export enum TipoAlerta {
  CASO_INATIVO = 'CASO_INATIVO',
  CASO_CRITICO = 'CASO_CRITICO',
  TRANSFERENCIA_PENDENTE = 'TRANSFERENCIA_PENDENTE',
  VITIMA_RISCO = 'VITIMA_RISCO'
}

export enum NivelVisibilidadeRelatorio {
  TODAS_AGENCIAS = 'TODAS_AGENCIAS',
  COORDENADORA = 'COORDENADORA',
  CONFIDENCIAL = 'CONFIDENCIAL'
}

// Interfaces
export interface IInstituicao extends Document {
  _id: Types.ObjectId;
  nome: string;
  tipo: TipoInstituicao;
  sigla: string;
  provincia: string;
  distrito: string;
  bairro?: string;
  codigoAcesso: string;
  contacto: {
    telefone: string;
    email: string;
  };
  ativa: boolean;
  dataCriacao: Date;
}

export interface IUsuario extends Document {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  senha: string;
  instituicaoId: Types.ObjectId;
  perfil: PerfilUsuario;
  ativo: boolean;
  ultimoLogin?: Date;
  dataCriacao: Date;
  
  // Métodos
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<this>;
  toJSON(): any;
}

export interface IVitima {
  nome?: string;
  genero: Genero;
  idade?: number;
  faixaEtaria: FaixaEtaria;
  nacionalidade: string;
  vulnerabilidade: Vulnerabilidade[];
}

export interface ISuspeito {
  identificacao?: string;
  sexo: string;
  idadeAproximada?: number;
  relacaoVitima: RelacaoVitima;
  descricaoFisica?: string;
}

export interface IEvidencia {
  tipo: TipoEvidencia;
  nomeArquivo: string;
  caminhoArquivo: string;
  url?: string;
  dataUpload: Date;
  uploadPorId: Types.ObjectId;
}

export interface IContatos {
  telefoneDenunciante?: string;
  telefoneSuspeito?: string;
  telefoneVitima?: string;
  urls?: string[];
  outrosContatos?: string;
}

export interface IDenunciante {
  nome: string;
  telefone: string;
  email?: string;
  localizacao: string;
  anonimo: boolean;
}

export interface ILocalizacao {
  provincia: string;
  distrito: string;
  bairro: string;
  localEspecifico: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface IObservacaoInterna {
  usuarioId: Types.ObjectId;
  texto: string;
  data: Date;
  tipo: TipoObservacao;
}

export interface IRelatorioFinal {
  resultado: string;
  autoridadesEnvolvidas: string[];
  evidenciasEncontradas: string;
  vitimasResgatadas: number;
  acoesLegais: string;
  dificuldades: string;
  recomendacoes: string;
  licoesAprendidas: string;
  nivelVisibilidade: NivelVisibilidadeRelatorio;
}

export interface IDenuncia extends Document {
  _id: Types.ObjectId;
  codigoRastreio: string;
  
  // Origem
  tipoDenuncia: TipoDenuncia;
  canalDenuncia: CanalDenuncia;
  instituicaoOrigemId: Types.ObjectId;
  usuarioCriadorId: Types.ObjectId;
  
  // Classificação
  tipoTrafico: TipoTrafico[];
  nivelRisco: NivelRisco;
  
  // Status e Fluxo
  status: StatusDenuncia;
  
  // Localização
  localizacao: ILocalizacao;
  
  // Descrição
  descricao: string;
  contextoAdicional?: string;
  
  // Vítima(s)
  vitimas: IVitima[];
  
  // Suspeito(s)
  suspeitos: ISuspeito[];
  
  // Evidências
  evidencias: IEvidencia[];
  
  // Contatos
  contatos: IContatos;
  
  // Denunciante (se não anônimo)
  denunciante?: IDenunciante;
  
  // Análise e Triagem
  analistaResponsavelId?: Types.ObjectId;
  tempoAnalise?: number; // em minutos
  observacoesInternas: IObservacaoInterna[];
  
  // Encaminhamento
  encaminhadoPor?: Types.ObjectId;
  dataEncaminhamento?: Date;
  instituicaoDestinoId?: Types.ObjectId;
  
  // Investigação
  investigadorResponsavelId?: Types.ObjectId;
  equipaInvestigacao?: Types.ObjectId[];
  prioridade: Prioridade;
  
  // Visibilidade
  visibilidade: Visibilidade;
  instituicoesComAcesso: Types.ObjectId[];
  
  // Relatório Final (quando encerrado)
  relatorioFinal?: IRelatorioFinal;
  
  // Timestamps e Auditoria
  dataRegistro: Date;
  dataUltimaAtualizacao: Date;
  dataIncidente?: Date;
  tempoResolucao?: number; // em dias
}

export interface IHistorico extends Document {
  _id: Types.ObjectId;
  denunciaId: Types.ObjectId;
  usuarioId: Types.ObjectId;
  acao: TipoAcaoHistorico;
  statusAnterior?: string;
  statusNovo?: string;
  detalhes: string;
  justificativa?: string;
  timestamp: Date;
}

export interface ITransferencia extends Document {
  _id: Types.ObjectId;
  denunciaId: Types.ObjectId;
  instituicaoOrigemId: Types.ObjectId;
  instituicaoDestinoId: Types.ObjectId;
  solicitadoPorId: Types.ObjectId;
  justificativa: string;
  status: StatusTransferencia;
  dataTransferencia: Date;
  dataConfirmacao?: Date;
}

export interface IComentarioInterinstitucional extends Document {
  _id: Types.ObjectId;
  denunciaId: Types.ObjectId;
  instituicaoOrigemId: Types.ObjectId;
  usuarioId: Types.ObjectId;
  texto: string;
  tipo: TipoComentario;
  visibilidadePara: Types.ObjectId[]; // instituições que podem ver
  dataComentario: Date;
}

export interface IAlerta extends Document {
  _id: Types.ObjectId;
  denunciaId: Types.ObjectId;
  tipo: TipoAlerta;
  destinatarioId?: Types.ObjectId;
  instituicaoId?: Types.ObjectId;
  mensagem: string;
  lido: boolean;
  dataAlerta: Date;
}

// Request/Response Types
export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    perfil: PerfilUsuario;
    instituicaoId: string;
  };
  denuncia?: IDenuncia;
}

export interface ILoginRequest {
  email: string;
  senha: string;
  instituicaoId: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    instituicao: {
      id: string;
      nome: string;
      tipo: TipoInstituicao;
    };
  };
}

export interface ICreateDenunciaRequest {
  tipoDenuncia: TipoDenuncia;
  canalDenuncia: CanalDenuncia;
  tipoTrafico: TipoTrafico[];
  localizacao: ILocalizacao;
  descricao: string;
  contextoAdicional?: string;
  vitimas: IVitima[];
  suspeitos: ISuspeito[];
  contatos: IContatos;
  denunciante?: IDenunciante;
  dataIncidente?: Date;
}

export interface IUpdateStatusRequest {
  status: StatusDenuncia;
  justificativa?: string;
  observacao?: string;
}

export interface IClassificarCasoRequest {
  nivelRisco: NivelRisco;
  observacoes: string;
  solicitarRevisao?: boolean;
}

export interface IEncaminharCasoRequest {
  instituicaoDestinoId: string;
  justificativa: string;
  prioridade: Prioridade;
}

export interface ITransferirCasoRequest {
  instituicaoDestinoId: string;
  justificativa: string;
}

export interface IAdicionarRelatorioRequest {
  titulo: string;
  conteudo: string;
  evidencias?: string[];
  visibilidade: Visibilidade;
}

export interface IComentarioRequest {
  texto: string;
  tipo: TipoComentario;
  visibilidadePara?: string[];
}

// Dashboard Types
export interface IDashboardStats {
  totalDenuncias: number;
  denunciasPorStatus: Record<StatusDenuncia, number>;
  denunciasPorTipo: Record<TipoTrafico, number>;
  denunciasPorProvincia: Record<string, number>;
  tempoMedioAnalise: number;
  casosPorAnalista: Array<{
    analista: string;
    total: number;
  }>;
}

export interface IDashboardCasosEncaminhados {
  totalEncaminhados: number;
  emInvestigacao: number;
  encerrados: number;
  taxaResolucao: number;
  tempoMedioResolucao: number;
  casosPorInstituicao: Array<{
    instituicao: string;
    total: number;
  }>;
  casosPorTipo: Record<TipoTrafico, number>;
}

// Pagination
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filters
export interface IDenunciaFilters extends IPaginationQuery {
  status?: StatusDenuncia[];
  tipoTrafico?: TipoTrafico[];
  nivelRisco?: NivelRisco[];
  provincia?: string[];
  distrito?: string[];
  canalDenuncia?: CanalDenuncia[];
  dataInicio?: Date;
  dataFim?: Date;
  analistaId?: string;
  instituicaoId?: string;
}

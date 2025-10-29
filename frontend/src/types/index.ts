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
  TRAFICO_HUMANO_CONFIRMADO = 'TRAFICO_HUMANO_CONFIRMADO'
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

// Interfaces principais
export interface Instituicao {
  _id: string;
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
  dataCriacao: string;
}

export interface Usuario {
  _id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  instituicao: Instituicao;
  ativo: boolean;
  ultimoLogin?: string;
  dataCriacao: string;
}

export interface Localizacao {
  provincia: string;
  distrito: string;
  bairro: string;
  localEspecifico: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface Vitima {
  nome?: string;
  genero: Genero;
  idade?: number;
  faixaEtaria: FaixaEtaria;
  nacionalidade: string;
  vulnerabilidade: Vulnerabilidade[];
}

export interface Suspeito {
  identificacao?: string;
  sexo: string;
  idadeAproximada?: number;
  relacaoVitima: RelacaoVitima;
  descricaoFisica?: string;
}

export interface Evidencia {
  tipo: TipoEvidencia;
  nomeArquivo: string;
  caminhoArquivo: string;
  url?: string;
  dataUpload: string;
  uploadPorId: string;
}

export interface Contatos {
  telefoneDenunciante?: string;
  telefoneSuspeito?: string;
  telefoneVitima?: string;
  urls?: string[];
  outrosContatos?: string;
}

export interface Denunciante {
  nome: string;
  telefone: string;
  email?: string;
  localizacao: string;
  anonimo: boolean;
}

export interface ObservacaoInterna {
  usuarioId: string;
  texto: string;
  data: string;
  tipo: TipoObservacao;
}

export interface RelatorioFinal {
  resultado: string;
  autoridadesEnvolvidas: string[];
  evidenciasEncontradas: string;
  vitimasResgatadas: number;
  acoesLegais: string;
  dificuldades: string;
  recomendacoes: string;
  licoesAprendidas: string;
  nivelVisibilidade: 'TODAS_AGENCIAS' | 'COORDENADORA' | 'CONFIDENCIAL';
}

export interface Denuncia {
  _id: string;
  codigoRastreio: string;
  tipoDenuncia: TipoDenuncia;
  canalDenuncia: CanalDenuncia;
  instituicaoOrigemId: string;
  usuarioCriadorId?: string;
  tipoTrafico: TipoTrafico[];
  nivelRisco: NivelRisco;
  status: StatusDenuncia;
  localizacao: Localizacao;
  descricao: string;
  contextoAdicional?: string;
  vitimas: Vitima[];
  suspeitos: Suspeito[];
  evidencias: Evidencia[];
  contatos: Contatos;
  denunciante?: Denunciante;
  analistaResponsavelId?: string;
  tempoAnalise?: number;
  observacoesInternas: ObservacaoInterna[];
  encaminhadoPor?: string;
  dataEncaminhamento?: string;
  instituicaoDestinoId?: string;
  investigadorResponsavelId?: string;
  equipaInvestigacao: string[];
  prioridade: Prioridade;
  visibilidade: Visibilidade;
  instituicoesComAcesso: string[];
  relatorioFinal?: RelatorioFinal;
  dataRegistro: string;
  dataUltimaAtualizacao: string;
  dataIncidente?: string;
  tempoResolucao?: number;
}

// Interfaces de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginRequest {
  email: string;
  senha: string;
  instituicaoId: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Usuario;
}

export interface PaginatedResponse<T> {
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

// Interfaces para formulários
export interface DenunciaFormData {
  tipoDenuncia: TipoDenuncia;
  canalDenuncia: CanalDenuncia;
  tipoTrafico: TipoTrafico[];
  localizacao: Localizacao;
  descricao: string;
  contextoAdicional?: string;
  vitimas: Vitima[];
  suspeitos: Suspeito[];
  contatos: Contatos;
  denunciante?: Denunciante;
}

// Interfaces para filtros
export interface DenunciaFilters {
  page?: number;
  limit?: number;
  status?: StatusDenuncia[];
  tipoTrafico?: TipoTrafico[];
  nivelRisco?: NivelRisco[];
  provincia?: string[];
  distrito?: string[];
  canalDenuncia?: CanalDenuncia[];
  dataInicio?: string;
  dataFim?: string;
  analistaId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interfaces para dashboards
export interface DashboardStats {
  totalDenuncias: number;
  denunciasAtivas: number;
  casosEncerrados: number;
  tempoMedioAnalise: number;
  distribuicaoStatus: Record<StatusDenuncia, number>;
  distribuicaoTipoTrafico: Record<TipoTrafico, number>;
  distribuicaoGenero: Record<Genero, number>;
  distribuicaoFaixaEtaria: Record<FaixaEtaria, number>;
  distribuicaoCanal: Record<CanalDenuncia, number>;
  distribuicaoGeografica: Array<{
    provincia: string;
    total: number;
  }>;
}

// Interfaces para alertas
export interface Alerta {
  _id: string;
  denunciaId: string;
  tipo: 'CASO_INATIVO' | 'CASO_CRITICO' | 'TRANSFERENCIA_PENDENTE' | 'VITIMA_RISCO';
  destinatarioId?: string;
  instituicaoId?: string;
  mensagem: string;
  lido: boolean;
  dataAlerta: string;
}

// Interfaces para histórico
export interface Historico {
  _id: string;
  denunciaId: string;
  usuarioId: string;
  acao: 'CRIACAO' | 'MUDANCA_STATUS' | 'ADICAO_EVIDENCIA' | 'COMENTARIO' | 'ENCAMINHAMENTO' | 'TRANSFERENCIA' | 'ATRIBUICAO' | 'ENCERRAMENTO';
  statusAnterior?: string;
  statusNovo?: string;
  detalhes: string;
  justificativa?: string;
  timestamp: string;
}

// Interfaces para comentários
export interface ComentarioInterinstitucional {
  _id: string;
  denunciaId: string;
  instituicaoOrigemId: string;
  usuarioId: string;
  texto: string;
  tipo: 'MENSAGEM' | 'SOLICITACAO_APOIO' | 'ATUALIZACAO';
  visibilidadePara: string[];
  dataComentario: string;
}

// Interfaces para transferências
export interface Transferencia {
  _id: string;
  denunciaId: string;
  instituicaoOrigemId: string;
  instituicaoDestinoId: string;
  solicitadoPorId: string;
  justificativa: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'REJEITADA';
  dataTransferencia: string;
  dataConfirmacao?: string;
}


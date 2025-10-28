import { StatusDenuncia, NivelRisco, TipoTrafico, Genero, FaixaEtaria } from '@/types';

// Formatação de datas
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dias atrás`;
  }

  return formatDate(d);
};

// Formatação de status
export const getStatusLabel = (status: StatusDenuncia): string => {
  const labels: Record<StatusDenuncia, string> = {
    [StatusDenuncia.INCOMPLETA]: 'Incompleta',
    [StatusDenuncia.SUSPEITA]: 'Suspeita',
    [StatusDenuncia.PROVAVEL]: 'Provável',
    [StatusDenuncia.DESCARTADA]: 'Descartada',
    [StatusDenuncia.EM_INVESTIGACAO_INTERNA]: 'Em Investigação Interna',
    [StatusDenuncia.ENCERRADA_SEM_PROCEDENCIA]: 'Encerrada sem Procedência',
    [StatusDenuncia.SENDO_PROCESSADO_AUTORIDADES]: 'Sendo Processado pelas Autoridades',
    [StatusDenuncia.EM_TRANSITO_AGENCIAS]: 'Em Trânsito entre Agências',
    [StatusDenuncia.ENCERRADO_AUTORIDADE]: 'Encerrado pela Autoridade',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: StatusDenuncia): string => {
  const colors: Record<StatusDenuncia, string> = {
    [StatusDenuncia.INCOMPLETA]: 'status-incompleta',
    [StatusDenuncia.SUSPEITA]: 'status-suspeita',
    [StatusDenuncia.PROVAVEL]: 'status-provavel',
    [StatusDenuncia.DESCARTADA]: 'status-descartada',
    [StatusDenuncia.EM_INVESTIGACAO_INTERNA]: 'status-em-investigacao',
    [StatusDenuncia.ENCERRADA_SEM_PROCEDENCIA]: 'status-encerrada',
    [StatusDenuncia.SENDO_PROCESSADO_AUTORIDADES]: 'status-em-investigacao',
    [StatusDenuncia.EM_TRANSITO_AGENCIAS]: 'status-em-investigacao',
    [StatusDenuncia.ENCERRADO_AUTORIDADE]: 'status-encerrada',
  };
  return colors[status] || 'badge-gray';
};

// Formatação de nível de risco
export const getNivelRiscoLabel = (nivel: NivelRisco): string => {
  const labels: Record<NivelRisco, string> = {
    [NivelRisco.CRITICO]: 'Crítico',
    [NivelRisco.ALTO]: 'Alto',
    [NivelRisco.MEDIO]: 'Médio',
    [NivelRisco.BAIXO]: 'Baixo',
    [NivelRisco.MINIMO]: 'Mínimo',
  };
  return labels[nivel] || nivel;
};

export const getNivelRiscoColor = (nivel: NivelRisco): string => {
  const colors: Record<NivelRisco, string> = {
    [NivelRisco.CRITICO]: 'nivel-risco-critico',
    [NivelRisco.ALTO]: 'nivel-risco-alto',
    [NivelRisco.MEDIO]: 'nivel-risco-medio',
    [NivelRisco.BAIXO]: 'nivel-risco-baixo',
    [NivelRisco.MINIMO]: 'nivel-risco-minimo',
  };
  return colors[nivel] || 'badge-gray';
};

// Formatação de tipos de tráfico
export const getTipoTraficoLabel = (tipo: TipoTrafico): string => {
  const labels: Record<TipoTrafico, string> = {
    [TipoTrafico.SEXUAL]: 'Tráfico Sexual',
    [TipoTrafico.LABORAL]: 'Tráfico Laboral',
    [TipoTrafico.ADOCAO_ILEGAL]: 'Adoção Ilegal',
    [TipoTrafico.ORGAOS]: 'Tráfico de Órgãos',
    [TipoTrafico.SERVIDAO]: 'Servidão',
    [TipoTrafico.MIGRACAO_FORCADA]: 'Migração Forçada',
  };
  return labels[tipo] || tipo;
};

// Formatação de gênero
export const getGeneroLabel = (genero: Genero): string => {
  const labels: Record<Genero, string> = {
    [Genero.MASCULINO]: 'Masculino',
    [Genero.FEMININO]: 'Feminino',
    [Genero.OUTRO]: 'Outro',
    [Genero.NAO_INFORMADO]: 'Não Informado',
  };
  return labels[genero] || genero;
};

// Formatação de faixa etária
export const getFaixaEtariaLabel = (faixa: FaixaEtaria): string => {
  const labels: Record<FaixaEtaria, string> = {
    [FaixaEtaria.CRIANCA]: 'Criança',
    [FaixaEtaria.ADOLESCENTE]: 'Adolescente',
    [FaixaEtaria.ADULTO]: 'Adulto',
    [FaixaEtaria.IDOSO]: 'Idoso',
  };
  return labels[faixa] || faixa;
};

// Formatação de números
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primeira letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Gerar iniciais
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};


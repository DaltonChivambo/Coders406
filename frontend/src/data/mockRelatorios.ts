// Mock dataset and aggregation utilities for public reports dashboard

export type Genero = 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_INFORMADO';
export type TipoInstituicao = 'ESCOLA' | 'HOSPITAL' | 'IGREJA' | 'ONG';
export type TipoTrafico = 'SEXUAL' | 'LABORAL' | 'ADOCAO_ILEGAL' | 'ORGAOS' | 'SERVIDAO' | 'MIGRACAO_FORCADA';
export type Status = 'AGUARDANDO_TRIAGEM' | 'SUBMETIDO_AUTORIDADE' | 'TRAFICO_HUMANO_CONFIRMADO' | 'ARQUIVADO' | 'DESCARTADA';

export interface DenunciaMock {
  id: string;
  provincia: string;
  distrito: string;
  tipoInstituicao: TipoInstituicao;
  genero: Genero;
  tipoTrafico: TipoTrafico[];
  status: Status;
  dataRegistro: string; // ISO date
  anonimo: boolean;
  vinculadaAEntidade: boolean; // se há relação explícita com entidade (quando origem não institucional)
}

export const provincias: string[] = [
  'Maputo', 'Nampula', 'Sofala', 'Zambézia', 'Tete', 'Manica', 'Gaza', 'Inhambane', 'Cabo Delgado', 'Niassa'
];

export const distritosPorProvincia: Record<string, string[]> = {
  Maputo: ['Maputo Cidade', 'KaMavota', 'KaMaxaquene'],
  Nampula: ['Nampula Cidade', 'Nacala', 'Angoche'],
  Sofala: ['Beira', 'Dondo', 'Buzi'],
  'Zambézia': ['Quelimane', 'Mocuba', 'Milange'],
  Tete: ['Tete Cidade', 'Moatize', 'Mutarara'],
  Manica: ['Chimoio', 'Gondola', 'Sussundenga'],
  Gaza: ['Xai-Xai', 'Bilene', 'Chibuto'],
  Inhambane: ['Inhambane Cidade', 'Maxixe', 'Massinga'],
  'Cabo Delgado': ['Pemba', 'Montepuez', 'Mocímboa da Praia'],
  Niassa: ['Lichinga', 'Cuamba', 'Mandimba'],
};

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDateInYear = (year: number): string => {
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
};

// Base seed to guarantee presence for IGREJA and HOSPITAL (and a few ESCOLA)
const seed: DenunciaMock[] = (() => {
  const base: DenunciaMock[] = [];
  const year = new Date().getFullYear();
  const seeds: Array<{ provincia: string; distrito: string; tipoInstituicao: TipoInstituicao; genero: Genero; } > = [
    { provincia: 'Maputo', distrito: 'Maputo Cidade', tipoInstituicao: 'HOSPITAL', genero: 'FEMININO' },
    { provincia: 'Nampula', distrito: 'Nampula Cidade', tipoInstituicao: 'HOSPITAL', genero: 'MASCULINO' },
    { provincia: 'Sofala', distrito: 'Beira', tipoInstituicao: 'IGREJA', genero: 'FEMININO' },
    { provincia: 'Zambézia', distrito: 'Quelimane', tipoInstituicao: 'IGREJA', genero: 'MASCULINO' },
    { provincia: 'Gaza', distrito: 'Xai-Xai', tipoInstituicao: 'ESCOLA', genero: 'OUTRO' },
    { provincia: 'Inhambane', distrito: 'Maxixe', tipoInstituicao: 'ESCOLA', genero: 'NAO_INFORMADO' },
    { provincia: 'Manica', distrito: 'Chimoio', tipoInstituicao: 'ONG', genero: 'FEMININO' },
    { provincia: 'Tete', distrito: 'Tete Cidade', tipoInstituicao: 'ONG', genero: 'MASCULINO' },
  ];
  seeds.forEach((s, idx) => {
    base.push({
      id: `S${idx + 1}`,
      provincia: s.provincia,
      distrito: s.distrito,
      tipoInstituicao: s.tipoInstituicao,
      genero: s.genero,
      tipoTrafico: ['SEXUAL'],
      status: 'AGUARDANDO_TRIAGEM',
      dataRegistro: randomDateInYear(year),
      anonimo: Math.random() < 0.35,
      vinculadaAEntidade: true,
    });
  });
  return base;
})();

const randoms: DenunciaMock[] = Array.from({ length: 220 }).map((_, i) => {
  const prov = randomPick(provincias);
  const dist = randomPick(distritosPorProvincia[prov]);
  const instituicoes: TipoInstituicao[] = ['ESCOLA', 'HOSPITAL', 'IGREJA', 'ONG'];
  const generos: Genero[] = ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'];
  const tipos: TipoTrafico[] = ['SEXUAL', 'LABORAL', 'ADOCAO_ILEGAL', 'ORGAOS', 'SERVIDAO', 'MIGRACAO_FORCADA'];
  const statuses: Status[] = ['AGUARDANDO_TRIAGEM', 'SUBMETIDO_AUTORIDADE', 'TRAFICO_HUMANO_CONFIRMADO', 'ARQUIVADO', 'DESCARTADA'];
  const tipoCount = 1 + Math.floor(Math.random() * 2);
  const tipoTrafico: TipoTrafico[] = Array.from({ length: tipoCount }).map(() => randomPick(tipos)).filter((v, idx, a) => a.indexOf(v) === idx);

  return {
    id: String(i + 1),
    provincia: prov,
    distrito: dist,
    tipoInstituicao: randomPick(instituicoes),
    genero: randomPick(generos),
    tipoTrafico,
    status: randomPick(statuses),
    dataRegistro: randomDateInYear(new Date().getFullYear()),
    anonimo: Math.random() < 0.3,
    vinculadaAEntidade: Math.random() < 0.6,
  };
});

export const mockDenuncias: DenunciaMock[] = [...seed, ...randoms];

export interface FiltrosRelatorios {
  provincia?: string;
  distrito?: string;
  genero?: Genero;
  tipoInstituicao?: TipoInstituicao;
  tipoTrafico?: TipoTrafico;
}

export const filtrar = (dados: DenunciaMock[], filtros: FiltrosRelatorios): DenunciaMock[] => {
  return dados.filter(d => {
    if (filtros.provincia && d.provincia !== filtros.provincia) return false;
    if (filtros.distrito && d.distrito !== filtros.distrito) return false;
    if (filtros.genero && d.genero !== filtros.genero) return false;
    if (filtros.tipoInstituicao && d.tipoInstituicao !== filtros.tipoInstituicao) return false;
    if (filtros.tipoTrafico && !d.tipoTrafico.includes(filtros.tipoTrafico)) return false;
    return true;
  });
};

export const groupCount = <K extends string>(rows: DenunciaMock[], by: (d: DenunciaMock) => K): Record<K, number> => {
  return rows.reduce((acc, cur) => {
    const k = by(cur);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<K, number>);
};

export const toBarData = (counts: Record<string, number>, labelKey = 'nome', valueKey = 'valor') =>
  Object.entries(counts).map(([k, v]) => ({ [labelKey]: k, [valueKey]: v }));

export const toStackedData = (rows: DenunciaMock[], key: 'provincia' | 'distrito', categorias: TipoTrafico[]) => {
  const mapa: Record<string, Record<string, number>> = {};
  rows.forEach(d => {
    const k = d[key];
    mapa[k] = mapa[k] || {};
    categorias.forEach(t => { if (mapa[k][t] === undefined) mapa[k][t] = 0; });
    d.tipoTrafico.forEach(t => { mapa[k][t] = (mapa[k][t] || 0) + 1; });
  });
  return Object.entries(mapa).map(([k, valores]) => ({ [key]: k, ...valores }));
};

export const mesesPt = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
export const porMesConfirmados = (rows: DenunciaMock[]) => {
  const arr = new Array(12).fill(0);
  rows.forEach(d => {
    if (d.status === 'TRAFICO_HUMANO_CONFIRMADO') {
      const m = new Date(d.dataRegistro).getMonth();
      arr[m] += 1;
    }
  });
  return arr.map((v, i) => ({ mes: mesesPt[i], casos: v }));
};



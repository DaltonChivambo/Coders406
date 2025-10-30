import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar, TipoTrafico } from '@/data/mockRelatorios';

const tipos: TipoTrafico[] = ['SEXUAL', 'LABORAL', 'ADOCAO_ILEGAL', 'ORGAOS', 'SERVIDAO', 'MIGRACAO_FORCADA'];

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsPorTipoTraficoGeral({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const counts: Record<string, number> = {};
  tipos.forEach(t => counts[t] = 0);
  rows.forEach(r => r.tipoTrafico.forEach(t => counts[t] = (counts[t] || 0) + 1));
  const chartData = Object.entries(counts).map(([nome, valor]) => ({ nome, valor }));

  return (
    <ChartCard title="Tipos de Tráfico (Geral)" subtitle="Ocorrências totais por categoria">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="valor" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




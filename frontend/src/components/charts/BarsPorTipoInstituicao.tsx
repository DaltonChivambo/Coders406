import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, filtrar, groupCount, toBarData, FiltrosRelatorios } from '@/data/mockRelatorios';

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsPorTipoInstituicao({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const counts = groupCount(rows, d => d.tipoInstituicao);
  const chartData = toBarData(counts, 'nome', 'valor');

  return (
    <ChartCard title="Denúncias por Tipo de Instituição" subtitle="Agregado por tipo (Escola, Hospital, etc.)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="valor" fill="#9333ea" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




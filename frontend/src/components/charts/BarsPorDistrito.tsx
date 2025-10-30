import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, filtrar, groupCount, toBarData, FiltrosRelatorios } from '@/data/mockRelatorios';

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsPorDistrito({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const counts = groupCount(rows, d => d.distrito);
  const chartData = toBarData(counts, 'nome', 'valor');

  return (
    <ChartCard title="Denúncias por Distrito" subtitle="Total de denúncias por distrito">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} interval={0} angle={-25} height={60} textAnchor="end" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="valor" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




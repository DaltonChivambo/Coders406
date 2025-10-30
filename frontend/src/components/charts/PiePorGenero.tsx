import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar, groupCount } from '@/data/mockRelatorios';

const COLORS = ['#1d4ed8', '#059669', '#f59e0b', '#6b7280'];

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function PiePorGenero({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const counts = groupCount(rows, d => d.genero);
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <ChartCard title="Distribuição por Gênero" subtitle="Proporção de vítimas por gênero">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




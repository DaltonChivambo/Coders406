import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar } from '@/data/mockRelatorios';

const COLORS = ['#0ea5e9', '#94a3b8'];

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function PieAnonimas({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const anon = rows.filter(r => r.anonimo).length;
  const ident = rows.length - anon;
  const chartData = [
    { name: 'Anônimas', value: anon },
    { name: 'Identificadas', value: ident },
  ];

  return (
    <ChartCard title="Denúncias Anônimas" subtitle="Proporção de anônimas vs identificadas">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




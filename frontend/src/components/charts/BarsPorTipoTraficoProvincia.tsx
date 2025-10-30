import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar, toStackedData } from '@/data/mockRelatorios';

const series = ['SEXUAL', 'LABORAL', 'ADOCAO_ILEGAL', 'ORGAOS', 'SERVIDAO', 'MIGRACAO_FORCADA'] as const;

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsPorTipoTraficoProvincia({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const chartData = toStackedData(rows, 'provincia', series as unknown as string[]);

  return (
    <ChartCard title="Tipos de Tráfico por Província" subtitle="Distribuição por categoria">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="provincia" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {series.map((s, i) => (
            <Bar key={s} dataKey={s} stackId="a" fill={["#2563eb","#16a34a","#f59e0b","#ef4444","#9333ea","#0ea5e9"][i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar, porMesConfirmados } from '@/data/mockRelatorios';

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsConfirmados({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const chartData = porMesConfirmados(rows);

  return (
    <ChartCard title="Casos Confirmados por Mês" subtitle="Total de denúncias enviadas e confirmadas como tráfico humano">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="casos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




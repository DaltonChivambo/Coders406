import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { DenunciaMock, FiltrosRelatorios, filtrar } from '@/data/mockRelatorios';

interface Props {
  data: DenunciaMock[];
  filtros: FiltrosRelatorios;
}

export default function BarsVinculoEntidade({ data, filtros }: Props) {
  const rows = filtrar(data, filtros);
  const withEntity = rows.filter(r => r.vinculadaAEntidade).length;
  const withoutEntity = rows.length - withEntity;
  const chartData = [
    { categoria: 'Com Entidade', valor: withEntity },
    { categoria: 'Sem Entidade', valor: withoutEntity },
  ];

  return (
    <ChartCard title="Relação com Entidades" subtitle="Denúncias com/sem vínculo explícito a entidades">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="valor" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}




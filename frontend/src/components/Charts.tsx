import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEstatisticas } from '@/hooks/useEstatisticas';
import { Loader2 } from 'lucide-react';

const cores = {
  pendentes: '#ef4444', // red-500
  emAnalise: '#f59e0b', // amber-500
  submetidos: '#10b981' // emerald-500
};

export function CasosPendentesChart() {
  const { data: estatisticas, isLoading, error } = useEstatisticas();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Pendentes por Mês</h3>
          <p className="text-sm text-gray-600">Total de casos aguardando processamento inicial</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-unodc-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Pendentes por Mês</h3>
          <p className="text-sm text-gray-600">Total de casos aguardando processamento inicial</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar dados</p>
        </div>
      </div>
    );
  }

  const dadosPendentes = estatisticas?.casosPendentes || [];
  const totalPendentes = dadosPendentes.reduce((acc, item) => acc + item.casos, 0);
  const mediaPendentes = Math.round(totalPendentes / dadosPendentes.length) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Pendentes por Mês</h3>
        <p className="text-sm text-gray-600">Total de casos aguardando processamento inicial</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosPendentes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              formatter={(value: any) => [value, 'Casos']}
            />
            <Bar 
              dataKey="casos" 
              fill={cores.pendentes}
              radius={[4, 4, 0, 0]}
              stroke={cores.pendentes}
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-gray-600">Total: {totalPendentes} casos</span>
        </div>
        <div className="text-gray-500">
          Média: {mediaPendentes} casos/mês
        </div>
      </div>
    </div>
  );
}

export function CasosSubmetidosChart() {
  const { data: estatisticas, isLoading, error } = useEstatisticas();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Submetidos por Mês</h3>
          <p className="text-sm text-gray-600">Total de denúncias encaminhadas para as autoridades competentes</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-unodc-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Submetidos por Mês</h3>
          <p className="text-sm text-gray-600">Total de denúncias encaminhadas para as autoridades competentes</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar dados</p>
        </div>
      </div>
    );
  }

  const dadosSubmetidos = estatisticas?.casosSubmetidos || [];
  const totalSubmetidos = dadosSubmetidos.reduce((acc, item) => acc + item.casos, 0);
  const mediaSubmetidos = Math.round(totalSubmetidos / dadosSubmetidos.length) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Submetidos por Mês</h3>
        <p className="text-sm text-gray-600">Total de denúncias encaminhadas para as autoridades competentes</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosSubmetidos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              formatter={(value: any) => [value, 'Casos']}
            />
            <Bar 
              dataKey="casos" 
              fill={cores.submetidos}
              radius={[4, 4, 0, 0]}
              stroke={cores.submetidos}
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-gray-600">Total: {totalSubmetidos} casos</span>
        </div>
        <div className="text-gray-500">
          Média: {mediaSubmetidos} casos/mês
        </div>
      </div>
    </div>
  );
}


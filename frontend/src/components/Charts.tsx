import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Dados mockados para demonstração
const casosPendentesData = [
  { mes: 'Jan', casos: 45 },
  { mes: 'Fev', casos: 52 },
  { mes: 'Mar', casos: 38 },
  { mes: 'Abr', casos: 61 },
  { mes: 'Mai', casos: 47 },
  { mes: 'Jun', casos: 55 },
  { mes: 'Jul', casos: 42 },
  { mes: 'Ago', casos: 58 },
  { mes: 'Set', casos: 49 },
  { mes: 'Out', casos: 53 },
  { mes: 'Nov', casos: 46 },
  { mes: 'Dez', casos: 39 }
];

const casosAnaliseData = [
  { mes: 'Jan', casos: 23 },
  { mes: 'Fev', casos: 28 },
  { mes: 'Mar', casos: 19 },
  { mes: 'Abr', casos: 31 },
  { mes: 'Mai', casos: 24 },
  { mes: 'Jun', casos: 27 },
  { mes: 'Jul', casos: 21 },
  { mes: 'Ago', casos: 29 },
  { mes: 'Set', casos: 25 },
  { mes: 'Out', casos: 26 },
  { mes: 'Nov', casos: 23 },
  { mes: 'Dez', casos: 20 }
];

const casosSubmetidosData = [
  { mes: 'Jan', casos: 68 },
  { mes: 'Fev', casos: 80 },
  { mes: 'Mar', casos: 57 },
  { mes: 'Abr', casos: 92 },
  { mes: 'Mai', casos: 71 },
  { mes: 'Jun', casos: 82 },
  { mes: 'Jul', casos: 63 },
  { mes: 'Ago', casos: 87 },
  { mes: 'Set', casos: 74 },
  { mes: 'Out', casos: 79 },
  { mes: 'Nov', casos: 69 },
  { mes: 'Dez', casos: 59 }
];

const statusDistribution = [
  { name: 'Pendentes', value: 156, color: '#F59E0B' },
  { name: 'Em Análise', value: 89, color: '#3B82F6' },
  { name: 'Submetidos', value: 234, color: '#10B981' },
  { name: 'Concluídos', value: 178, color: '#6B7280' }
];


export const CasosPendentesChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Pendentes por Mês</h3>
        <p className="text-sm text-gray-600">Número de casos aguardando processamento</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={casosPendentesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              formatter={(value: any) => [`${value} casos`, 'Pendentes']}
            />
            <Bar 
              dataKey="casos" 
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
              stroke="#F59E0B"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CasosAnaliseChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos em Análise por Mês</h3>
        <p className="text-sm text-gray-600">Número de casos sendo analisados</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={casosAnaliseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorAnalise" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              formatter={(value: any) => [`${value} casos`, 'Em Análise']}
            />
            <Area
              type="monotone"
              dataKey="casos"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorAnalise)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CasosSubmetidosChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos Submetidos por Mês</h3>
        <p className="text-sm text-gray-600">Número total de casos submetidos</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={casosSubmetidosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              formatter={(value: any) => [`${value} casos`, 'Submetidos']}
            />
            <Line
              type="monotone"
              dataKey="casos"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const StatusDistributionChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribuição de Status</h3>
        <p className="text-sm text-gray-600">Visão geral dos casos por status</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value} casos`, 'Quantidade']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {statusDistribution.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal que combina todos os gráficos
export const DashboardCharts = () => {
  return (
    <div className="space-y-6">
      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CasosPendentesChart />
        <CasosAnaliseChart />
      </div>
      
      {/* Gráfico de linha para casos submetidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CasosSubmetidosChart />
        <StatusDistributionChart />
      </div>
    </div>
  );
};

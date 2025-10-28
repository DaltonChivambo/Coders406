import { useAuthStore } from '@/store/authStore';
import { PerfilUsuario } from '@/types';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Dados mockados para demonstração
  const stats = {
    totalDenuncias: 1247,
    denunciasPendentes: 23,
    casosAtivos: 156,
    casosResolvidos: 1068,
    tempoMedioResolucao: 7.2,
    taxaResolucao: 89.2,
  };

  const recentDenuncias = [
    {
      id: '1',
      codigo: 'HUMAI-ABC123',
      descricao: 'Caso suspeito de tráfico sexual em Maputo',
      status: 'EM_ANALISE',
      dataRegistro: '2024-01-15T10:30:00Z',
      nivelRisco: 'ALTO',
    },
    {
      id: '2',
      codigo: 'HUMAI-DEF456',
      descricao: 'Denúncia de trabalho forçado em Nampula',
      status: 'EM_INVESTIGACAO',
      dataRegistro: '2024-01-14T15:45:00Z',
      nivelRisco: 'CRITICO',
    },
    {
      id: '3',
      codigo: 'HUMAI-GHI789',
      descricao: 'Suspeita de adoção ilegal em Beira',
      status: 'PENDENTE',
      dataRegistro: '2024-01-13T09:15:00Z',
      nivelRisco: 'MEDIO',
    },
  ];

  const getDashboardContent = () => {
    switch (user?.perfil) {
      case PerfilUsuario.AGENTE_COMUNITARIO:
      case PerfilUsuario.OPERADOR:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-unodc-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Minhas Denúncias</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-gold-100 rounded-lg">
                      <Clock className="h-6 w-6 text-unodc-gold-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-unodc-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                      <p className="text-2xl font-bold text-gray-900">9</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-unodc-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Críticos</p>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Denúncias Recentes</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentDenuncias.map((denuncia) => (
                    <div key={denuncia.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{denuncia.codigo}</p>
                        <p className="text-sm text-gray-600">{denuncia.descricao}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${denuncia.nivelRisco === 'CRITICO' ? 'badge-danger' : 'badge-warning'}`}>
                          {denuncia.nivelRisco}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(denuncia.dataRegistro).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case PerfilUsuario.ANALISTA:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-blue-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-unodc-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pendentes de Análise</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-gold-100 rounded-lg">
                      <Clock className="h-6 w-6 text-unodc-gold-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Em Análise</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-unodc-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Analisados Hoje</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Casos por Status</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Suspeitos</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-unodc-gold-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prováveis</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-unodc-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Descartados</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Tempo Médio de Análise</h3>
                </div>
                <div className="card-body">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-unodc-blue-600 mb-2">
                      {stats.tempoMedioResolucao}h
                    </div>
                    <p className="text-sm text-gray-600">
                      Tempo médio para análise de casos
                    </p>
                    <div className="mt-4 flex items-center justify-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">-15% vs mês anterior</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case PerfilUsuario.SUPERVISOR:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-unodc-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Casos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDenuncias}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-gold-100 rounded-lg">
                      <Clock className="h-6 w-6 text-unodc-gold-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.denunciasPendentes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-unodc-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.casosResolvidos}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-unodc-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.taxaResolucao}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Performance dos Analistas</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-unodc-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-unodc-blue-600">MA</span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">Maria Santos</span>
                      </div>
                      <span className="text-sm text-gray-600">15 casos</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-unodc-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-unodc-green-600">JS</span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">João Silva</span>
                      </div>
                      <span className="text-sm text-gray-600">12 casos</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-unodc-gold-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-unodc-gold-600">AC</span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">Ana Costa</span>
                      </div>
                      <span className="text-sm text-gray-600">8 casos</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Casos Prontos para Encaminhamento</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="p-3 bg-unodc-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">HUMAI-ABC123</p>
                      <p className="text-xs text-gray-600">Tráfico sexual - Nível Alto</p>
                    </div>
                    <div className="p-3 bg-unodc-red-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">HUMAI-DEF456</p>
                      <p className="text-xs text-gray-600">Trabalho forçado - Nível Crítico</p>
                    </div>
                    <div className="p-3 bg-unodc-gold-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">HUMAI-GHI789</p>
                      <p className="text-xs text-gray-600">Adoção ilegal - Nível Médio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-unodc-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Denúncias</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDenuncias}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-gold-100 rounded-lg">
                      <Clock className="h-6 w-6 text-unodc-gold-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Casos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.casosAtivos}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-unodc-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.casosResolvidos}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-2 bg-unodc-red-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-unodc-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.taxaResolucao}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Bem-vindo ao HUMAI</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600 mb-4">
                  Olá, {user?.nome}! Este é o seu painel de controle personalizado baseado no seu perfil: 
                  <span className="font-medium text-unodc-blue-600 ml-1">
                    {user?.perfil.replace('_', ' ')}
                  </span>
                </p>
                <p className="text-gray-600">
                  Use o menu lateral para navegar pelas funcionalidades disponíveis para o seu perfil.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Visão geral do sistema e suas atividades
            </p>
          </div>
          
          <Link
            to="/dashboard/denuncias/nova"
            className="inline-flex items-center px-4 py-2 bg-unodc-blue-500 hover:bg-unodc-blue-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Denúncia
          </Link>
        </div>
      </div>

      {getDashboardContent()}
    </div>
  );
}


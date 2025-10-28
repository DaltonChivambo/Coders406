import { useAuthStore } from '@/store/authStore';
import { PerfilUsuario } from '@/types';
import { Link } from 'react-router-dom';
import { useDenuncias, useDenunciaStats } from '@/hooks/useDenuncias';
import { 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Plus,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  // Buscar dados reais das denúncias
  const { denuncias: recentDenuncias, isLoading: isLoadingDenuncias } = useDenuncias({ 
    limit: 5,
    sortBy: 'dataRegistro',
    sortOrder: 'desc'
  });
  
  const { stats, isLoading: isLoadingStats } = useDenunciaStats();

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
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalDenuncias}
                      </p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.denunciasPendentes}
                      </p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.casosResolvidos}
                      </p>
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
                {isLoadingDenuncias ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-unodc-blue-600" />
                    <span className="ml-2 text-gray-600">Carregando denúncias...</span>
                  </div>
                ) : recentDenuncias.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma denúncia encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDenuncias.map((denuncia) => (
                      <div key={denuncia._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-unodc-blue-600">
                              {denuncia.codigoRastreio}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              denuncia.status === 'SUSPEITA' ? 'bg-yellow-100 text-yellow-800' :
                              denuncia.status === 'EM_INVESTIGACAO_INTERNA' ? 'bg-blue-100 text-blue-800' :
                              denuncia.status === 'INCOMPLETA' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {denuncia.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              denuncia.nivelRisco === 'ALTO' ? 'bg-red-100 text-red-800' :
                              denuncia.nivelRisco === 'CRITICO' ? 'bg-red-200 text-red-900' :
                              denuncia.nivelRisco === 'MEDIO' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {denuncia.nivelRisco}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{denuncia.descricao}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(denuncia.dataRegistro).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Link
                          to={`/dashboard/denuncias/${denuncia._id}`}
                          className="text-unodc-blue-600 hover:text-unodc-blue-800 text-sm font-medium"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
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


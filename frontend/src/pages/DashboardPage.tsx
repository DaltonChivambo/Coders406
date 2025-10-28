import { useAuthStore } from '@/store/authStore';
import { PerfilUsuario } from '@/types';
import { Link } from 'react-router-dom';
import { useDenuncias, useDenunciaStats } from '@/hooks/useDenuncias';
import { DashboardCharts } from '@/components/Charts';
import { 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  CheckCircle,
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
                              denuncia.status === 'AGUARDANDO_TRIAGEM' ? 'bg-yellow-100 text-yellow-800' :
                              denuncia.status === 'EM_ANALISE' ? 'bg-blue-100 text-blue-800' :
                              denuncia.status === 'SUBMETIDO_AUTORIDADE' ? 'bg-purple-100 text-purple-800' :
                              denuncia.status === 'EM_INVESTIGACAO' ? 'bg-orange-100 text-orange-800' :
                              denuncia.status === 'CASO_ENCERRADO' ? 'bg-green-100 text-green-800' :
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
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'AGUARDANDO_TRIAGEM').length}
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
                      <p className="text-sm font-medium text-gray-600">Em Análise</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'EM_ANALISE').length}
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
                      <p className="text-sm font-medium text-gray-600">Submetidos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'SUBMETIDO_AUTORIDADE').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Tipos de Tráfico</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tráfico Sexual</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trabalho Forçado</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Adoção Ilegal</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Outros</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Vítimas por Idade</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Crianças (0-12)</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-600 h-3 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Adolescentes (13-17)</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Adultos (18+)</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Vulnerabilidades</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pobreza</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Migração</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Orfandade</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Analfabetismo</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Distritos com Mais Casos</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Maputo Cidade</span>
                      <span className="text-sm font-medium">45 casos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Matola</span>
                      <span className="text-sm font-medium">28 casos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Beira</span>
                      <span className="text-sm font-medium">18 casos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nampula</span>
                      <span className="text-sm font-medium">12 casos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case PerfilUsuario.AUTORIDADE:
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
                      <p className="text-sm font-medium text-gray-600">Casos Submetidos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'SUBMETIDO_AUTORIDADE').length}
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
                      <p className="text-sm font-medium text-gray-600">Em Investigação</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'EM_INVESTIGACAO').length}
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
                      <p className="text-sm font-medium text-gray-600">Casos Encerrados</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                         recentDenuncias.filter(d => d.status === 'CASO_ENCERRADO').length}
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
                      <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.taxaResolucao}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Casos Recentes</h3>
              </div>
              <div className="card-body">
                {isLoadingDenuncias ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-unodc-blue-600" />
                    <span className="ml-2 text-gray-600">Carregando casos...</span>
                  </div>
                ) : recentDenuncias.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum caso encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDenuncias.slice(0, 5).map((denuncia) => (
                      <div key={denuncia._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-unodc-blue-600">
                              {denuncia.codigoRastreio}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              denuncia.status === 'SUBMETIDO_AUTORIDADE' ? 'bg-purple-100 text-purple-800' :
                              denuncia.status === 'EM_INVESTIGACAO' ? 'bg-orange-100 text-orange-800' :
                              denuncia.status === 'CASO_ENCERRADO' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {denuncia.status.replace('_', ' ')}
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

      case PerfilUsuario.GESTOR_SISTEMA:
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
                      <p className="text-sm font-medium text-gray-600">Casos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.casosAtivos}
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
                      <BarChart3 className="h-6 w-6 text-unodc-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.taxaResolucao}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Todas as Denúncias</h3>
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
                    {recentDenuncias.slice(0, 10).map((denuncia) => (
                      <div key={denuncia._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-unodc-blue-600">
                              {denuncia.codigoRastreio}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              denuncia.status === 'AGUARDANDO_TRIAGEM' ? 'bg-yellow-100 text-yellow-800' :
                              denuncia.status === 'EM_ANALISE' ? 'bg-blue-100 text-blue-800' :
                              denuncia.status === 'SUBMETIDO_AUTORIDADE' ? 'bg-purple-100 text-purple-800' :
                              denuncia.status === 'EM_INVESTIGACAO' ? 'bg-orange-100 text-orange-800' :
                              denuncia.status === 'CASO_ENCERRADO' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {denuncia.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {typeof denuncia.instituicaoOrigemId === 'object' && denuncia.instituicaoOrigemId && 'nome' in denuncia.instituicaoOrigemId
                                ? (denuncia.instituicaoOrigemId as any).nome 
                                : 'Instituição não informada'}
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
      
      {/* Seção de Gráficos */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Análise de Dados</h2>
          <p className="text-gray-600">Visualização de casos pendentes, em análise e submetidos</p>
        </div>
        <DashboardCharts />
      </div>
    </div>
  );
}


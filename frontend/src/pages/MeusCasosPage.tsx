import React from 'react';
import { useDenuncias } from '@/hooks/useDenuncias';
import { StatusDenuncia } from '@/types';
import { 
  ClipboardList, 
  Clock, 
  User, 
  MapPin, 
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function MeusCasosPage() {
  const { denuncias, isLoading, error } = useDenuncias({
    status: StatusDenuncia.EM_ANALISE
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case StatusDenuncia.EM_ANALISE:
        return 'bg-blue-100 text-blue-800';
      case StatusDenuncia.AGUARDANDO_INFORMACOES:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case StatusDenuncia.EM_ANALISE:
        return <AlertTriangle className="w-4 h-4" />;
      case StatusDenuncia.AGUARDANDO_INFORMACOES:
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unodc-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">Erro ao carregar casos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Casos</h1>
          <p className="text-gray-600 mt-1">
            Casos em análise sob sua responsabilidade
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <div className="flex items-center">
            <ClipboardList className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              {denuncias.length} caso{denuncias.length !== 1 ? 's' : ''} em análise
            </span>
          </div>
        </div>
      </div>

      {denuncias.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum caso em análise
          </h3>
          <p className="text-gray-500">
            Você não possui casos em análise no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {denuncias.map((denuncia) => (
            <div key={denuncia._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(denuncia.status)}`}>
                      {getStatusIcon(denuncia.status)}
                      <span className="ml-1">{denuncia.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Código: {denuncia.codigoRastreio}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unodc-blue-500">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar Análise
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {denuncia.usuarioCriadorId?.nome || 'Denúncia Pública'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {denuncia.localizacao?.provincia}, {denuncia.localizacao?.distrito}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {new Date(denuncia.dataRegistro).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {denuncia.tipoTrafico?.join(', ') || 'Não especificado'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {denuncia.descricao || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>

                {denuncia.vitimas && denuncia.vitimas.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Vítima{denuncia.vitimas.length > 1 ? 's' : ''} ({denuncia.vitimas.length})
                    </h4>
                    <div className="space-y-2">
                      {denuncia.vitimas.map((vitima, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">
                            {vitima.genero} - {vitima.faixaEtaria}
                          </span>
                          {vitima.vulnerabilidade && vitima.vulnerabilidade.length > 0 && (
                            <span className="ml-2 text-gray-500">
                              ({vitima.vulnerabilidade.join(', ')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {denuncia.observacoesInternas && denuncia.observacoesInternas.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Observações Internas ({denuncia.observacoesInternas.length})
                    </h4>
                    <div className="space-y-2">
                      {denuncia.observacoesInternas.map((obs, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-700">{obs.tipo}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(obs.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p>{obs.texto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

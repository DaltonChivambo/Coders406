import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { denunciaService } from '@/services/denunciaService';
import { Search, Clock, CheckCircle, AlertTriangle, X, FileText, MapPin, User, Calendar } from 'lucide-react';
import { formatDate, formatDateTime, getStatusLabel, getStatusColor } from '@/utils/format';

const rastreioSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
});

type RastreioFormData = z.infer<typeof rastreioSchema>;

export default function RastreioInternoPage() {
  const [denuncia, setDenuncia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RastreioFormData>({
    resolver: zodResolver(rastreioSchema),
  });

  const onSubmit = async (data: RastreioFormData) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await denunciaService.getDenunciaByCodigo(data.codigo);
      setDenuncia(response);
    } catch (error: any) {
      console.error('Erro ao buscar denúncia:', error);
      if (error.response?.status === 404) {
        setError('Denúncia não encontrada. Verifique o código e tente novamente.');
      } else {
        setError('Erro ao buscar denúncia. Tente novamente.');
      }
      setDenuncia(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'INCOMPLETA':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'SUSPEITA':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'PROVAVEL':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'DESCARTADA':
        return <X className="w-5 h-5 text-gray-500" />;
      case 'EM_INVESTIGACAO_INTERNA':
        return <Search className="w-5 h-5 text-blue-500" />;
      case 'ENCERRADA_SEM_PROCEDENCIA':
        return <X className="w-5 h-5 text-gray-500" />;
      case 'SENDO_PROCESSADO_AUTORIDADES':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'EM_TRANSITO_AGENCIAS':
        return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'ENCERRADO_AUTORIDADE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-unodc-blue-500 to-unodc-navy-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-unodc-navy-900 mb-2">
            Rastreamento de Casos
          </h1>
          <p className="text-unodc-navy-600">
            Consulte o status e detalhes de casos específicos usando o código de rastreamento
          </p>
        </div>

        {/* Formulário de Busca */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                {...register('codigo')}
                type="text"
                placeholder="Digite o código de rastreamento (ex: HUM-2024-001)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent text-lg"
              />
              {errors.codigo && (
                <p className="mt-2 text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </form>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Resultado da Busca */}
        {denuncia && (
          <div className="space-y-6">
            {/* Header do Caso */}
            <div className="bg-gradient-to-r from-unodc-blue-50 to-unodc-navy-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-unodc-navy-900">
                    Caso {denuncia.codigoRastreio}
                  </h2>
                  <p className="text-unodc-navy-600">
                    Instituição: {denuncia.instituicaoOrigem?.nome}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(denuncia.status)}`}>
                    {getStatusIcon(denuncia.status)}
                    <span className="ml-2">{getStatusLabel(denuncia.status)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-unodc-navy-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-unodc-blue-500" />
                  Datas Importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Data de Registro</p>
                    <p className="font-medium">{formatDate(denuncia.dataRegistro)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Atualização</p>
                    <p className="font-medium">{formatDateTime(denuncia.dataUltimaAtualizacao)}</p>
                  </div>
                  {denuncia.dataIncidente && (
                    <div>
                      <p className="text-sm text-gray-600">Data do Incidente</p>
                      <p className="font-medium">{formatDate(denuncia.dataIncidente)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-unodc-navy-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-unodc-blue-500" />
                  Localização
                </h3>
                {denuncia.localizacao ? (
                  <div className="space-y-2">
                    <p className="font-medium">{denuncia.localizacao.provincia}</p>
                    <p className="text-gray-600">{denuncia.localizacao.distrito}</p>
                    {denuncia.localizacao.bairro && (
                      <p className="text-gray-600">{denuncia.localizacao.bairro}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Localização não informada</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            {denuncia.descricao && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-unodc-navy-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-unodc-blue-500" />
                  Descrição do Caso
                </h3>
                <p className="text-gray-700 leading-relaxed">{denuncia.descricao}</p>
              </div>
            )}

            {/* Vítimas */}
            {denuncia.vitimas && denuncia.vitimas.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-unodc-navy-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-unodc-blue-500" />
                  Vítimas Envolvidas
                </h3>
                <div className="space-y-3">
                  {denuncia.vitimas.map((vitima: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Gênero</p>
                          <p className="font-medium">{vitima.genero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Faixa Etária</p>
                          <p className="font-medium">{vitima.faixaEtaria}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Nacionalidade</p>
                          <p className="font-medium">{vitima.nacionalidade}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações Internas */}
            {denuncia.observacoesInternas && denuncia.observacoesInternas.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-unodc-navy-900 mb-4">
                  Observações Internas
                </h3>
                <div className="space-y-4">
                  {denuncia.observacoesInternas.map((obs: any, index: number) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">{formatDateTime(obs.data)}</p>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {obs.tipo}
                        </span>
                      </div>
                      <p className="text-gray-700">{obs.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações de Ajuda */}
        {!denuncia && !error && (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-unodc-navy-900 mb-2">
              Como usar o rastreamento?
            </h3>
            <p className="text-gray-600 mb-4">
              Digite o código de rastreamento fornecido quando a denúncia foi registrada. 
              Este código permite acompanhar o progresso do caso.
            </p>
            <div className="text-sm text-gray-500">
              <p>Exemplo de código: HUM-2024-001</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


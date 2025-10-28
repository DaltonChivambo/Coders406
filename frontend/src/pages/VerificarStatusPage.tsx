import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle, CheckCircle, Clock, FileText, Shield, MapPin, Calendar, User, Building2, Eye, EyeOff } from 'lucide-react';
import { denunciaService } from '@/services/denunciaService';

const verificarStatusSchema = z.object({
  codigoRastreio: z.string().min(1, 'Código de rastreio é obrigatório'),
});

type VerificarStatusFormData = z.infer<typeof verificarStatusSchema>;

interface StatusDenuncia {
  codigoRastreio: string;
  status: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  instituicaoOrigem: {
    nome: string;
    sigla: string;
  };
  tipoTrafico: string[];
  localizacao: {
    provincia: string;
    distrito: string;
    bairro: string;
  };
  descricao: string;
  progresso: number;
  etapas: Array<{
    nome: string;
    status: 'concluida' | 'em_andamento' | 'pendente';
    data?: string;
    responsavel?: string;
  }>;
}

export default function VerificarStatusPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [denuncia, setDenuncia] = useState<StatusDenuncia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificarStatusFormData>({
    resolver: zodResolver(verificarStatusSchema),
  });

  const onSubmit = async (data: VerificarStatusFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setDenuncia(null);
      
      const response = await denunciaService.verificarStatusPublico(data.codigoRastreio);
      setDenuncia(response);
    } catch (error: any) {
      console.error('Erro ao buscar denúncia:', error);
      setError('Denúncia não encontrada. Verifique o código de rastreio.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recebida':
        return 'bg-blue-100 text-blue-800';
      case 'em_analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_investigacao':
        return 'bg-orange-100 text-orange-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'arquivada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recebida':
        return <FileText className="w-4 h-4" />;
      case 'em_analise':
        return <Clock className="w-4 h-4" />;
      case 'em_investigacao':
        return <Search className="w-4 h-4" />;
      case 'concluida':
        return <CheckCircle className="w-4 h-4" />;
      case 'arquivada':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getEtapaStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'text-green-600 bg-green-50';
      case 'em_andamento':
        return 'text-blue-600 bg-blue-50';
      case 'pendente':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 via-white to-unodc-navy-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-800 transition-colors duration-200 group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Voltar ao início</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-unodc-blue-500 to-unodc-navy-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-unodc-navy-900 group-hover:text-unodc-blue-600 transition-colors duration-300">
                    Verificar Status da Denúncia
                  </h1>
                  <p className="text-sm text-gray-600">
                    Acompanhe o progresso da sua denúncia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Section */}
          <div className="px-8 py-8 border-b border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="codigoRastreio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Rastreio
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('codigoRastreio')}
                    type="text"
                    id="codigoRastreio"
                    placeholder="Digite o código de rastreio da sua denúncia"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {errors.codigoRastreio && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.codigoRastreio.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-unodc-blue-500 hover:bg-unodc-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Verificar Status
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-8 py-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {denuncia && (
            <div className="px-8 py-8">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-unodc-blue-50 to-unodc-navy-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-unodc-navy-900 mb-2">
                      Status da Denúncia
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Código: <span className="font-mono font-semibold">{denuncia.codigoRastreio}</span>
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(denuncia.status)}`}>
                        {getStatusIcon(denuncia.status)}
                        <span className="ml-2 capitalize">{denuncia.status.replace('_', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Criada em: {new Date(denuncia.dataCriacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-unodc-blue-600 bg-white border border-unodc-blue-200 rounded-lg hover:bg-unodc-blue-50 transition-colors duration-200"
                  >
                    {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso</span>
                  <span>{denuncia.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-unodc-blue-500 to-unodc-navy-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${denuncia.progresso}%` }}
                  ></div>
                </div>
              </div>

              {/* Details Section */}
              {showDetails && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-unodc-blue-600" />
                        Instituição de Origem
                      </h3>
                      <p className="text-sm text-gray-700">
                        {denuncia.instituicaoOrigem.nome} ({denuncia.instituicaoOrigem.sigla})
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-unodc-blue-600" />
                        Localização
                      </h3>
                      <p className="text-sm text-gray-700">
                        {denuncia.localizacao.bairro}, {denuncia.localizacao.distrito}, {denuncia.localizacao.provincia}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-unodc-blue-600" />
                      Descrição
                    </h3>
                    <p className="text-sm text-gray-700">{denuncia.descricao}</p>
                  </div>

                  {/* Trafficking Types */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Tipos de Tráfico Suspeito
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {denuncia.tipoTrafico.map((tipo, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-unodc-blue-100 text-unodc-blue-800"
                        >
                          {tipo.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Steps Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Etapas do Processo</h3>
                <div className="space-y-4">
                  {denuncia.etapas.map((etapa, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getEtapaStatusColor(etapa.status)}`}>
                        {etapa.status === 'concluida' && <CheckCircle className="w-4 h-4" />}
                        {etapa.status === 'em_andamento' && <Clock className="w-4 h-4" />}
                        {etapa.status === 'pendente' && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{etapa.nome}</h4>
                          {etapa.data && (
                            <span className="text-xs text-gray-500">
                              {new Date(etapa.data).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        {etapa.responsavel && (
                          <p className="text-xs text-gray-600 mt-1">
                            Responsável: {etapa.responsavel}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  FileText,
  Shield,
  Eye,
  Phone,
  Mail,
  Globe,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Scale
} from 'lucide-react';
import { denunciaService } from '@/services/denunciaService';
import { useAuth } from '@/hooks/useAuth';
import { PerfilUsuario, StatusDenuncia, Denuncia } from '@/types';

// Usar o tipo Denuncia do domínio para evitar divergências

export default function DetalheDenunciaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [denuncia, setDenuncia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados dos modais
  const [showObservacaoModal, setShowObservacaoModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [showSubmeterModal, setShowSubmeterModal] = useState(false);
  const [showConfirmarTraficoModal, setShowConfirmarTraficoModal] = useState(false);
  
  // Estados dos formulários
  const [observacao, setObservacao] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const carregarDenuncia = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await denunciaService.getDenunciaById(id);
        setDenuncia(response);
      } catch (error: any) {
        console.error('Erro ao carregar denúncia:', error);
        setError('Erro ao carregar detalhes da denúncia');
      } finally {
        setIsLoading(false);
      }
    };

    carregarDenuncia();
  }, [id]);

  // Função para adicionar observação
  const handleAdicionarObservacao = async () => {
    if (!observacao.trim() || !denuncia) return;
    
    try {
      setIsSubmitting(true);
      await denunciaService.adicionarObservacao(denuncia._id, {
        tipo: 'INTERNA',
        conteudo: observacao,
        visibilidade: 'INTERNA'
      });
      
      setObservacao('');
      setShowObservacaoModal(false);
      // Recarregar dados da denúncia
      const response = await denunciaService.getDenunciaById(denuncia._id);
      setDenuncia(response);
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para rejeitar caso
  const handleRejeitarCaso = async () => {
    if (!motivoRejeicao.trim() || !denuncia) return;
    
    try {
      setIsSubmitting(true);
      await denunciaService.updateStatus(denuncia._id, {
        status: 'DESCARTADA',
        observacoes: motivoRejeicao
      });
      
      setMotivoRejeicao('');
      setShowRejeitarModal(false);
      // Recarregar dados da denúncia
      const response = await denunciaService.getDenunciaById(denuncia._id);
      setDenuncia(response);
    } catch (error) {
      console.error('Erro ao rejeitar caso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para submeter para autoridade
  const handleSubmeter = async () => {
    if (!denuncia) return;
    
    try {
      setIsSubmitting(true);
      await denunciaService.updateStatus(denuncia._id, {
        status: 'SUBMETIDO_AUTORIDADE'
      });
      
      setShowSubmeterModal(false);
      // Recarregar dados da denúncia
      const response = await denunciaService.getDenunciaById(denuncia._id);
      setDenuncia(response);
    } catch (error) {
      console.error('Erro ao submeter caso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para confirmar tráfico humano (PGR)
  const handleConfirmarTrafico = async () => {
    if (!denuncia) return;
    
    try {
      setIsSubmitting(true);
      await denunciaService.updateStatus(denuncia._id, {
        status: 'TRAFICO_HUMANO_CONFIRMADO'
      });
      
      setShowConfirmarTraficoModal(false);
      // Recarregar dados da denúncia
      const response = await denunciaService.getDenunciaById(denuncia._id);
      setDenuncia(response);
    } catch (error) {
      console.error('Erro ao confirmar tráfico humano:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGUARDANDO_TRIAGEM':
        return 'bg-yellow-100 text-yellow-800';
      case 'EM_ANALISE':
        return 'bg-blue-100 text-blue-800';
      case 'SUBMETIDO_AUTORIDADE':
        return 'bg-green-100 text-green-800';
      case 'TRAFICO_HUMANO_CONFIRMADO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGUARDANDO_TRIAGEM':
        return <Clock className="w-4 h-4" />;
      case 'EM_ANALISE':
        return <AlertTriangle className="w-4 h-4" />;
      case 'SUBMETIDO_AUTORIDADE':
        return <Shield className="w-4 h-4" />;
      case 'TRAFICO_HUMANO_CONFIRMADO':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getNivelRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'ALTO':
        return 'bg-red-100 text-red-800';
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAIXO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-unodc-blue-500" />
      </div>
    );
  }

  if (error || !denuncia) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error || 'Denúncia não encontrada'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unodc-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes da Denúncia
            </h1>
            <p className="text-gray-600">
              Código: {denuncia.codigoRastreio}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(denuncia.status)}`}>
            {getStatusIcon(denuncia.status)}
            <span className="ml-1">{denuncia.status.replace('_', ' ')}</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNivelRiscoColor(denuncia.nivelRisco)}`}>
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Risco {denuncia.nivelRisco}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Básicos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Denúncia</label>
                <p className="text-sm text-gray-900">{denuncia.tipoDenuncia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Canal de Denúncia</label>
                <p className="text-sm text-gray-900">{denuncia.canalDenuncia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prioridade</label>
                <p className="text-sm text-gray-900">{denuncia.prioridade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Registro</label>
                <p className="text-sm text-gray-900">
                  {new Date(denuncia.dataRegistro).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Tipos de Tráfico</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {denuncia.tipoTrafico.map((tipo: any, index: number) => (
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

          {/* Localização */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Localização
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Província</label>
                <p className="text-sm text-gray-900">{denuncia.localizacao.provincia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Distrito</label>
                <p className="text-sm text-gray-900">{denuncia.localizacao.distrito}</p>
              </div>
              {denuncia.localizacao.bairro && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Bairro</label>
                  <p className="text-sm text-gray-900">{denuncia.localizacao.bairro}</p>
                </div>
              )}
              {(denuncia.localizacao as any).endereco && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Endereço</label>
                  <p className="text-sm text-gray-900">{(denuncia.localizacao as any).endereco}</p>
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Descrição do Caso
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {denuncia.descricao || 'Nenhuma descrição fornecida.'}
            </p>
            
            {denuncia.observacoesInternas && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Observações Internas</h3>
                {Array.isArray(denuncia.observacoesInternas) ? (
                  <div className="space-y-2">
                    {denuncia.observacoesInternas.map((obs: any, index: number) => (
                      <div key={index} className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{obs.tipo}</span>
                          <span className="text-xs text-gray-500">{new Date(obs.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p>{obs.texto}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{denuncia.observacoesInternas}</p>
                )}
              </div>
            )}
          </div>

          {/* Vítimas */}
          {denuncia.vitimas && denuncia.vitimas.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-unodc-blue-600" />
                Vítima{denuncia.vitimas.length > 1 ? 's' : ''} ({denuncia.vitimas.length})
              </h2>
              
              <div className="space-y-4">
                {denuncia.vitimas.map((vitima: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gênero</label>
                        <p className="text-sm text-gray-900">{vitima.genero}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Faixa Etária</label>
                        <p className="text-sm text-gray-900">{vitima.faixaEtaria}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nacionalidade</label>
                        <p className="text-sm text-gray-900">{vitima.nacionalidade}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Relação com a Vítima</label>
                        <p className="text-sm text-gray-900">{(vitima as any).relacaoVitima || '-'}</p>
                      </div>
                    </div>
                    {vitima.vulnerabilidade && vitima.vulnerabilidade.length > 0 && (
                      <div className="mt-3">
                        <label className="text-sm font-medium text-gray-500">Vulnerabilidades</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {vitima.vulnerabilidade.map((vuln: any, vulnIndex: number) => (
                            <span
                              key={vulnIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            >
                              {vuln.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspeitos */}
          {denuncia.suspeitos && denuncia.suspeitos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-unodc-blue-600" />
                Suspeito{denuncia.suspeitos.length > 1 ? 's' : ''} ({denuncia.suspeitos.length})
              </h2>
              
              <div className="space-y-4">
                {denuncia.suspeitos.map((suspeito: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(suspeito as any).nome && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Nome</label>
                          <p className="text-sm text-gray-900">{(suspeito as any).nome}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gênero</label>
                        <p className="text-sm text-gray-900">{(suspeito as any).genero}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Faixa Etária</label>
                        <p className="text-sm text-gray-900">{(suspeito as any).faixaEtaria}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nacionalidade</label>
                        <p className="text-sm text-gray-900">{(suspeito as any).nacionalidade}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Relação com a Vítima</label>
                        <p className="text-sm text-gray-900">{suspeito.relacaoVitima}</p>
                      </div>
                    </div>
                    {(suspeito as any).descricao && (
                      <div className="mt-3">
                        <label className="text-sm font-medium text-gray-500">Descrição</label>
                        <p className="text-sm text-gray-700 leading-relaxed">{(suspeito as any).descricao}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidências */}
          {denuncia.evidencias && denuncia.evidencias.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-unodc-blue-600" />
                Evidências ({denuncia.evidencias.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {denuncia.evidencias.map((evidencia: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {evidencia.nomeArquivo}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {evidencia.tipo}
                      </span>
                    </div>
                    {evidencia.url && (
                      <a
                        href={evidencia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-unodc-blue-600 hover:text-unodc-blue-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver arquivo
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações do Denunciante */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Denunciante
            </h2>
            
            {denuncia.denunciante?.anonimo ? (
              <div className="text-center py-4">
                <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Denúncia Anônima</p>
              </div>
            ) : (
              <div className="space-y-3">
                {denuncia.denunciante?.nome && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-sm text-gray-900">{denuncia.denunciante?.nome}</p>
                  </div>
                )}
                {denuncia.denunciante?.telefone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{denuncia.denunciante?.telefone}</span>
                  </div>
                )}
                {denuncia.denunciante?.localizacao && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{denuncia.denunciante?.localizacao}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Informações da Instituição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Instituição
            </h2>
            
            <div className="space-y-3">
              {denuncia.instituicaoOrigemId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Instituição de Origem</label>
                  <p className="text-sm text-gray-900">
                    {typeof denuncia.instituicaoOrigemId === 'object' && 'nome' in denuncia.instituicaoOrigemId
                      ? `${(denuncia.instituicaoOrigemId as any).nome} (${(denuncia.instituicaoOrigemId as any).sigla || ''})`
                      : 'Instituição não informada'}
                  </p>
                </div>
              )}
              {denuncia.usuarioCriadorId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Criado por</label>
                  <p className="text-sm text-gray-900">{typeof denuncia.usuarioCriadorId === 'object' && (denuncia.usuarioCriadorId as any).nome || '-'}</p>
                  <p className="text-xs text-gray-500">{typeof denuncia.usuarioCriadorId === 'object' && (denuncia.usuarioCriadorId as any).email || '-'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowObservacaoModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unodc-blue-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Adicionar Observação
              </button>
              <button 
                onClick={() => setShowRejeitarModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar Caso
              </button>
              <button 
                onClick={() => setShowSubmeterModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Shield className="w-4 h-4 mr-2" />
                Submeter para Autoridade
              </button>
              
              {/* Botão específico para PGR confirmar tráfico humano */}
              {user?.perfil === PerfilUsuario.AUTORIDADE && denuncia.status === 'SUBMETIDO_AUTORIDADE' && (
                <button 
                  onClick={() => setShowConfirmarTraficoModal(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Confirmar Tráfico Humano
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Observação */}
      {showObservacaoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adicionar Observação
              </h3>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Digite sua observação sobre o caso..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unodc-blue-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowObservacaoModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdicionarObservacao}
                  disabled={!observacao.trim() || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-unodc-blue-600 rounded-md hover:bg-unodc-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeitar Caso */}
      {showRejeitarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rejeitar Caso
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Por favor, forneça o motivo da rejeição:
              </p>
              <textarea
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                placeholder="Digite o motivo da rejeição..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRejeitarModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejeitarCaso}
                  disabled={!motivoRejeicao.trim() || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Rejeitando...' : 'Rejeitar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Submeter */}
      {showSubmeterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Submeter para Autoridade
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tem certeza que deseja submeter este caso para as autoridades competentes?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowSubmeterModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmeter}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submetendo...' : 'Confirmar Submissão'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Tráfico Humano */}
      {showConfirmarTraficoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-purple-600" />
                Confirmar Tráfico Humano
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>ATENÇÃO:</strong> Esta ação confirma que o caso é de tráfico humano e o encerra como <strong>TRAFICO_HUMANO_CONFIRMADO</strong>.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-md p-3 mb-4">
                <p className="text-sm text-purple-800">
                  <strong>Significado:</strong> O caso foi investigado, confirmado como tráfico humano, 
                  todas as evidências foram coletadas e o processo foi concluído com sucesso.
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Esta ação não pode ser desfeita. Tem certeza?
              </p>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowConfirmarTraficoModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarTrafico}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Tráfico Humano'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

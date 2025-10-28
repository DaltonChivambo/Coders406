import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { denunciaService } from '@/services/denunciaService';
import { TipoDenuncia, CanalDenuncia, TipoTrafico, Genero, FaixaEtaria, Vulnerabilidade, RelacaoVitima, StatusDenuncia, NivelRisco, Prioridade } from '@/types';
import { ArrowLeft, Plus, Minus, Upload, CheckCircle, Shield, AlertCircle, MapPin, Users, UserCheck, FileText, Loader2, Save, Send } from 'lucide-react';

const novaDenunciaSchema = z.object({
  tipoDenuncia: z.nativeEnum(TipoDenuncia),
  canalDenuncia: z.nativeEnum(CanalDenuncia),
  tipoTrafico: z.array(z.nativeEnum(TipoTrafico)).min(1, 'Selecione pelo menos um tipo de tráfico'),
  localizacao: z.object({
    provincia: z.string().min(1, 'Província é obrigatória'),
    distrito: z.string().min(1, 'Distrito é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    localEspecifico: z.string().min(1, 'Local específico é obrigatório'),
  }),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  contextoAdicional: z.string().optional(),
  comoFoiAbordada: z.object({
    canal: z.enum(['INTERNET', 'REDES_SOCIAIS', 'TELEFONE', 'WHATSAPP', 'PRESENCIAL', 'OUTROS']),
    plataforma: z.string().optional(),
    perfilSuspeito: z.string().optional(),
    linkPerfil: z.string().url().optional(),
    linkAnuncio: z.string().url().optional(),
    linkConversa: z.string().url().optional(),
    detalhesAbordagem: z.string().optional(),
  }).optional(),
  vitimas: z.array(z.object({
    genero: z.nativeEnum(Genero),
    faixaEtaria: z.nativeEnum(FaixaEtaria),
    nacionalidade: z.string().min(1, 'Nacionalidade é obrigatória'),
    vulnerabilidade: z.array(z.nativeEnum(Vulnerabilidade)),
  })).min(1, 'Adicione pelo menos uma vítima'),
  suspeitos: z.array(z.object({
    sexo: z.string().min(1, 'Sexo é obrigatório'),
    relacaoVitima: z.nativeEnum(RelacaoVitima),
    descricaoFisica: z.string().optional(),
  })).min(1, 'Adicione pelo menos um suspeito'),
  contatos: z.object({
    telefoneDenunciante: z.string().optional(),
    telefoneSuspeito: z.string().optional(),
    telefoneVitima: z.string().optional(),
    urls: z.array(z.string().url()).optional(),
    outrosContatos: z.string().optional(),
  }),
  evidencias: z.array(z.object({
    tipo: z.enum(['IMAGEM', 'VIDEO', 'AUDIO', 'DOCUMENTO', 'URL']),
    nomeArquivo: z.string(),
    url: z.string().optional(),
  })).optional(),
  denunciante: z.object({
    nome: z.string(),
    telefone: z.string(),
    localizacao: z.string(),
    anonimo: z.boolean(),
  }),
  // Campos específicos para operadores
  status: z.nativeEnum(StatusDenuncia).optional(),
  nivelRisco: z.nativeEnum(NivelRisco).optional(),
  prioridade: z.nativeEnum(Prioridade).optional(),
  observacoesInternas: z.string().optional(),
});

type NovaDenunciaFormData = z.infer<typeof novaDenunciaSchema>;

export default function NovaDenunciaPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [codigoRastreio, setCodigoRastreio] = useState<string>('');
  const [evidencias, setEvidencias] = useState<File[]>([]);
  const [abordagemOnlineAtiva, setAbordagemOnlineAtiva] = useState(false);
  const [denunciaAnonima, setDenunciaAnonima] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NovaDenunciaFormData>({
    resolver: zodResolver(novaDenunciaSchema),
    defaultValues: {
      tipoDenuncia: TipoDenuncia.INSTITUCIONAL_PRIVADA,
      canalDenuncia: CanalDenuncia.WEB,
      tipoTrafico: [],
      vitimas: [{ genero: Genero.NAO_INFORMADO, faixaEtaria: FaixaEtaria.ADULTO, nacionalidade: '', vulnerabilidade: [] }],
      suspeitos: [{ sexo: '', relacaoVitima: RelacaoVitima.DESCONHECIDO, descricaoFisica: '' }],
      contatos: { telefoneDenunciante: '', urls: [] },
      denunciante: { nome: '', telefone: '', localizacao: '', anonimo: false },
      status: StatusDenuncia.INCOMPLETA,
      nivelRisco: NivelRisco.MEDIO,
      prioridade: Prioridade.NORMAL,
    },
  });

  const vitimas = watch('vitimas');
  const suspeitos = watch('suspeitos');
  const tipoTrafico = watch('tipoTrafico');

  const addVitima = () => {
    setValue('vitimas', [...vitimas, { genero: Genero.NAO_INFORMADO, faixaEtaria: FaixaEtaria.ADULTO, nacionalidade: '', vulnerabilidade: [] }]);
  };

  const removeVitima = (index: number) => {
    if (vitimas.length > 1) {
      setValue('vitimas', vitimas.filter((_, i) => i !== index));
    }
  };

  const addSuspeito = () => {
    setValue('suspeitos', [...suspeitos, { sexo: '', relacaoVitima: RelacaoVitima.DESCONHECIDO, descricaoFisica: '' }]);
  };

  const removeSuspeito = (index: number) => {
    if (suspeitos.length > 1) {
      setValue('suspeitos', suspeitos.filter((_, i) => i !== index));
    }
  };

  const toggleTipoTrafico = (tipo: TipoTrafico) => {
    const current = tipoTrafico || [];
    if (current.includes(tipo)) {
      setValue('tipoTrafico', current.filter(t => t !== tipo));
    } else {
      setValue('tipoTrafico', [...current, tipo]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setEvidencias(prev => [...prev, ...files]);
    }
  };

  const removeEvidencia = (index: number) => {
    setEvidencias(prev => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): 'IMAGEM' | 'VIDEO' | 'AUDIO' | 'DOCUMENTO' => {
    if (file.type.startsWith('image/')) return 'IMAGEM';
    if (file.type.startsWith('video/')) return 'VIDEO';
    if (file.type.startsWith('audio/')) return 'AUDIO';
    return 'DOCUMENTO';
  };

  const onSubmit = async (data: NovaDenunciaFormData) => {
    try {
      setIsSubmitting(true);
      
      // Preparar dados da denúncia com evidências
      const denunciaData = {
        ...data,
        evidencias: evidencias.map(file => ({
          tipo: getFileType(file),
          nomeArquivo: file.name,
          url: undefined // Será preenchido após upload
        })),
        denunciante: {
          ...data.denunciante,
          anonimo: denunciaAnonima
        }
      };

      const response = await denunciaService.createDenuncia(denunciaData);
      setCodigoRastreio(response.codigoRastreio);
      setIsSuccess(true);
    } catch (error) {
      console.error('Erro ao criar denúncia:', error);
      alert('Erro ao criar denúncia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 via-white to-unodc-navy-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Denúncia Criada com Sucesso!
          </h1>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Código de Rastreio:</p>
            <p className="font-mono text-lg font-bold text-unodc-blue-600">
              {codigoRastreio}
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            A denúncia foi registrada no sistema e será processada pela equipe responsável.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setCodigoRastreio('');
                setEvidencias([]);
              }}
              className="w-full bg-unodc-blue-500 hover:bg-unodc-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Criar Nova Denúncia
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 via-white to-unodc-navy-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-800 transition-colors duration-200 group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Voltar ao Dashboard</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-unodc-blue-500 to-unodc-navy-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-unodc-navy-900 group-hover:text-unodc-blue-600 transition-colors duration-300">
                    Nova Denúncia
                  </h1>
                  <p className="text-sm text-gray-600">
                    Registre uma nova denúncia no sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Tipo de Denúncia */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Tipo de Denúncia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  {...register('tipoDenuncia')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                >
                  <option value={TipoDenuncia.INSTITUCIONAL_PRIVADA}>Institucional Privada</option>
                  <option value={TipoDenuncia.INTERNA_INVESTIGACAO}>Interna Investigação</option>
                </select>
                {errors.tipoDenuncia && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipoDenuncia.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal *
                </label>
                <select
                  {...register('canalDenuncia')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                >
                  <option value={CanalDenuncia.WEB}>Web</option>
                  <option value={CanalDenuncia.APP}>App</option>
                  <option value={CanalDenuncia.TELEFONE}>Telefone</option>
                  <option value={CanalDenuncia.WHATSAPP}>WhatsApp</option>
                  <option value={CanalDenuncia.PRESENCIAL}>Presencial</option>
                </select>
                {errors.canalDenuncia && (
                  <p className="mt-1 text-sm text-red-600">{errors.canalDenuncia.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status e Prioridade */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Status e Prioridade
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                >
                  <option value={StatusDenuncia.INCOMPLETA}>Incompleta</option>
                  <option value={StatusDenuncia.SUSPEITA}>Suspeita</option>
                  <option value={StatusDenuncia.PROVAVEL}>Provável</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Risco
                </label>
                <select
                  {...register('nivelRisco')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                >
                  <option value={NivelRisco.MINIMO}>Mínimo</option>
                  <option value={NivelRisco.BAIXO}>Baixo</option>
                  <option value={NivelRisco.MEDIO}>Médio</option>
                  <option value={NivelRisco.ALTO}>Alto</option>
                  <option value={NivelRisco.CRITICO}>Crítico</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  {...register('prioridade')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                >
                  <option value={Prioridade.BAIXA}>Baixa</option>
                  <option value={Prioridade.NORMAL}>Normal</option>
                  <option value={Prioridade.ALTA}>Alta</option>
                  <option value={Prioridade.URGENTE}>Urgente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tipo de Tráfico */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Tipo de Tráfico Suspeito *
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: TipoTrafico.SEXUAL, label: 'Tráfico Sexual', icon: '🚫' },
                { value: TipoTrafico.LABORAL, label: 'Tráfico Laboral', icon: '💼' },
                { value: TipoTrafico.ADOCAO_ILEGAL, label: 'Adoção Ilegal', icon: '👶' },
                { value: TipoTrafico.ORGAOS, label: 'Tráfico de Órgãos', icon: '🫀' },
                { value: TipoTrafico.SERVIDAO, label: 'Servidão', icon: '⛓️' },
                { value: TipoTrafico.MIGRACAO_FORCADA, label: 'Migração Forçada', icon: '✈️' }
              ].map((tipo) => (
                <label key={tipo.value} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-unodc-blue-300 hover:bg-unodc-blue-50 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tipoTrafico?.includes(tipo.value) || false}
                    onChange={() => toggleTipoTrafico(tipo.value)}
                    className="rounded border-gray-300 text-unodc-blue-600 focus:ring-unodc-blue-500 mr-3"
                  />
                  <span className="text-2xl mr-3">{tipo.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {tipo.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.tipoTrafico && (
              <p className="mt-3 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.tipoTrafico.message}
              </p>
            )}
          </div>

          {/* Localização */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Localização *
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Província *
                </label>
                <input
                  {...register('localizacao.provincia')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Ex: Maputo"
                />
                {errors.localizacao?.provincia && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao.provincia.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distrito *
                </label>
                <input
                  {...register('localizacao.distrito')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Ex: Maputo Cidade"
                />
                {errors.localizacao?.distrito && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao.distrito.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  {...register('localizacao.bairro')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Ex: Polana"
                />
                {errors.localizacao?.bairro && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao.bairro.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Específico *
                </label>
                <input
                  {...register('localizacao.localEspecifico')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Ex: Rua X, Casa Y"
                />
                {errors.localizacao?.localEspecifico && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao.localEspecifico.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Descrição da Denúncia *
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Descreva detalhadamente o que aconteceu, incluindo data, hora, pessoas envolvidas, etc."
                />
                {errors.descricao && (
                  <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contexto Adicional
                </label>
                <textarea
                  {...register('contextoAdicional')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                  placeholder="Informações adicionais que possam ser relevantes..."
                />
              </div>
            </div>
          </div>

          {/* Observações Internas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-unodc-blue-600" />
              Observações Internas
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações para a Equipe
              </label>
              <textarea
                {...register('observacoesInternas')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent"
                placeholder="Observações internas que não devem ser compartilhadas com o denunciante..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-unodc-blue-500 hover:bg-unodc-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Denúncia
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

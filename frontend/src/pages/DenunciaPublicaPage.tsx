import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { denunciaService } from '@/services/denunciaService';
import { TipoDenuncia, CanalDenuncia, TipoTrafico, Genero, FaixaEtaria, Vulnerabilidade, RelacaoVitima } from '@/types';
import { ArrowLeft, Plus, Minus, Upload, CheckCircle, Shield, AlertCircle, MapPin, Users, UserCheck, FileText, Loader2 } from 'lucide-react';

const denunciaSchema = z.object({
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
    plataforma: z.string().optional(), // Facebook, Instagram, etc.
    perfilSuspeito: z.string().optional(), // @usuario, nome do perfil
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
});

type DenunciaFormData = z.infer<typeof denunciaSchema>;

export default function DenunciaPublicaPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const [evidencias, setEvidencias] = useState<File[]>([]);
  const [abordagemOnlineAtiva, setAbordagemOnlineAtiva] = useState(false);
  const [denunciaAnonima, setDenunciaAnonima] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DenunciaFormData>({
    resolver: zodResolver(denunciaSchema),
    defaultValues: {
      tipoDenuncia: TipoDenuncia.PUBLICA,
      canalDenuncia: CanalDenuncia.WEB,
      tipoTrafico: [],
      vitimas: [{ genero: Genero.NAO_INFORMADO, faixaEtaria: FaixaEtaria.ADULTO, nacionalidade: '', vulnerabilidade: [] }],
      suspeitos: [{ sexo: '', relacaoVitima: RelacaoVitima.DESCONHECIDO, descricaoFisica: '' }],
      contatos: { telefoneDenunciante: '', urls: [] },
      denunciante: { nome: '', telefone: '', localizacao: '', anonimo: false },
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: DenunciaFormData) => {
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

      const response = await denunciaService.createDenunciaPublica(denunciaData);
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
      <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 to-unodc-navy-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-800 transition-colors duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Voltar ao início</span>
              </button>
            </div>

            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-2">
                  Denúncia Enviada!
                </h1>
                <p className="text-green-100 text-sm">
                  Sua denúncia foi registrada com sucesso
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-8">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-6">
                    Sua denúncia está sendo processada por nossa equipe especializada. 
                    Use o código abaixo para acompanhar o progresso.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Código de Rastreamento:</p>
                    <p className="text-2xl font-bold text-unodc-blue-600 font-mono">{codigoRastreio}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/relatorios-publicos')}
                    className="w-full bg-gradient-to-r from-unodc-blue-600 to-unodc-navy-600 hover:from-unodc-blue-700 hover:to-unodc-navy-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center">
                      <Shield className="h-5 w-5 mr-2" />
                      <span>Ver Relatórios Públicos</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    Voltar ao Início
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 to-unodc-navy-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-800 transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Voltar ao início</span>
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-unodc-blue-600 to-unodc-navy-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-unodc-navy-900 mb-4">
              Fazer Denúncia
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sua denúncia é importante para combater o tráfico humano. 
              Todas as informações são confidenciais e seguras.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Tipo de Tráfico */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-unodc-blue-600 mr-2" />
                <label className="text-lg font-semibold text-gray-900">
                  Tipo de Tráfico Suspeito *
                </label>
              </div>
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
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-unodc-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Localização do Incidente</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Província *
                  </label>
                  <input
                    {...register('localizacao.provincia')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ex: Maputo"
                  />
                  {errors.localizacao?.provincia && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.localizacao.provincia.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Distrito *
                  </label>
                  <input
                    {...register('localizacao.distrito')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ex: Maputo Cidade"
                  />
                  {errors.localizacao?.distrito && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.localizacao.distrito.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    {...register('localizacao.bairro')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ex: Sommerschield"
                  />
                  {errors.localizacao?.bairro && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.localizacao.bairro.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Local Específico *
                  </label>
                  <input
                    {...register('localizacao.localEspecifico')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ex: Rua da Liberdade, 123"
                  />
                  {errors.localizacao?.localEspecifico && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.localizacao.localEspecifico.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-unodc-blue-600 mr-2" />
                <label className="text-lg font-semibold text-gray-900">
                  Descrição do Incidente *
                </label>
              </div>
              <textarea
                {...register('descricao')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="Descreva detalhadamente o que aconteceu, incluindo data, hora, pessoas envolvidas e circunstâncias..."
              />
              {errors.descricao && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.descricao.message}
                </p>
              )}
            </div>

            {/* Evidências */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Upload className="h-5 w-5 text-unodc-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Evidências (Opcional)</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar Arquivos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-unodc-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="evidencias-upload"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  />
                  <label
                    htmlFor="evidencias-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 mb-1">
                      Clique para selecionar arquivos ou arraste aqui
                    </span>
                    <span className="text-xs text-gray-500">
                      Imagens, vídeos, áudios, documentos (máx. 10MB cada)
                    </span>
                  </label>
                </div>
              </div>

              {/* Lista de arquivos selecionados */}
              {evidencias.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Arquivos Selecionados:</h4>
                  {evidencias.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 bg-unodc-blue-100 rounded-lg flex items-center justify-center mr-3">
                          {getFileType(file) === 'IMAGEM' && <FileText className="h-4 w-4 text-unodc-blue-600" />}
                          {getFileType(file) === 'VIDEO' && <FileText className="h-4 w-4 text-unodc-blue-600" />}
                          {getFileType(file) === 'AUDIO' && <FileText className="h-4 w-4 text-unodc-blue-600" />}
                          {getFileType(file) === 'DOCUMENTO' && <FileText className="h-4 w-4 text-unodc-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {getFileType(file)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidencia(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                As evidências ajudam na investigação do caso. Você pode anexar fotos, vídeos, 
                áudios ou documentos relacionados ao incidente.
              </p>
            </div>

            {/* Abordagem Online */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Abordagem Online (Opcional)</h3>
                </div>
                
                <button
                  type="button"
                  onClick={() => setAbordagemOnlineAtiva(!abordagemOnlineAtiva)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-unodc-blue-500 focus:ring-offset-2 ${
                    abordagemOnlineAtiva ? 'bg-unodc-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      abordagemOnlineAtiva ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {abordagemOnlineAtiva 
                  ? 'A abordagem aconteceu através da internet ou redes sociais. Preencha os campos abaixo com as informações disponíveis.'
                  : 'Marque se a abordagem aconteceu através da internet, redes sociais, aplicativos de mensagem ou outros meios online.'
                }
              </p>

              {abordagemOnlineAtiva && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plataforma/App Utilizada
                    </label>
                    <select
                      {...register('comoFoiAbordada.canal')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Selecione a plataforma</option>
                      <option value="REDES_SOCIAIS">Redes Sociais (Facebook, Instagram, etc.)</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="TELEGRAM">Telegram</option>
                      <option value="INTERNET">Site/Blog/Fórum</option>
                      <option value="OUTROS">Outros aplicativos</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome da Plataforma
                      </label>
                      <input
                        {...register('comoFoiAbordada.plataforma')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Ex: Facebook, Instagram, Telegram, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Perfil/Usuário Suspeito
                      </label>
                      <input
                        {...register('comoFoiAbordada.perfilSuspeito')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Ex: @usuario123, nome do perfil"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link do Perfil Suspeito
                      </label>
                      <input
                        {...register('comoFoiAbordada.linkPerfil')}
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://facebook.com/perfil-suspeito"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link do Anúncio/Post Suspeito
                      </label>
                      <input
                        {...register('comoFoiAbordada.linkAnuncio')}
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://facebook.com/posts/anuncio-suspeito"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link da Conversa/Mensagem
                      </label>
                      <input
                        {...register('comoFoiAbordada.linkConversa')}
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://whatsapp.com/chat/conversa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detalhes da Abordagem Online
                    </label>
                    <textarea
                      {...register('comoFoiAbordada.detalhesAbordagem')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                      placeholder="Descreva como aconteceu a abordagem online, o que foi dito, promessas feitas, como iniciou o contato, etc."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Importante</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Estas informações são cruciais para rastrear e investigar casos de tráfico humano online. 
                          Salve prints, links e evidências antes de reportar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contatos e Informações de Contato */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-unodc-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Informações de Contato (Opcional)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone do Suspeito
                  </label>
                  <input
                    {...register('contatos.telefoneSuspeito')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+258 84 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone da Vítima
                  </label>
                  <input
                    {...register('contatos.telefoneVitima')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+258 84 987 6543"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Outros Contatos/Informações
                  </label>
                  <textarea
                    {...register('contatos.outrosContatos')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Outros números de telefone, emails, endereços, informações adicionais de contato..."
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Informações de contato ajudam na investigação e podem ser cruciais para localizar vítimas e suspeitos.
              </p>
            </div>

            {/* Vítimas */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Vítimas</h3>
                </div>
                <button
                  type="button"
                  onClick={addVitima}
                  className="inline-flex items-center px-4 py-2 border border-unodc-blue-300 text-unodc-blue-700 bg-white hover:bg-unodc-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Vítima
                </button>
              </div>
              {vitimas.map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="w-6 h-6 bg-unodc-blue-100 text-unodc-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                        {index + 1}
                      </span>
                      Vítima {index + 1}
                    </h4>
                    {vitimas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVitima(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gênero
                      </label>
                      <select
                        {...register(`vitimas.${index}.genero`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      >
                        <option value="NAO_INFORMADO">Não Informado</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMININO">Feminino</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Faixa Etária
                      </label>
                      <select
                        {...register(`vitimas.${index}.faixaEtaria`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      >
                        <option value="ADULTO">Adulto</option>
                        <option value="CRIANCA">Criança</option>
                        <option value="ADOLESCENTE">Adolescente</option>
                        <option value="IDOSO">Idoso</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nacionalidade
                      </label>
                      <input
                        {...register(`vitimas.${index}.nacionalidade`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Ex: Moçambicana"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suspeitos */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Suspeitos</h3>
                </div>
                <button
                  type="button"
                  onClick={addSuspeito}
                  className="inline-flex items-center px-4 py-2 border border-unodc-blue-300 text-unodc-blue-700 bg-white hover:bg-unodc-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Suspeito
                </button>
              </div>
              {suspeitos.map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                        {index + 1}
                      </span>
                      Suspeito {index + 1}
                    </h4>
                    {suspeitos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSuspeito(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sexo
                      </label>
                      <input
                        {...register(`suspeitos.${index}.sexo`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Ex: Masculino"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relação com a Vítima
                      </label>
                      <select
                        {...register(`suspeitos.${index}.relacaoVitima`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      >
                        <option value="DESCONHECIDO">Desconhecido</option>
                        <option value="FAMILIAR">Familiar</option>
                        <option value="VIZINHO">Vizinho</option>
                        <option value="RECRUTADOR">Recrutador</option>
                        <option value="EMPREGADOR">Empregador</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descrição Física
                      </label>
                      <input
                        {...register(`suspeitos.${index}.descricaoFisica`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Ex: Homem de meia-idade, altura média"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Denunciante */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Seus Dados (Opcional)</h3>
                </div>
                
                <button
                  type="button"
                  onClick={() => setDenunciaAnonima(!denunciaAnonima)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-unodc-blue-500 focus:ring-offset-2 ${
                    denunciaAnonima ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      denunciaAnonima ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {denunciaAnonima 
                  ? 'Sua denúncia será enviada de forma anônima. Nenhum dado pessoal será coletado.'
                  : 'Forneça seus dados para que possamos entrar em contato se necessário. Você pode manter a denúncia anônima se preferir.'
                }
              </p>

              {!denunciaAnonima && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        {...register('denunciante.nome')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Seu nome completo"
                      />
                      {errors.denunciante?.nome && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.denunciante.nome.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        {...register('denunciante.telefone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="+258 84 123 4567"
                      />
                      {errors.denunciante?.telefone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.denunciante.telefone.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Localização
                      </label>
                      <input
                        {...register('denunciante.localizacao')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Ex: Maputo, Moçambique"
                      />
                      {errors.denunciante?.localizacao && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.denunciante.localizacao.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Privacidade Garantida</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Seus dados pessoais são protegidos e usados apenas para contato sobre a denúncia. 
                          Você pode optar por manter a denúncia anônima a qualquer momento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {denunciaAnonima && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800">Denúncia Anônima</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Sua denúncia será processada de forma completamente anônima. 
                        Nenhum dado pessoal será coletado ou armazenado.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-unodc-blue-600 to-unodc-navy-600 hover:from-unodc-blue-700 hover:to-unodc-navy-700 text-white font-semibold py-4 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Enviando Denúncia...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Enviar Denúncia</span>
                  </div>
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Ao enviar esta denúncia, você concorda com os termos de uso e confirma que as informações são verdadeiras.
              </p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

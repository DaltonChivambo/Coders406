import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle, CheckCircle, XCircle, Loader2, Shield, AlertCircle, Briefcase, MapPin, DollarSign, Clock, Users, FileText } from 'lucide-react';

const oportunidadeSchema = z.object({
  titulo: z.string().min(1, 'Título da oportunidade é obrigatório'),
  empresa: z.string().min(1, 'Nome da empresa/organização é obrigatório'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  requisitos: z.string().min(5, 'Requisitos devem ser informados'),
  remuneracao: z.string().optional(),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  tipoOportunidade: z.enum(['EMPREGO', 'ESTAGIO', 'VOLUNTARIADO', 'CURSO', 'BOLSA_ESTUDO', 'NEGOCIO', 'OUTROS']),
  beneficios: z.string().optional(),
  contato: z.string().min(1, 'Informações de contato são obrigatórias'),
  plataforma: z.string().min(1, 'Plataforma onde encontrou a oportunidade é obrigatória'),
  linkOportunidade: z.string().url().optional(),
});

type OportunidadeFormData = z.infer<typeof oportunidadeSchema>;

interface AnaliseResultado {
  nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  pontuacao: number;
  alertas: string[];
  recomendacoes: string[];
  detalhes: {
    tituloSuspeito: boolean;
    empresaSuspeita: boolean;
    descricaoVaga: boolean;
    requisitosVagos: boolean;
    salarioIrreal: boolean;
    contatoSuspeito: boolean;
    plataformaSuspeita: boolean;
  };
}

export default function VerificarOportunidadePage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultado, setResultado] = useState<AnaliseResultado | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OportunidadeFormData>({
    resolver: zodResolver(oportunidadeSchema),
  });

  const analisarOportunidade = async (data: OportunidadeFormData): Promise<AnaliseResultado> => {
    // Simulação de análise baseada em regras
    const alertas: string[] = [];
    const recomendacoes: string[] = [];
    let pontuacao = 0;

    const detalhes = {
      tituloSuspeito: false,
      empresaSuspeita: false,
      descricaoVaga: false,
      requisitosVagos: false,
      salarioIrreal: false,
      contatoSuspeito: false,
      plataformaSuspeita: false,
    };

    // Análise do título
    const palavrasSuspeitasTitulo = ['modelo', 'garota', 'garoto', 'acompanhante', 'massagem', 'trabalho fácil', 'ganhe muito'];
    if (palavrasSuspeitasTitulo.some(palavra => data.titulo.toLowerCase().includes(palavra))) {
      alertas.push('Título contém palavras suspeitas relacionadas a exploração');
      detalhes.tituloSuspeito = true;
      pontuacao += 30;
    }

    // Análise da empresa
    if (data.empresa.length < 3 || !data.empresa.includes(' ')) {
      alertas.push('Nome da empresa muito genérico ou suspeito');
      detalhes.empresaSuspeita = true;
      pontuacao += 20;
    }

    // Análise da descrição
    const palavrasSuspeitasDescricao = ['viagem', 'estrangeiro', 'sem experiência', 'trabalho noturno', 'acompanhamento'];
    if (palavrasSuspeitasDescricao.some(palavra => data.descricao.toLowerCase().includes(palavra))) {
      alertas.push('Descrição contém elementos suspeitos');
      detalhes.descricaoVaga = true;
      pontuacao += 25;
    }

    // Análise dos requisitos
    if (data.requisitos.length < 20) {
      alertas.push('Requisitos muito vagos ou genéricos');
      detalhes.requisitosVagos = true;
      pontuacao += 15;
    }

    // Análise da remuneração
    if (data.remuneracao) {
      const remuneracaoNumerica = parseFloat(data.remuneracao.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (remuneracaoNumerica > 10000) {
        alertas.push('Remuneração muito alta para o tipo de oportunidade');
        detalhes.salarioIrreal = true;
        pontuacao += 20;
      }
    }

    // Análise do contato
    if (data.contato.includes('WhatsApp') && !data.contato.includes('@')) {
      alertas.push('Contato apenas por WhatsApp pode ser suspeito');
      detalhes.contatoSuspeito = true;
      pontuacao += 15;
    }

    // Análise da plataforma
    const plataformasSuspeitas = ['facebook', 'instagram', 'telegram', 'grupo whatsapp'];
    if (plataformasSuspeitas.some(plataforma => data.plataforma.toLowerCase().includes(plataforma))) {
      alertas.push('Plataforma não profissional para ofertas de oportunidades');
      detalhes.plataformaSuspeita = true;
      pontuacao += 20;
    }

    // Determinar nível de risco
    let nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
    if (pontuacao >= 80) {
      nivelRisco = 'CRITICO';
    } else if (pontuacao >= 60) {
      nivelRisco = 'ALTO';
    } else if (pontuacao >= 30) {
      nivelRisco = 'MEDIO';
    } else {
      nivelRisco = 'BAIXO';
    }

    // Gerar recomendações
    if (nivelRisco === 'CRITICO' || nivelRisco === 'ALTO') {
      recomendacoes.push('NÃO aceite esta oportunidade sem verificação adicional');
      recomendacoes.push('Procure informações sobre a empresa/organização em sites oficiais');
      recomendacoes.push('Peça documentos da empresa antes de qualquer compromisso');
      recomendacoes.push('Se suspeitar de tráfico humano, faça uma denúncia');
    } else if (nivelRisco === 'MEDIO') {
      recomendacoes.push('Seja cauteloso e peça mais informações');
      recomendacoes.push('Verifique a empresa/organização em sites oficiais');
      recomendacoes.push('Peça para conhecer o local de trabalho/atividade');
    } else {
      recomendacoes.push('Oportunidade parece legítima, mas sempre seja cauteloso');
      recomendacoes.push('Verifique informações da empresa/organização');
    }

    return {
      nivelRisco,
      pontuacao,
      alertas,
      recomendacoes,
      detalhes,
    };
  };

  const onSubmit = async (data: OportunidadeFormData) => {
    try {
      setIsAnalyzing(true);
      
      // Simular tempo de análise
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resultado = await analisarOportunidade(data);
      setResultado(resultado);
    } catch (error) {
      console.error('Erro ao analisar oportunidade:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return 'text-red-600 bg-red-50 border-red-200';
      case 'ALTO': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIO': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'BAIXO': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiscoIcon = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return <XCircle className="h-6 w-6" />;
      case 'ALTO': return <AlertTriangle className="h-6 w-6" />;
      case 'MEDIO': return <AlertCircle className="h-6 w-6" />;
      case 'BAIXO': return <CheckCircle className="h-6 w-6" />;
      default: return <AlertCircle className="h-6 w-6" />;
    }
  };

  if (resultado) {
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
                  <Search className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-unodc-navy-900 mb-4">
                Análise de Risco Concluída
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Aqui está o resultado da análise da oportunidade que você verificou.
              </p>
            </div>

            {/* Resultado */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header do Resultado */}
              <div className={`px-8 py-8 text-center border-b ${getRiscoColor(resultado.nivelRisco)}`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getRiscoColor(resultado.nivelRisco)}`}>
                    {getRiscoIcon(resultado.nivelRisco)}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  Risco {resultado.nivelRisco}
                </h2>
                <p className="text-lg">
                  Pontuação: {resultado.pontuacao}/100
                </p>
              </div>

              {/* Conteúdo */}
              <div className="px-8 py-8 space-y-6">
                {/* Alertas */}
                {resultado.alertas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Alertas Encontrados
                    </h3>
                    <div className="space-y-2">
                      {resultado.alertas.map((alerta, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-700">{alerta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendações */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-unodc-blue-600 mr-2" />
                    Recomendações
                  </h3>
                  <div className="space-y-2">
                    {resultado.recomendacoes.map((recomendacao, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">{recomendacao}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detalhes da Análise */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    Detalhes da Análise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(resultado.detalhes).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg border ${value ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <p className={`text-sm font-medium ${value ? 'text-red-700' : 'text-green-700'}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: 
                          {value ? ' Suspeito' : ' OK'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate('/denuncia-publica')}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span>Fazer Denúncia</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setResultado(null)}
                      className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      Verificar Outra Oportunidade
                    </button>
                  </div>
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
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-unodc-navy-900 mb-4">
              Verificar Oportunidade
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Analise uma oportunidade de emprego, estágio, curso ou negócio para identificar possíveis riscos de tráfico humano ou golpes.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Informações da Oportunidade</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Título da Oportunidade *
                    </label>
                    <input
                      {...register('titulo')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: Assistente Administrativo, Curso de Inglês, etc."
                    />
                    {errors.titulo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.titulo.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Empresa/Organização *
                    </label>
                    <input
                      {...register('empresa')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: Empresa ABC Ltda, Instituto XYZ, etc."
                    />
                    {errors.empresa && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.empresa.message}
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
                    Descrição da Oportunidade *
                  </label>
                </div>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Descreva as atividades, responsabilidades e características da oportunidade..."
                />
                {errors.descricao && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              {/* Requisitos */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <label className="text-lg font-semibold text-gray-900">
                    Requisitos *
                  </label>
                </div>
                <textarea
                  {...register('requisitos')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Experiência necessária, formação, habilidades, etc..."
                />
                {errors.requisitos && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.requisitos.message}
                  </p>
                )}
              </div>

              {/* Detalhes Adicionais */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Detalhes Adicionais</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Remuneração/Benefícios Financeiros
                    </label>
                    <input
                      {...register('remuneracao')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: R$ 2.500,00, Bolsa de estudos, Gratuito"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Localização *
                    </label>
                    <input
                      {...register('localizacao')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: Maputo, Moçambique"
                    />
                    {errors.localizacao && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.localizacao.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Oportunidade *
                    </label>
                    <select
                      {...register('tipoOportunidade')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="EMPREGO">Emprego</option>
                      <option value="ESTAGIO">Estágio</option>
                      <option value="VOLUNTARIADO">Voluntariado</option>
                      <option value="CURSO">Curso/Treinamento</option>
                      <option value="BOLSA_ESTUDO">Bolsa de Estudo</option>
                      <option value="NEGOCIO">Oportunidade de Negócio</option>
                      <option value="OUTROS">Outros</option>
                    </select>
                    {errors.tipoOportunidade && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.tipoOportunidade.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Benefícios
                    </label>
                    <input
                      {...register('beneficios')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: Vale refeição, plano de saúde"
                    />
                  </div>
                </div>
              </div>

              {/* Contato e Plataforma */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-unodc-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Contato e Origem</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Informações de Contato *
                    </label>
                    <textarea
                      {...register('contato')}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Email, telefone, WhatsApp, etc..."
                    />
                    {errors.contato && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.contato.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plataforma onde encontrou *
                    </label>
                    <input
                      {...register('plataforma')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Ex: LinkedIn, Indeed, Facebook, site da empresa"
                    />
                    {errors.plataforma && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.plataforma.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Link da Oportunidade
                    </label>
                    <input
                      {...register('linkOportunidade')}
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="https://exemplo.com/oportunidade"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-unodc-blue-600 to-unodc-navy-600 hover:from-unodc-blue-700 hover:to-unodc-navy-700 text-white font-semibold py-4 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>Analisando Oportunidade...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Search className="h-5 w-5 mr-2" />
                      <span>Analisar Risco da Oportunidade</span>
                    </div>
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Esta análise é baseada em padrões conhecidos de tráfico humano e golpes. 
                  Sempre seja cauteloso e verifique informações adicionais.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

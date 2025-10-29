import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { ArrowLeft, Eye, EyeOff, Loader2, Shield, Building2, Mail, Lock, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  instituicaoId: z.string().min(1, 'Digite o código da instituição'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      console.log('🔍 Dados do formulário:', JSON.stringify(data, null, 2));
      
      // Garantir que instituicaoId seja maiúsculo
      const loginData = {
        ...data,
        instituicaoId: data.instituicaoId.toUpperCase()
      };
      
      console.log('🔍 Dados corrigidos:', JSON.stringify(loginData, null, 2));
      
      const response = await authService.login(loginData);
      console.log('✅ Resposta do login:', response);
      
      // Mapear os dados do usuário para o formato esperado pelo useAuth
      const userData = {
        id: response.user.id,
        nome: response.user.nome,
        email: response.user.email,
        perfil: response.user.perfil,
        instituicaoId: response.user.instituicao.id,
        instituicaoNome: response.user.instituicao.nome,
        ativo: response.user.ativo
      };
      
      login(userData, response.token);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      console.error('❌ Status do erro:', error.response?.status);
      
      if (error.response?.status === 401) {
        setError('root', {
          type: 'manual',
          message: 'Credenciais inválidas. Verifique seu email, senha e código da instituição.',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Erro ao fazer login. Tente novamente.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link 
              to="/" 
              className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-800 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Voltar ao início</span>
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-unodc-blue-600 to-unodc-navy-600 px-8 py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                HUMAI
              </h1>
              <p className="text-blue-100 text-sm">
                Sistema de Monitoramento de Tráfico Humano
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-unodc-navy-900 mb-2">
                  Acesso Institucional
                </h2>
                <p className="text-gray-600 text-sm">
                  Entre com suas credenciais para acessar o sistema
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Institucional
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="seu@instituicao.org.mz"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('senha')}
                      type={showPassword ? 'text' : 'password'}
                      id="senha"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                {/* Código da Instituição */}
                <div>
                  <label htmlFor="instituicaoId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Código da Instituição
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('instituicaoId')}
                      type="text"
                      id="instituicaoId"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unodc-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white uppercase"
                      placeholder="Ex: HUMAI1, ONG001, PGR001"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  {errors.instituicaoId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.instituicaoId.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Digite o código de 6 caracteres da sua instituição
                  </p>
                </div>

                {/* Erro geral */}
                {errors.root && (
                  <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errors.root.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-unodc-blue-600 to-unodc-navy-600 hover:from-unodc-blue-700 hover:to-unodc-navy-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="h-5 w-5 mr-2" />
                      <span>Acessar Sistema</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Não tem uma conta institucional?
                  </p>
                  <p className="text-xs text-gray-500">
                    Entre em contato com o administrador da sua instituição
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <h3 className="text-unodc-navy-900 font-semibold mb-2 text-sm">Precisa de Ajuda?</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p className="flex items-center justify-center">
                  <span className="mr-2">📞</span>
                  +258 21 123 456
                </p>
                <p className="flex items-center justify-center">
                  <span className="mr-2">📧</span>
                  suporte@humai.org.mz
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Shield, Users, BarChart3, FileText, ArrowRight, Globe, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 via-white to-unodc-navy-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-unodc-blue-500 to-unodc-navy-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-unodc-navy-900 group-hover:text-unodc-blue-600 transition-colors duration-300">
                SafePath
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/relatorios-publicos"
                className="text-gray-600 hover:text-unodc-blue-600 font-medium text-sm transition-colors duration-200 relative group flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Relatórios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-unodc-blue-500 group-hover:w-full transition-all duration-200"></span>
              </Link>
              
              <a
                href="http://145.241.188.248/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-unodc-blue-600 font-medium text-sm transition-colors duration-200 relative group flex items-center"
              >
                <FileText className="w-4 h-4 mr-1" />
                Verificar Oportunidade
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-unodc-blue-500 group-hover:w-full transition-all duration-200"></span>
              </a>
              
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-unodc-blue-500 hover:bg-unodc-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Entrar
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/relatorios-publicos"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Link>
              
              <a
                href="http://145.241.188.248/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Verificar Oportunidade
              </a>

              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-unodc-blue-500 hover:bg-unodc-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 lg:px-6 lg:py-3 rounded-full bg-unodc-blue-100 text-unodc-blue-700 text-sm lg:text-base font-medium mb-6 lg:mb-8">
              <Globe className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Plataforma Oficial de Monitoramento
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-unodc-navy-900 mb-4 lg:mb-6 leading-tight">
              Combate ao
              <span className="block bg-gradient-to-r from-unodc-blue-500 to-unodc-navy-500 bg-clip-text text-transparent mt-1">
                Tráfico Humano
              </span>
              em Moçambique
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-unodc-navy-600 mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema integrado para denúncias e monitoramento de casos de tráfico humano, 
              conectando instituições e cidadãos na luta contra este crime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
              <Link
                to="/denuncia-publica"
                className="group relative inline-flex items-center justify-center px-6 lg:px-8 py-4 lg:py-5 text-sm lg:text-base font-semibold text-white bg-gradient-to-r from-unodc-blue-500 to-unodc-blue-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-unodc-blue-600 to-unodc-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10" />
                <span className="relative z-10">Fazer Denúncia</span>
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/relatorios-publicos"
                className="group relative inline-flex items-center justify-center px-6 lg:px-8 py-4 lg:py-5 text-sm lg:text-base font-semibold text-unodc-navy-900 bg-gradient-to-r from-unodc-navy-100 to-unodc-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-unodc-navy-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-unodc-navy-200 to-unodc-blue-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10" />
                <span className="relative z-10">Ver Relatórios Públicos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-unodc-navy-900 mb-3 lg:mb-4">
              Como Funciona o Sistema
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-unodc-navy-600 max-w-3xl mx-auto leading-relaxed">
              Plataforma integrada que conecta cidadãos, escolas, hospitais, igrejas e autoridades. 
              As denúncias públicas são enviadas diretamente às autoridades, que atualizam o status (Em investigação, Arquivado ou Tráfico humano confirmado).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-unodc-blue-100">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-unodc-blue-500 to-unodc-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FileText className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-unodc-navy-900 mb-3 text-center">
                Denúncias e Relatórios
              </h3>
              <p className="text-unodc-navy-600 text-center leading-relaxed text-xs lg:text-sm">
                Cidadãos podem denunciar de forma anônima e segura. Organizações (escolas, hospitais, igrejas, ONGs)
                também registram ocorrências. As denúncias públicas seguem direto para as autoridades competentes,
                que passam a conduzir o caso e a atualizar o status oficial.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-unodc-navy-100">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-unodc-navy-500 to-unodc-navy-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-unodc-navy-900 mb-3 text-center">
                Colaboração Institucional
              </h3>
              <p className="text-unodc-navy-600 text-center leading-relaxed text-xs lg:text-sm">
                As instituições compartilham informações essenciais de forma segura e com acesso controlado.
                Os casos são encaminhados rapidamente às autoridades, que centralizam a atualização de status
                (Em investigação, Arquivado, Tráfico humano confirmado) e o histórico de ações.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-unodc-green-100 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-unodc-green-500 to-unodc-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-unodc-navy-900 mb-3 text-center">
                Transparência e Acompanhamento
              </h3>
              <p className="text-unodc-navy-600 text-center leading-relaxed text-xs lg:text-sm">
                Relatórios públicos com dados anonimizados por província, distrito, tipo de instituição e tipo de tráfico.
                Acompanhe indicadores, casos confirmados e estatísticas atualizadas sem expor vítimas ou investigações em curso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data + IA Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-white to-unodc-blue-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
            <h3 className="text-xl lg:text-2xl font-bold text-unodc-navy-900 mb-4 lg:mb-6">
              Dados e IA para Prevenir o Tráfico Humano
            </h3>
            <div className="space-y-4 text-unodc-navy-700 text-sm lg:text-base leading-relaxed">
              <p>
                Se com dados é possível prever onde vai chover, também é possível identificar
                <span className="font-semibold"> onde e quando pode ocorrer tráfico humano</span>.
              </p>
              <p>
                Mas mesmo com a melhor tecnologia ou o modelo mais avançado,
                <span className="font-semibold"> sem dados confiáveis, não há soluções confiáveis</span>.
              </p>
              <p>
                Por isso, unimos o poder da <span className="font-semibold">centralização de dados</span> com a
                <span className="font-semibold"> inteligência artificial</span>, criando uma base sólida para
                <span className="font-semibold"> prever, prevenir e proteger vidas</span>.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-unodc-blue-100 bg-unodc-blue-50/40 p-4">
                  <p className="text-xs text-unodc-blue-700 font-semibold">Centralização</p>
                  <p className="text-sm text-unodc-navy-800">Denúncias públicas e institucionais em um só lugar</p>
                </div>
                <div className="rounded-xl border border-unodc-navy-100 bg-unodc-navy-50/40 p-4">
                  <p className="text-xs text-unodc-navy-700 font-semibold">Inteligência</p>
                  <p className="text-sm text-unodc-navy-800">Análises por província, distrito e padrões de risco</p>
                </div>
                <div className="rounded-xl border border-unodc-green-100 bg-unodc-green-50/40 p-4">
                  <p className="text-xs text-unodc-green-700 font-semibold">Proteção</p>
                  <p className="text-sm text-unodc-navy-800">Apoio às autoridades para resposta mais rápida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-unodc-blue-700 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 rounded-full bg-white/10 text-white text-sm lg:text-base font-medium mb-8 lg:mb-10">
            <Heart className="w-5 h-5 lg:w-6 lg:h-6 mr-3" />
            Junte-se à Nossa Missão
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 lg:mb-8 leading-tight">
            Sua Voz Pode
            <span className="block text-white mt-2">
              Salvar Vidas
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-8 lg:mb-12 leading-relaxed max-w-4xl mx-auto">
            Sua denúncia pode fazer a diferença. Cada informação é valiosa para combater o tráfico humano. 
            <span className="text-white font-semibold"> Faça parte da solução</span> e ajude-nos a 
            construir um Moçambique mais seguro para todos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center">
            <Link
              to="/denuncia-publica"
              className="group relative inline-flex items-center justify-center px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-bold text-unodc-navy-900 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              <FileText className="w-6 h-6 lg:w-7 lg:h-7 mr-3" />
              <span>Fazer Denúncia Agora</span>
            </Link>
            
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-bold text-white border-2 border-white/30 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:bg-white/10 hover:border-white/50"
            >
              <span>Acesso Institucional</span>
            </Link>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-unodc-navy-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-unodc-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">SafePath</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="/denuncia-publica" className="text-gray-300 hover:text-white transition-colors">
                Fazer Denúncia
              </Link>
              <Link to="/relatorios-publicos" className="text-gray-300 hover:text-white transition-colors">
                Relatórios Públicos
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Acesso Institucional
              </Link>
              <a
                href="https://github.com/DaltonChivambo/Coders406"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Código-fonte
              </a>
              <a
                href="https://github.com/DaltonChivambo/Coders406"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Documentação
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-xs">
            <p>&copy; 2024 SafePath</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
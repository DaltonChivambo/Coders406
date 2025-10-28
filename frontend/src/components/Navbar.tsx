import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, Bell, User, LogOut, FileText, BarChart3, Home, Search } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <div className="flex items-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-unodc-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm lg:text-base">H</span>
                </div>
                <span className="ml-2 text-lg lg:text-xl font-bold text-unodc-navy-900">
                  HUMAI
                </span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Usuário logado
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                  >
                    <Bell className="h-6 w-6" />
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-unodc-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notificações
                        </h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">
                            Nova denúncia recebida
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            há 2 minutos
                          </p>
                        </div>
                        <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">
                            Caso crítico requer atenção
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            há 1 hora
                          </p>
                        </div>
                        <div className="p-4 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">
                            Transferência confirmada
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            há 3 horas
                          </p>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm text-unodc-blue-500 hover:text-unodc-blue-600">
                          Ver todas as notificações
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <div className="w-8 h-8 bg-unodc-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-unodc-blue-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.nome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.instituicao.nome}
                      </p>
                    </div>
                  </button>

                  {/* User dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.nome}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email}
                        </p>
                        <p className="text-xs text-unodc-blue-600 mt-1">
                          {user?.perfil.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Meu Perfil
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Configurações
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Ajuda
                        </button>
                      </div>
                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Usuário não logado
              <div className="flex items-center space-x-2">
                {/* Navigation links */}
                <Link
                  to="/"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Link>
                
                <Link
                  to="/denuncia-publica"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Fazer Denúncia
                </Link>
                
                <Link
                  to="/verificar-oportunidade"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Verificar Oportunidade
                </Link>
                
                <Link
                  to="/relatorios-publicos"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-unodc-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios Públicos
                </Link>

                {/* Login button */}
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-unodc-blue-500 hover:bg-unodc-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

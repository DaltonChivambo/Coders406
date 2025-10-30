import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Search, 
  BarChart3, 
  Users, 
  Settings, 
  Shield,
  Eye,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Building2,
  X
} from 'lucide-react';
import { PerfilUsuario } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: PerfilUsuario;
}

export default function Sidebar({ isOpen, onClose, userProfile }: SidebarProps) {
  const location = useLocation();

  // Menu items baseado no perfil do usuário
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Rastrear Caso', href: '/rastreio', icon: Search },
    ];

    switch (userProfile) {
      case PerfilUsuario.OPERADOR:
        return [
          ...baseItems,
          { name: 'Nova Denúncia', href: '/dashboard/denuncias/nova', icon: FileText },
          { name: 'Minhas Denúncias', href: '/dashboard/denuncias/minhas', icon: ClipboardList },
        ];

        case PerfilUsuario.ANALISTA:
          return [
            ...baseItems,
            { name: 'Denúncias por Analisar', href: '/dashboard/analise/pendentes', icon: AlertTriangle },
            { name: 'Denúncias Submetidas', href: '/dashboard/analise/submetidas', icon: Shield },
          ];

      case PerfilUsuario.AUTORIDADE:
        return [
          ...baseItems,
          { name: 'Casos Submetidos', href: '/dashboard/autoridade/submetidos', icon: Eye },
          { name: 'Em Investigação', href: '/dashboard/autoridade/investigacao', icon: AlertTriangle },
          { name: 'Atualizar Status', href: '/dashboard/autoridade/atualizar', icon: UserCheck },
        ];

      case PerfilUsuario.GESTOR_SISTEMA:
        return [
          ...baseItems,
          { name: 'Todas as Denúncias', href: '/dashboard/gestao/denuncias', icon: FileText },
          { name: 'Instituições', href: '/dashboard/gestao/instituicoes', icon: Building2 },
          { name: 'Usuários', href: '/dashboard/gestao/usuarios', icon: Users },
          { name: 'Relatórios', href: '/dashboard/gestao/relatorios', icon: BarChart3 },
          { name: 'Configurações', href: '/dashboard/gestao/configuracoes', icon: Settings },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  // Adicionar itens comuns a todos os perfis
  const commonItems = [
    { name: 'Repositório Público', href: '/repositorio', icon: FileText },
  ];

  const allMenuItems = [...menuItems, ...commonItems];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 lg:h-20 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-unodc-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-base">H</span>
            </div>
            <span className="ml-2 text-lg lg:text-xl font-bold text-unodc-navy-900">
              HUMAI
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {allMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-unodc-blue-100 text-unodc-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-unodc-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-sm border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-unodc-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="ml-2 text-xl font-bold text-unodc-navy-900">
                HUMAI
              </span>
            </div>
          </div>

          <nav className="mt-5 flex-1 px-2 pb-4">
            <div className="space-y-1">
              {allMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-unodc-blue-100 text-unodc-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-unodc-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

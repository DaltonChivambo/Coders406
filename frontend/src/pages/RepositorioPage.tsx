import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, MapPin, Users, Shield } from 'lucide-react';
import { formatDate } from '@/utils/format';

export default function RepositorioPage() {
  const [casos, setCasos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipoTrafico: '',
    provincia: '',
    ano: '',
    status: '',
  });

  // Dados mockados para demonstração
  useEffect(() => {
    const mockCasos = [
      {
        id: '1',
        codigo: 'HUMAI-ABC123',
        tipoTrafico: ['SEXUAL'],
        provincia: 'Maputo',
        distrito: 'Maputo Cidade',
        dataRegistro: '2024-01-15T10:30:00Z',
        dataEncerramento: '2024-02-15T14:20:00Z',
        status: 'ENCERRADO_AUTORIDADE',
        resultado: 'Caso resolvido com sucesso. Vítima resgatada e suspeito preso.',
        vitimasResgatadas: 1,
        autoridadesEnvolvidas: ['Polícia de Investigação Criminal', 'Ministério da Justiça'],
        nivelVisibilidade: 'TODAS_AGENCIAS',
      },
      {
        id: '2',
        codigo: 'HUMAI-DEF456',
        tipoTrafico: ['LABORAL'],
        provincia: 'Nampula',
        distrito: 'Nampula Cidade',
        dataRegistro: '2024-01-10T08:15:00Z',
        dataEncerramento: '2024-02-20T16:45:00Z',
        status: 'ENCERRADO_AUTORIDADE',
        resultado: 'Trabalho forçado identificado e interrompido. Vítimas resgatadas.',
        vitimasResgatadas: 3,
        autoridadesEnvolvidas: ['Inspeção do Trabalho', 'Procuradoria da República'],
        nivelVisibilidade: 'TODAS_AGENCIAS',
      },
      {
        id: '3',
        codigo: 'HUMAI-GHI789',
        tipoTrafico: ['ADOCAO_ILEGAL'],
        provincia: 'Sofala',
        distrito: 'Beira',
        dataRegistro: '2024-01-05T12:00:00Z',
        dataEncerramento: '2024-02-10T10:30:00Z',
        status: 'ENCERRADA_SEM_PROCEDENCIA',
        resultado: 'Investigação concluída. Não foi encontrada evidência de tráfico.',
        vitimasResgatadas: 0,
        autoridadesEnvolvidas: ['Serviços de Proteção Social'],
        nivelVisibilidade: 'COORDENADORA',
      },
    ];

    setTimeout(() => {
      setCasos(mockCasos);
      setIsLoading(false);
    }, 1000);
  }, []);

  const casosFiltrados = casos.filter(caso => {
    if (filtros.tipoTrafico && !caso.tipoTrafico.includes(filtros.tipoTrafico)) return false;
    if (filtros.provincia && caso.provincia !== filtros.provincia) return false;
    if (filtros.ano && !caso.dataRegistro.includes(filtros.ano)) return false;
    if (filtros.status && caso.status !== filtros.status) return false;
    return true;
  });

  const getTipoTraficoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'SEXUAL': 'Tráfico Sexual',
      'LABORAL': 'Tráfico Laboral',
      'ADOCAO_ILEGAL': 'Adoção Ilegal',
      'ORGAOS': 'Tráfico de Órgãos',
      'SERVIDAO': 'Servidão',
      'MIGRACAO_FORCADA': 'Migração Forçada',
    };
    return labels[tipo] || tipo;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ENCERRADO_AUTORIDADE': 'Encerrado pela Autoridade',
      'ENCERRADA_SEM_PROCEDENCIA': 'Encerrado sem Procedência',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    return status === 'ENCERRADO_AUTORIDADE' ? 'badge-success' : 'badge-gray';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 to-unodc-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unodc-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando casos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 to-unodc-navy-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-unodc-navy-600 hover:text-unodc-navy-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-unodc-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-unodc-navy-900 mb-4">
            Repositório Público
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Casos resolvidos e anonimizados para transparência e aprendizado. 
            Todos os dados sensíveis foram removidos para proteger as vítimas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-unodc-blue-600 mb-2">
                {casos.length}
              </div>
              <div className="text-sm text-gray-600">Casos Resolvidos</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-unodc-green-600 mb-2">
                {casos.reduce((acc, caso) => acc + caso.vitimasResgatadas, 0)}
              </div>
              <div className="text-sm text-gray-600">Vítimas Resgatadas</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-unodc-gold-600 mb-2">
                89%
              </div>
              <div className="text-sm text-gray-600">Taxa de Resolução</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-unodc-red-600 mb-2">
                24h
              </div>
              <div className="text-sm text-gray-600">Tempo Médio</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Tráfico
                </label>
                <select
                  value={filtros.tipoTrafico}
                  onChange={(e) => setFiltros({ ...filtros, tipoTrafico: e.target.value })}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  <option value="SEXUAL">Tráfico Sexual</option>
                  <option value="LABORAL">Tráfico Laboral</option>
                  <option value="ADOCAO_ILEGAL">Adoção Ilegal</option>
                  <option value="ORGAOS">Tráfico de Órgãos</option>
                  <option value="SERVIDAO">Servidão</option>
                  <option value="MIGRACAO_FORCADA">Migração Forçada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Província
                </label>
                <select
                  value={filtros.provincia}
                  onChange={(e) => setFiltros({ ...filtros, provincia: e.target.value })}
                  className="input-field"
                >
                  <option value="">Todas</option>
                  <option value="Maputo">Maputo</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Sofala">Sofala</option>
                  <option value="Zambézia">Zambézia</option>
                  <option value="Tete">Tete</option>
                  <option value="Manica">Manica</option>
                  <option value="Gaza">Gaza</option>
                  <option value="Inhambane">Inhambane</option>
                  <option value="Cabo Delgado">Cabo Delgado</option>
                  <option value="Niassa">Niassa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <select
                  value={filtros.ano}
                  onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  <option value="ENCERRADO_AUTORIDADE">Encerrado pela Autoridade</option>
                  <option value="ENCERRADA_SEM_PROCEDENCIA">Encerrado sem Procedência</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-6">
          {casosFiltrados.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum caso encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros para encontrar casos específicos.
                </p>
              </div>
            </div>
          ) : (
            casosFiltrados.map((caso) => (
              <div key={caso.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {caso.codigo}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(caso.dataRegistro)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {caso.distrito}, {caso.provincia}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {caso.vitimasResgatadas} vítima(s)
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(caso.status)}`}>
                      {getStatusLabel(caso.status)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {caso.tipoTrafico.map((tipo: string) => (
                        <span key={tipo} className="badge badge-primary">
                          {getTipoTraficoLabel(tipo)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resultado:</h4>
                    <p className="text-gray-700">{caso.resultado}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Autoridades Envolvidas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {caso.autoridadesEnvolvidas.map((autoridade: string) => (
                        <span key={autoridade} className="badge badge-gray">
                          {autoridade}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Encerrado em {formatDate(caso.dataEncerramento)}
                    </div>
                    <div>
                      Nível de Visibilidade: {caso.nivelVisibilidade.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sobre o Repositório Público
            </h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Este repositório contém casos resolvidos e anonimizados para promover transparência 
              e aprendizado. Todos os dados pessoais foram removidos para proteger a privacidade 
              das vítimas e suas famílias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/denuncia-publica"
                className="btn-primary"
              >
                Fazer Denúncia
              </Link>
              <Link
                to="/rastreio"
                className="btn-outline"
              >
                Rastrear Caso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


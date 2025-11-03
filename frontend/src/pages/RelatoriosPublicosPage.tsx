import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BarsPorProvincia from '@/components/charts/BarsPorProvincia';
import PiePorGenero from '@/components/charts/PiePorGenero';
import BarsConfirmados from '@/components/charts/BarsConfirmados';
import BarsPorDistrito from '@/components/charts/BarsPorDistrito';
import BarsPorTipoTraficoProvincia from '@/components/charts/BarsPorTipoTraficoProvincia';
import BarsPorTipoTraficoDistrito from '@/components/charts/BarsPorTipoTraficoDistrito';
import BarsPorTipoInstituicao from '@/components/charts/BarsPorTipoInstituicao';
import PieAnonimas from '@/components/charts/PieAnonimas';
import BarsVinculoEntidade from '@/components/charts/BarsVinculoEntidade';
import BarsPorTipoTraficoGeral from '@/components/charts/BarsPorTipoTraficoGeral';
import { mockDenuncias, provincias, distritosPorProvincia, FiltrosRelatorios, TipoTrafico, Genero, TipoInstituicao, filtrar, groupCount, porMesConfirmados } from '@/data/mockRelatorios';
import { Download, Home, LogIn } from 'lucide-react';

const tiposTrafico: TipoTrafico[] = ['SEXUAL', 'LABORAL', 'ADOCAO_ILEGAL', 'ORGAOS', 'SERVIDAO', 'MIGRACAO_FORCADA'];
const generos: Genero[] = ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'];
// Mostrar apenas tipos de instituição relevantes ao público nos filtros
const tiposInstituicao: TipoInstituicao[] = ['ESCOLA','HOSPITAL','IGREJA','ONG'];

export default function RelatoriosPublicosPage() {
  const [filtros, setFiltros] = useState<FiltrosRelatorios>({});
  const [ativado, setAtivado] = useState({
    distrito: false,
    traficoProvincia: true,
    traficoDistrito: false,
    instituicao: false,
    anonimas: false,
    vinculo: false,
    traficoGeral: true,
  });

  const distritos = useMemo(() => filtros.provincia ? distritosPorProvincia[filtros.provincia] : [], [filtros.provincia]);

  const filteredRows = useMemo(() => filtrar(mockDenuncias, filtros), [filtros]);

  const handleExportPDF = () => {
    const provCounts = groupCount(filteredRows, d => d.provincia);
    const distCounts = groupCount(filteredRows, d => d.distrito);
    const tipoInstCounts = groupCount(filteredRows, d => d.tipoInstituicao);
    const generoCounts = groupCount(filteredRows, d => d.genero);
    const confirmadosMes = porMesConfirmados(filteredRows);

    const formatTable = (title: string, headers: string[], rows: Array<string[]>) => {
      return `
        <h3 style="font:600 14px Inter,Arial;margin:16px 0 8px;color:#0f172a">${title}</h3>
        <table style="width:100%;border-collapse:collapse;font:400 12px Inter,Arial;border:1px solid #e5e7eb">
          <thead>
            <tr>${headers.map(h => `<th style=\"text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;background:#f8fafc\">${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(c => `<td style=\"padding:8px;border-bottom:1px solid #f1f5f9\">${c}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      `;
    };

    const docHtml = `
      <html>
        <head>
          <meta charset=\"utf-8\" />
          <title>SafePath — Relatórios Públicos</title>
          <style>
            @page { size: A4; margin: 16mm; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body style="font:400 12px Inter,Arial;color:#0f172a">
          <h1 style="font:700 20px Inter,Arial;margin:0 0 4px">SafePath — Relatórios Públicos</h1>
          <p style="margin:0 0 12px;color:#475569">Gerado em ${new Date().toLocaleString()}</p>
          <div style="margin:8px 0 16px;color:#334155">
            <strong>Filtros:</strong>
            <span>Província: ${filtros.provincia || 'Todas'}</span> ·
            <span>Distrito: ${filtros.distrito || 'Todos'}</span> ·
            <span>Gênero: ${filtros.genero || 'Todos'}</span> ·
            <span>Tipo Instituição: ${filtros.tipoInstituicao || 'Todas'}</span>
          </div>
          ${formatTable('Resumo por Província', ['Província','Denúncias'], Object.entries(provCounts).map(([k,v]) => [k, String(v)]))}
          ${formatTable('Resumo por Distrito', ['Distrito','Denúncias'], Object.entries(distCounts).map(([k,v]) => [k, String(v)]))}
          ${formatTable('Denúncias por Tipo de Instituição', ['Tipo','Denúncias'], Object.entries(tipoInstCounts).map(([k,v]) => [k, String(v)]))}
          ${formatTable('Distribuição por Gênero', ['Gênero','Quantidade'], Object.entries(generoCounts).map(([k,v]) => [k.replace('_',' '), String(v)]))}
          ${formatTable('Casos Confirmados por Mês', ['Mês','Casos'], confirmadosMes.map(r => [r.mes, String(r.casos)]))}
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(docHtml);
    w.document.close();
    // Aguarda renderização antes de imprimir
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unodc-blue-50 to-unodc-navy-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-unodc-navy-900">Relatórios Públicos</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Gráficos interativos com dados mockados da plataforma</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm">
              <Home className="h-4 w-4 mr-2" />
              Início
            </Link>
            <Link to="/login" className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
            <button onClick={handleExportPDF} className="inline-flex items-center px-3 py-2 bg-unodc-blue-600 hover:bg-unodc-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Província</label>
              <select
                value={filtros.provincia || ''}
                onChange={(e) => setFiltros({ ...filtros, provincia: e.target.value || undefined, distrito: undefined })}
                className="input-field w-full"
              >
                <option value="">Todas</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Distrito</label>
              <select
                value={filtros.distrito || ''}
                onChange={(e) => setFiltros({ ...filtros, distrito: e.target.value || undefined })}
                className="input-field w-full"
                disabled={!filtros.provincia}
              >
                <option value="">Todos</option>
                {distritos.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Gênero</label>
              <select
                value={filtros.genero || ''}
                onChange={(e) => setFiltros({ ...filtros, genero: (e.target.value as Genero) || undefined })}
                className="input-field w-full"
              >
                <option value="">Todos</option>
                {generos.map(g => <option key={g} value={g}>{g.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Tipo de Instituição</label>
              <select
                value={filtros.tipoInstituicao || ''}
                onChange={(e) => setFiltros({ ...filtros, tipoInstituicao: (e.target.value as TipoInstituicao) || undefined })}
                className="input-field w-full"
              >
                <option value="">Todas</option>
                {tiposInstituicao.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.distrito} onChange={(e)=>setAtivado({...ativado, distrito: e.target.checked})} />
              Mostrar por Distrito
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.traficoProvincia} onChange={(e)=>setAtivado({...ativado, traficoProvincia: e.target.checked})} />
              Tipo de Tráfico por Província
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.traficoDistrito} onChange={(e)=>setAtivado({...ativado, traficoDistrito: e.target.checked})} />
              Tipo de Tráfico por Distrito
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.instituicao} onChange={(e)=>setAtivado({...ativado, instituicao: e.target.checked})} />
              Por Tipo de Instituição
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.anonimas} onChange={(e)=>setAtivado({...ativado, anonimas: e.target.checked})} />
              Denúncias Anônimas
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.vinculo} onChange={(e)=>setAtivado({...ativado, vinculo: e.target.checked})} />
              Relação com Entidades
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={ativado.traficoGeral} onChange={(e)=>setAtivado({...ativado, traficoGeral: e.target.checked})} />
              Tipo de Tráfico (Geral)
            </label>
            <button onClick={() => setFiltros({})} className="btn-outline w-full sm:w-auto">Limpar filtros</button>
          </div>
        </div>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Padrão: 3 principais */}
          <BarsPorProvincia data={mockDenuncias} filtros={filtros} />
          <PiePorGenero data={mockDenuncias} filtros={filtros} />
          <BarsConfirmados data={mockDenuncias} filtros={filtros} />

          {/* Extras dinâmicos */}
          {ativado.distrito && <BarsPorDistrito data={mockDenuncias} filtros={filtros} />}
          {ativado.traficoProvincia && <BarsPorTipoTraficoProvincia data={mockDenuncias} filtros={filtros} />}
          {ativado.traficoDistrito && <BarsPorTipoTraficoDistrito data={mockDenuncias} filtros={filtros} />}
          {ativado.instituicao && <BarsPorTipoInstituicao data={mockDenuncias} filtros={filtros} />}
          {ativado.anonimas && <PieAnonimas data={mockDenuncias} filtros={filtros} />}
          {ativado.vinculo && <BarsVinculoEntidade data={mockDenuncias} filtros={filtros} />}
          {ativado.traficoGeral && <BarsPorTipoTraficoGeral data={mockDenuncias} filtros={filtros} />}
        </div>
      </div>
    </div>
  );
}



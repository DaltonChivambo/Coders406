import { useState, useEffect } from 'react';
import { denunciaService } from '@/services/denunciaService';
import { Denuncia, DenunciaFilters, PaginatedResponse } from '@/types';
import { useDenunciaStore } from '@/store/denunciaStore';

export const useDenuncias = (filters: DenunciaFilters = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    denuncias, 
    pagination, 
    setDenuncias, 
    setPagination, 
    setLoading, 
    setError: setStoreError 
  } = useDenunciaStore();

  const fetchDenuncias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStoreError(null);
      
      const response: PaginatedResponse<Denuncia> = await denunciaService.getDenuncias(filters);
      
      setDenuncias(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar denúncias';
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('Erro ao buscar denúncias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, [JSON.stringify(filters)]);

  return {
    denuncias,
    pagination,
    isLoading,
    error,
    refetch: fetchDenuncias,
  };
};

export const useDenunciaStats = () => {
  const [stats, setStats] = useState({
    totalDenuncias: 0,
    denunciasPendentes: 0,
    casosAtivos: 0,
    casosResolvidos: 0,
    tempoMedioResolucao: 0,
    taxaResolucao: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar todas as denúncias para calcular estatísticas
      const response = await denunciaService.getDenuncias({ limit: 1000 });
      const allDenuncias = response.data;
      
      // Calcular estatísticas
      const totalDenuncias = allDenuncias.length;
      const denunciasPendentes = allDenuncias.filter(d => 
        d.status === 'AGUARDANDO_TRIAGEM' || d.status === 'EM_ANALISE'
      ).length;
      const casosAtivos = allDenuncias.filter(d => 
        d.status === 'EM_ANALISE' || d.status === 'EM_INVESTIGACAO' || d.status === 'SUBMETIDO_AUTORIDADE'
      ).length;
      const casosResolvidos = allDenuncias.filter(d => 
        d.status === 'CASO_ENCERRADO' || d.status === 'ARQUIVADO'
      ).length;
      
      const taxaResolucao = totalDenuncias > 0 ? (casosResolvidos / totalDenuncias) * 100 : 0;
      
      setStats({
        totalDenuncias,
        denunciasPendentes,
        casosAtivos,
        casosResolvidos,
        tempoMedioResolucao: 7.2, // TODO: Calcular baseado em dados reais
        taxaResolucao: Math.round(taxaResolucao * 10) / 10,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

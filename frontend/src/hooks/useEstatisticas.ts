import { useQuery } from '@tanstack/react-query';
import { denunciaService } from '@/services/denunciaService';

export interface EstatisticasMensais {
  casosPendentes: Array<{ mes: string; casos: number }>;
  casosSubmetidos: Array<{ mes: string; casos: number }>;
  ano: number;
}

export function useEstatisticas(ano?: number) {
  return useQuery<EstatisticasMensais>({
    queryKey: ['estatisticasMensais', ano],
    queryFn: () => denunciaService.getEstatisticasMensais(ano),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

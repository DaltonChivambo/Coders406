import api from './api';
import { 
  Denuncia, 
  DenunciaFilters, 
  PaginatedResponse, 
  ApiResponse,
  DenunciaFormData 
} from '@/types';

export const denunciaService = {
  // Criar denúncia (autenticado)
  async createDenuncia(denunciaData: DenunciaFormData): Promise<Denuncia> {
    const response = await api.post<ApiResponse<Denuncia>>('/denuncias', denunciaData);
    return response.data.data!;
  },

  // Criar denúncia pública (sem autenticação)
  async createDenunciaPublica(denunciaData: DenunciaFormData): Promise<{ id: string; codigoRastreio: string; status: string }> {
    const response = await api.post<ApiResponse<{ id: string; codigoRastreio: string; status: string }>>('/publico/denuncias', denunciaData);
    return response.data.data!;
  },

  // Listar denúncias com filtros
  async getDenuncias(filters: DenunciaFilters = {}): Promise<PaginatedResponse<Denuncia>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Denuncia>>>(
      `/denuncias?${params.toString()}`
    );
    return response.data.data!;
  },

  // Obter denúncia por ID
  async getDenunciaById(id: string): Promise<Denuncia> {
    const response = await api.get<ApiResponse<Denuncia>>(`/denuncias/${id}`);
    return response.data.data!;
  },

  // Atualizar denúncia
  async updateDenuncia(id: string, updates: Partial<Denuncia>): Promise<Denuncia> {
    const response = await api.put<ApiResponse<Denuncia>>(`/denuncias/${id}`, updates);
    return response.data.data!;
  },

  // Atualizar status da denúncia
  async updateStatus(
    id: string, 
    data: { status: string; justificativa?: string; observacoes?: string }
  ): Promise<Denuncia> {
    const response = await api.patch<ApiResponse<Denuncia>>(`/denuncias/${id}/status`, data);
    return response.data.data!;
  },

  // Upload de evidências
  async uploadEvidencias(id: string, files: File[]): Promise<{ evidencias: any[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post<ApiResponse<{ evidencias: any[] }>>(
      `/denuncias/${id}/evidencias`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!;
  },

  // Adicionar observação
  async adicionarObservacao(id: string, observacao: { tipo: string; conteudo: string; visibilidade: string }): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/denuncias/${id}/observacoes`, observacao);
    return response.data.data!;
  },

  // Buscar denúncia por código de rastreio (interno - apenas agências)
  async getDenunciaByCodigo(codigo: string): Promise<Denuncia> {
    const response = await api.get<ApiResponse<Denuncia>>(`/denuncias/rastreio/${codigo}`);
    return response.data.data!;
  },

  // Verificar status público da denúncia
  async verificarStatusPublico(codigo: string): Promise<any> {
    const response = await api.get<ApiResponse<any>>(`/publico/status/${codigo}`);
    return response.data.data!;
  },

  // Obter arquivo de evidência
  getEvidenciaUrl(instituicaoId: string, denunciaId: string, filename: string): string {
    return `${api.defaults.baseURL}/denuncias/uploads/${instituicaoId}/${denunciaId}/${filename}`;
  },

  // Buscar estatísticas mensais
  async getEstatisticasMensais(ano?: number): Promise<any> {
    const params = ano ? `?ano=${ano}` : '';
    const response = await api.get<ApiResponse<any>>(`/denuncias/estatisticas/mensais${params}`);
    return response.data.data!;
  },
};

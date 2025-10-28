import api from './api';
import { Instituicao, ApiResponse } from '@/types';

export const instituicaoService = {
  // Listar todas as instituições
  async getInstituicoes(): Promise<Instituicao[]> {
    const response = await api.get<ApiResponse<Instituicao[]>>('/instituicoes');
    return response.data.data!;
  },

  // Obter instituição por ID
  async getInstituicaoById(id: string): Promise<Instituicao> {
    const response = await api.get<ApiResponse<Instituicao>>(`/instituicoes/${id}`);
    return response.data.data!;
  },

  // Obter instituições por tipo
  async getInstituicoesByTipo(tipo: string): Promise<Instituicao[]> {
    const response = await api.get<ApiResponse<Instituicao[]>>(`/instituicoes/tipo/${tipo}`);
    return response.data.data!;
  },

  // Criar instituição (apenas coordenadores)
  async createInstituicao(instituicaoData: Partial<Instituicao>): Promise<Instituicao> {
    const response = await api.post<ApiResponse<Instituicao>>('/instituicoes', instituicaoData);
    return response.data.data!;
  },

  // Atualizar instituição (apenas coordenadores)
  async updateInstituicao(id: string, updates: Partial<Instituicao>): Promise<Instituicao> {
    const response = await api.put<ApiResponse<Instituicao>>(`/instituicoes/${id}`, updates);
    return response.data.data!;
  },

  // Excluir instituição (apenas coordenadores)
  async deleteInstituicao(id: string): Promise<void> {
    await api.delete(`/instituicoes/${id}`);
  },
};


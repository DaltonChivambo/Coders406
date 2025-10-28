import { create } from 'zustand';
import { Instituicao } from '@/types';

interface InstituicaoState {
  instituicoes: Instituicao[];
  currentInstituicao: Instituicao | null;
  isLoading: boolean;
  error: string | null;
}

interface InstituicaoActions {
  setInstituicoes: (instituicoes: Instituicao[]) => void;
  setCurrentInstituicao: (instituicao: Instituicao | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addInstituicao: (instituicao: Instituicao) => void;
  updateInstituicao: (id: string, updates: Partial<Instituicao>) => void;
  removeInstituicao: (id: string) => void;
  reset: () => void;
}

export const useInstituicaoStore = create<InstituicaoState & InstituicaoActions>((set, get) => ({
  // Estado inicial
  instituicoes: [],
  currentInstituicao: null,
  isLoading: false,
  error: null,

  // Ações
  setInstituicoes: (instituicoes: Instituicao[]) => {
    set({ instituicoes });
  },

  setCurrentInstituicao: (instituicao: Instituicao | null) => {
    set({ currentInstituicao: instituicao });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  addInstituicao: (instituicao: Instituicao) => {
    set((state) => ({
      instituicoes: [...state.instituicoes, instituicao],
    }));
  },

  updateInstituicao: (id: string, updates: Partial<Instituicao>) => {
    set((state) => ({
      instituicoes: state.instituicoes.map((instituicao) =>
        instituicao._id === id ? { ...instituicao, ...updates } : instituicao
      ),
      currentInstituicao:
        state.currentInstituicao?._id === id
          ? { ...state.currentInstituicao, ...updates }
          : state.currentInstituicao,
    }));
  },

  removeInstituicao: (id: string) => {
    set((state) => ({
      instituicoes: state.instituicoes.filter((instituicao) => instituicao._id !== id),
      currentInstituicao:
        state.currentInstituicao?._id === id ? null : state.currentInstituicao,
    }));
  },

  reset: () => {
    set({
      instituicoes: [],
      currentInstituicao: null,
      isLoading: false,
      error: null,
    });
  },
}));


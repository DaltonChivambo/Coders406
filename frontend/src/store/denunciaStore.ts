import { create } from 'zustand';
import { Denuncia, DenunciaFilters, PaginatedResponse } from '@/types';

interface DenunciaState {
  denuncias: Denuncia[];
  currentDenuncia: Denuncia | null;
  filters: DenunciaFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

interface DenunciaActions {
  setDenuncias: (denuncias: Denuncia[]) => void;
  setCurrentDenuncia: (denuncia: Denuncia | null) => void;
  setFilters: (filters: Partial<DenunciaFilters>) => void;
  setPagination: (pagination: PaginatedResponse<Denuncia>['pagination']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addDenuncia: (denuncia: Denuncia) => void;
  updateDenuncia: (id: string, updates: Partial<Denuncia>) => void;
  removeDenuncia: (id: string) => void;
  reset: () => void;
}

export const useDenunciaStore = create<DenunciaState & DenunciaActions>((set, get) => ({
  // Estado inicial
  denuncias: [],
  currentDenuncia: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: null,
  isLoading: false,
  error: null,

  // Ações
  setDenuncias: (denuncias: Denuncia[]) => {
    set({ denuncias });
  },

  setCurrentDenuncia: (denuncia: Denuncia | null) => {
    set({ currentDenuncia: denuncia });
  },

  setFilters: (filters: Partial<DenunciaFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setPagination: (pagination: PaginatedResponse<Denuncia>['pagination']) => {
    set({ pagination });
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

  addDenuncia: (denuncia: Denuncia) => {
    set((state) => ({
      denuncias: [denuncia, ...state.denuncias],
    }));
  },

  updateDenuncia: (id: string, updates: Partial<Denuncia>) => {
    set((state) => ({
      denuncias: state.denuncias.map((denuncia) =>
        denuncia._id === id ? { ...denuncia, ...updates } : denuncia
      ),
      currentDenuncia:
        state.currentDenuncia?._id === id
          ? { ...state.currentDenuncia, ...updates }
          : state.currentDenuncia,
    }));
  },

  removeDenuncia: (id: string) => {
    set((state) => ({
      denuncias: state.denuncias.filter((denuncia) => denuncia._id !== id),
      currentDenuncia:
        state.currentDenuncia?._id === id ? null : state.currentDenuncia,
    }));
  },

  reset: () => {
    set({
      denuncias: [],
      currentDenuncia: null,
      filters: { page: 1, limit: 10 },
      pagination: null,
      isLoading: false,
      error: null,
    });
  },
}));


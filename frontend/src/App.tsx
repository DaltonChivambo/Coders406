import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

// Páginas
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import DenunciaPublicaPage from '@/pages/DenunciaPublicaPage';
import RepositorioPage from '@/pages/RepositorioPage';
import RastreioInternoPage from '@/pages/RastreioInternoPage';
import VerificarOportunidadePage from '@/pages/VerificarOportunidadePage';
import VerificarStatusPage from '@/pages/VerificarStatusPage';
import NovaDenunciaPage from '@/pages/NovaDenunciaPage';

// Componentes
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Verificar se há token válido no localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token && authData.state?.user) {
          // Token existe, mas vamos verificar se ainda é válido
          // Isso será feito pelo interceptor do axios
        }
      } catch (error) {
        // Token inválido, limpar storage
        localStorage.removeItem('auth-storage');
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/denuncia-publica" element={<DenunciaPublicaPage />} />
            <Route path="/verificar-oportunidade" element={<VerificarOportunidadePage />} />
            <Route path="/verificar-status" element={<VerificarStatusPage />} />
            <Route path="/relatorios-publicos" element={<RepositorioPage />} />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rastreio"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RastreioInternoPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nova-denuncia"
              element={
                <ProtectedRoute>
                  <NovaDenunciaPage />
                </ProtectedRoute>
              }
            />

            {/* Redirecionamento */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

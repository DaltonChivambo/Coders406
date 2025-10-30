import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

// Páginas
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import DenunciaPublicaPage from '@/pages/DenunciaPublicaPage';
import RepositorioPage from '@/pages/RepositorioPage';
import RelatoriosPublicosPage from '@/pages/RelatoriosPublicosPage';
import RastreioInternoPage from '@/pages/RastreioInternoPage';
import VerificarStatusPage from '@/pages/VerificarStatusPage';
import NovaDenunciaPage from '@/pages/NovaDenunciaPage';
import AnalisePendentePage from '@/pages/AnalisePendentePage';
import DetalheDenunciaPage from '@/pages/DetalheDenunciaPage';
import MeusCasosPage from '@/pages/MeusCasosPage';
import SubmeterCasosPage from '@/pages/SubmeterCasosPage';

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
  const { isAuthenticated } = useAuth();

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
            <Route path="/verificar-status" element={<VerificarStatusPage />} />
            <Route path="/relatorios-publicos" element={<RelatoriosPublicosPage />} />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/denuncias/nova"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NovaDenunciaPage />
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

            {/* Rotas para Analistas */}
            <Route
              path="/dashboard/analise/pendentes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AnalisePendentePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/denuncias/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DetalheDenunciaPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analise/minhas"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MeusCasosPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analise/submeter"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubmeterCasosPage />
                  </Layout>
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

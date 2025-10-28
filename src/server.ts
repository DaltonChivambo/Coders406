import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Conectar ao MongoDB
connectDatabase();

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Compressão
app.use(compression());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/api/uploads', express.static(config.uploadPath));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Importar rotas
import authRoutes from './routes/auth';
import instituicaoRoutes from './routes/instituicao';
import denunciaRoutes from './routes/denuncia';
import publicoRoutes from './routes/publico';

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/instituicoes', instituicaoRoutes);
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/publico', publicoRoutes);

// Rotas em desenvolvimento
app.use('/api/usuarios', (req, res) => {
  res.json({ message: 'Rotas de usuários em desenvolvimento' });
});

app.use('/api/dashboards', (req, res) => {
  res.json({ message: 'Rotas de dashboards em desenvolvimento' });
});

// Middleware de rota não encontrada
app.use(notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${config.nodeEnv}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`💾 MongoDB: ${config.mongodbUri}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

export default app;

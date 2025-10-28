import { Router } from 'express';
import { getDenunciaPublicaByCodigo, getStatusPublicoDenuncia } from '../controllers/denunciaController';

const router = Router();

// GET /api/publico/rastreio/:codigo - Rastreamento público (apenas status básico)
router.get('/rastreio/:codigo', getDenunciaPublicaByCodigo);

// GET /api/publico/status/:codigo - Verificação de status público
router.get('/status/:codigo', getStatusPublicoDenuncia);

export default router;


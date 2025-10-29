import { Router } from 'express';
import { getDenunciaPublicaByCodigo, getStatusPublicoDenuncia, createDenunciaPublica } from '../controllers/denunciaController';
import { validate } from '../middleware/validation';
import { createDenunciaPublicaSchema } from '../middleware/validation';

const router = Router();

// GET /api/publico/rastreio/:codigo - Rastreamento público (apenas status básico)
router.get('/rastreio/:codigo', getDenunciaPublicaByCodigo);

// GET /api/publico/status/:codigo - Verificação de status público
router.get('/status/:codigo', getStatusPublicoDenuncia);

// POST /api/publico/denuncias - Criar denúncia pública (sem autenticação)
router.post('/denuncias', validate(createDenunciaPublicaSchema), createDenunciaPublica);

export default router;


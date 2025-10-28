import { Router } from 'express';
import { 
  createDenuncia, 
  getAllDenuncias, 
  getDenunciaById, 
  updateDenuncia, 
  updateStatus,
  uploadEvidencias,
  getEvidencia,
  getDenunciaByCodigo
} from '../controllers/denunciaController';
import { authenticateToken } from '../middleware/auth';
import { canAccessDenuncia, canModifyDenuncia } from '../middleware/authorization';
import { validate } from '../middleware/validation';
import { createDenunciaSchema, updateStatusSchema } from '../middleware/validation';

const router = Router();

// POST /api/denuncias - Criar denúncia (público)
router.post('/', validate(createDenunciaSchema), createDenuncia);

// GET /api/denuncias - Listar denúncias (autenticado)
router.get('/', authenticateToken, getAllDenuncias);

// GET /api/denuncias/rastreio/:codigo - Buscar por código (apenas agências cadastradas)
router.get('/rastreio/:codigo', authenticateToken, getDenunciaByCodigo);

// GET /api/denuncias/:id - Detalhes da denúncia (autenticado)
router.get('/:id', authenticateToken, canAccessDenuncia, getDenunciaById);

// PUT /api/denuncias/:id - Atualizar denúncia (autenticado)
router.put('/:id', authenticateToken, canAccessDenuncia, canModifyDenuncia, updateDenuncia);

// PATCH /api/denuncias/:id/status - Atualizar status (autenticado)
router.patch('/:id/status', 
  authenticateToken, 
  canAccessDenuncia, 
  canModifyDenuncia,
  validate(updateStatusSchema),
  updateStatus
);

// POST /api/denuncias/:id/evidencias - Upload evidências (autenticado)
router.post('/:id/evidencias', 
  authenticateToken, 
  canAccessDenuncia, 
  canModifyDenuncia,
  uploadEvidencias
);

// GET /api/uploads/:instituicaoId/:denunciaId/:filename - Servir arquivo (autenticado)
router.get('/uploads/:instituicaoId/:denunciaId/:filename', 
  authenticateToken, 
  getEvidencia
);

export default router;

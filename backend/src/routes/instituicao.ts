import { Router } from 'express';
import { 
  getAllInstituicoes, 
  getInstituicaoById, 
  createInstituicao, 
  updateInstituicao, 
  deleteInstituicao,
  getInstituicoesByTipo
} from '../controllers/instituicaoController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/authorization';
import { validate } from '../middleware/validation';
import { createInstitutionSchema } from '../middleware/validation';
import { PerfilUsuario } from '../types';

const router = Router();

// GET /api/instituicoes
router.get('/', getAllInstituicoes);

// GET /api/instituicoes/tipo/:tipo
router.get('/tipo/:tipo', getInstituicoesByTipo);

// GET /api/instituicoes/:id
router.get('/:id', getInstituicaoById);

// POST /api/instituicoes (apenas gestor do sistema)
router.post('/', 
  authenticateToken, 
  requireRole(PerfilUsuario.GESTOR_SISTEMA),
  validate(createInstitutionSchema),
  createInstituicao
);

// PUT /api/instituicoes/:id (apenas gestor do sistema)
router.put('/:id', 
  authenticateToken, 
  requireRole(PerfilUsuario.GESTOR_SISTEMA),
  updateInstituicao
);

// DELETE /api/instituicoes/:id (apenas gestor do sistema)
router.delete('/:id', 
  authenticateToken, 
  requireRole(PerfilUsuario.GESTOR_SISTEMA),
  deleteInstituicao
);

export default router;


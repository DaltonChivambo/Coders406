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

// POST /api/instituicoes (apenas coordenadores)
router.post('/', 
  authenticateToken, 
  requireRole(PerfilUsuario.COORDENADOR_ASSOCIACAO),
  validate(createInstitutionSchema),
  createInstituicao
);

// PUT /api/instituicoes/:id (apenas coordenadores)
router.put('/:id', 
  authenticateToken, 
  requireRole(PerfilUsuario.COORDENADOR_ASSOCIACAO),
  updateInstituicao
);

// DELETE /api/instituicoes/:id (apenas coordenadores)
router.delete('/:id', 
  authenticateToken, 
  requireRole(PerfilUsuario.COORDENADOR_ASSOCIACAO),
  deleteInstituicao
);

export default router;


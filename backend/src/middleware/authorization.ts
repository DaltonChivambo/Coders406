import { Request, Response, NextFunction } from 'express';
import { PerfilUsuario } from '../types';
import { IAuthRequest } from '../types';

// Middleware para verificar se o usuário tem um perfil específico
export const requireRole = (...roles: PerfilUsuario[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    if (!roles.includes(req.user.perfil)) {
      res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Perfil insuficiente.' 
      });
      return;
    }

    next();
  };
};

// Middleware para verificar se o usuário pertence à mesma instituição
export const requireSameInstitution = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
    return;
  }

  const instituicaoId = req.params.instituicaoId || req.body.instituicaoId;
  
  if (instituicaoId && instituicaoId !== req.user.instituicaoId) {
    res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Instituição diferente.' 
    });
    return;
  }

  next();
};

// Middleware para verificar se o usuário pode acessar uma denúncia específica
export const canAccessDenuncia = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    const { denunciaId } = req.params;
    
    if (!denunciaId) {
      res.status(400).json({ 
        success: false, 
        message: 'ID da denúncia é obrigatório' 
      });
      return;
    }

    // Importar aqui para evitar dependência circular
    const { Denuncia } = await import('../models');
    
    const denuncia = await Denuncia.findById(denunciaId);
    
    if (!denuncia) {
      res.status(404).json({ 
        success: false, 
        message: 'Denúncia não encontrada' 
      });
      return;
    }

    // Coordenador da associação pode ver todas as denúncias
    if (req.user.perfil === PerfilUsuario.COORDENADOR_ASSOCIACAO) {
      req.denuncia = denuncia;
      next();
      return;
    }

    // Verificar se o usuário tem acesso baseado na visibilidade
    const hasAccess = 
      denuncia.instituicoesComAcesso.some(id => id.toString() === req.user!.instituicaoId) ||
      denuncia.instituicaoOrigemId.toString() === req.user!.instituicaoId ||
      (denuncia.instituicaoDestinoId && denuncia.instituicaoDestinoId.toString() === req.user!.instituicaoId) ||
      denuncia.visibilidade === 'PUBLICA';

    if (!hasAccess) {
      res.status(403).json({ 
        success: false, 
        message: 'Acesso negado a esta denúncia' 
      });
      return;
    }

    req.denuncia = denuncia;
    next();
  } catch (error) {
    console.error('Erro na verificação de acesso à denúncia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
};

// Middleware para verificar se o usuário pode modificar uma denúncia
export const canModifyDenuncia = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !req.denuncia) {
    res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado ou denúncia não encontrada' 
    });
    return;
  }

  const { perfil, instituicaoId } = req.user;
  const denuncia = req.denuncia;

  // Coordenador da associação pode modificar qualquer denúncia
  if (perfil === PerfilUsuario.COORDENADOR_ASSOCIACAO) {
    next();
    return;
  }

  // Verificar se o usuário pode modificar baseado no perfil e status
  const canModify = 
    // Criador da denúncia (se for da mesma instituição)
    (denuncia.usuarioCriadorId.toString() === req.user.id && 
     denuncia.instituicaoOrigemId.toString() === instituicaoId) ||
    
    // Analista da instituição de origem (para análise)
    (perfil === PerfilUsuario.ANALISTA && 
     denuncia.instituicaoOrigemId.toString() === instituicaoId &&
     ['INCOMPLETA', 'SUSPEITA', 'PROVAVEL', 'DESCARTADA', 'EM_INVESTIGACAO_INTERNA'].includes(denuncia.status)) ||
    
    // Supervisor da instituição de origem (para supervisão)
    (perfil === PerfilUsuario.SUPERVISOR && 
     denuncia.instituicaoOrigemId.toString() === instituicaoId) ||
    
    // Investigador da instituição de destino (para investigação)
    (perfil === PerfilUsuario.INVESTIGADOR && 
     denuncia.instituicaoDestinoId && 
     denuncia.instituicaoDestinoId.toString() === instituicaoId &&
     ['SENDO_PROCESSADO_AUTORIDADES', 'EM_TRANSITO_AGENCIAS'].includes(denuncia.status)) ||
    
    // Coordenador local da instituição de destino
    (perfil === PerfilUsuario.COORDENADOR_LOCAL && 
     denuncia.instituicaoDestinoId && 
     denuncia.instituicaoDestinoId.toString() === instituicaoId);

  if (!canModify) {
    res.status(403).json({ 
      success: false, 
      message: 'Acesso negado para modificar esta denúncia' 
    });
    return;
  }

  next();
};

// Middleware para verificar se o usuário pode ver dados sensíveis
export const canViewSensitiveData = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
    return;
  }

  const { perfil } = req.user;

  // Perfis que podem ver dados sensíveis
  const canViewSensitive = [
    PerfilUsuario.ANALISTA,
    PerfilUsuario.SUPERVISOR,
    PerfilUsuario.INVESTIGADOR,
    PerfilUsuario.COORDENADOR_LOCAL,
    PerfilUsuario.COORDENADOR_ASSOCIACAO
  ].includes(perfil);

  if (!canViewSensitive) {
    res.status(403).json({ 
      success: false, 
      message: 'Acesso negado a dados sensíveis' 
    });
    return;
  }

  next();
};


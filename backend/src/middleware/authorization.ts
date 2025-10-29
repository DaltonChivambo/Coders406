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

    const denunciaId = req.params.id || req.params.denunciaId;
    
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

    // Gestor do sistema pode ver todas as denúncias
    if (req.user.perfil === PerfilUsuario.GESTOR_SISTEMA) {
      req.denuncia = denuncia;
      next();
      return;
    }

    // PGR (AUTORIDADE) pode ver denúncias submetidas para autoridades
    if (req.user.perfil === PerfilUsuario.AUTORIDADE) {
      const statusPermitidos = [
        'SUBMETIDO_AUTORIDADE',
        'EM_INVESTIGACAO',
        'ENCAMINHADO_JUSTICA',
        'TRAFICO_HUMANO_CONFIRMADO',
        'ARQUIVADO'
      ];
      
      if (statusPermitidos.includes(denuncia.status)) {
        req.denuncia = denuncia;
        next();
        return;
      }
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

  // Gestor do sistema pode modificar qualquer denúncia
  if (perfil === PerfilUsuario.GESTOR_SISTEMA) {
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
     ['AGUARDANDO_TRIAGEM', 'EM_ANALISE', 'AGUARDANDO_INFORMACOES'].includes(denuncia.status)) ||
    
    // Autoridade (PGR) para casos submetidos
    (perfil === PerfilUsuario.AUTORIDADE && 
     ['SUBMETIDO_AUTORIDADE', 'EM_INVESTIGACAO', 'ENCAMINHADO_JUSTICA', 'CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status));

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
    PerfilUsuario.AUTORIDADE,
    PerfilUsuario.GESTOR_SISTEMA
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


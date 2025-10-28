import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IAuthRequest } from '../types';
import { Usuario } from '../models';

export const authenticateToken = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Token de acesso necessário' 
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    // Buscar usuário no banco para garantir que ainda existe e está ativo
    const user = await Usuario.findById(decoded.userId).populate('instituicaoId');
    
    if (!user || !user.ativo) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado ou inativo' 
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      perfil: user.perfil,
      instituicaoId: user.instituicaoId._id.toString()
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    } else {
      console.error('Erro na autenticação:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor' 
      });
    }
  }
};

export const authenticateRefreshToken = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ 
        success: false, 
        message: 'Refresh token necessário' 
      });
      return;
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
    
    // Buscar usuário no banco
    const user = await Usuario.findById(decoded.userId).populate('instituicaoId');
    
    if (!user || !user.ativo) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado ou inativo' 
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      perfil: user.perfil,
      instituicaoId: user.instituicaoId._id.toString()
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Refresh token inválido' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Refresh token expirado' 
      });
    } else {
      console.error('Erro na autenticação refresh:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor' 
      });
    }
  }
};

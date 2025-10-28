import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Usuario, Instituicao } from '../models';
import { ILoginRequest, ILoginResponse } from '../types';
import { createError, createAuthError } from '../middleware/errorHandler';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha, instituicaoId }: ILoginRequest = req.body;

    console.log('🔍 DEBUG LOGIN - Dados recebidos:', {
      email: email?.toLowerCase(),
      senha: senha ? '[REDACTED]' : 'undefined',
      instituicaoId: instituicaoId || 'undefined'
    });

    // Buscar usuário
    const user = await Usuario.findOne({ 
      email: email.toLowerCase(),
      instituicaoId,
      ativo: true 
    }).populate('instituicaoId');

    console.log('🔍 DEBUG LOGIN - Usuário encontrado:', user ? {
      id: user._id,
      email: user.email,
      instituicaoId: user.instituicaoId?._id,
      instituicaoNome: (user.instituicaoId as any)?.nome,
      ativo: user.ativo
    } : 'null');

    if (!user) {
      console.log('❌ DEBUG LOGIN - Usuário não encontrado');
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(senha);
    console.log('🔍 DEBUG LOGIN - Senha válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ DEBUG LOGIN - Senha inválida');
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }

    // Atualizar último login
    await user.updateLastLogin();

    // Gerar tokens
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        perfil: user.perfil,
        instituicaoId: user.instituicaoId._id
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn } as jwt.SignOptions
    );

    const response: ILoginResponse = {
      token,
      refreshToken,
      user: {
        id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        instituicao: {
          id: user.instituicaoId._id.toString(),
          nome: (user.instituicaoId as any).nome,
          tipo: (user.instituicaoId as any).tipo
        }
      }
    };

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: response
    });
    
    console.log('✅ DEBUG LOGIN - Login realizado com sucesso para:', user.email);
  } catch (error) {
    console.error('❌ DEBUG LOGIN - Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token necessário'
      });
      return;
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
    
    // Buscar usuário
    const user = await Usuario.findById(decoded.userId).populate('instituicaoId');
    
    if (!user || !user.ativo) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
      return;
    }

    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        perfil: user.perfil,
        instituicaoId: user.instituicaoId._id
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido'
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    const user = await Usuario.findById(userId).populate('instituicaoId');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        instituicao: {
          id: user.instituicaoId._id.toString(),
          nome: (user.instituicaoId as any).nome,
          tipo: (user.instituicaoId as any).tipo,
          sigla: (user.instituicaoId as any).sigla
        },
        ultimoLogin: user.ultimoLogin,
        dataCriacao: user.dataCriacao
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Em uma implementação mais robusta, você poderia:
    // 1. Adicionar o token a uma blacklist
    // 2. Invalidar o refresh token
    // 3. Registrar o logout no banco de dados
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de tratamento de erros
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = err;

  // Log do erro
  console.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Erros do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados inválidos';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Recurso já existe';
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Erros de Multer
  if (err.name === 'MulterError') {
    statusCode = 400;
    if ((err as any).code === 'LIMIT_FILE_SIZE') {
      message = 'Arquivo muito grande';
    } else if ((err as any).code === 'LIMIT_FILE_COUNT') {
      message = 'Muitos arquivos';
    } else if ((err as any).code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Campo de arquivo inesperado';
    }
  }

  // Resposta do erro
  const response: any = {
    success: false,
    message
  };

  // Incluir stack trace apenas em desenvolvimento
  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};

// Middleware para capturar rotas não encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Rota não encontrada: ${req.originalUrl}`, 404);
  next(error);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Função para criar erros customizados
export const createError = (message: string, statusCode: number = 500): CustomError => {
  return new CustomError(message, statusCode);
};

// Função para criar erros de validação
export const createValidationError = (message: string): CustomError => {
  return new CustomError(message, 400);
};

// Função para criar erros de autorização
export const createAuthError = (message: string = 'Acesso negado'): CustomError => {
  return new CustomError(message, 401);
};

// Função para criar erros de permissão
export const createPermissionError = (message: string = 'Permissão insuficiente'): CustomError => {
  return new CustomError(message, 403);
};

// Função para criar erros de não encontrado
export const createNotFoundError = (message: string = 'Recurso não encontrado'): CustomError => {
  return new CustomError(message, 404);
};

// Função para criar erros de conflito
export const createConflictError = (message: string = 'Conflito de dados'): CustomError => {
  return new CustomError(message, 409);
};


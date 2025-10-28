import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { config } from '../config';

// Criar diretório de uploads se não existir
const uploadDir = path.join(process.cwd(), config.uploadPath);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer para armazenamento em disco
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Estrutura: uploads/{instituicaoId}/{denunciaId}/
    const instituicaoId = req.params.instituicaoId || req.body.instituicaoId || 'temp';
    const denunciaId = req.params.denunciaId || req.body.denunciaId || 'temp';
    
    const uploadPath = path.join(uploadDir, instituicaoId, denunciaId);
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Nome do arquivo: timestamp-originalname
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    cb(null, filename);
  }
});

// Filtro de arquivos (aceita qualquer tipo)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceitar qualquer tipo de arquivo
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize, // 100MB
    files: 10 // Máximo 10 arquivos por upload
  }
});

// Middleware para upload de múltiplos arquivos
export const uploadMultiple = upload.array('evidencias', 10);

// Middleware para upload de arquivo único
export const uploadSingle = upload.single('evidencia');

// Middleware para upload de arquivos de perfil
export const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadPath = path.join(uploadDir, 'profiles');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `profile-${timestamp}-${originalName}`;
      cb(null, filename);
    }
  }),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB para fotos de perfil
    files: 1
  }
}).single('profileImage');

// Função para deletar arquivo
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Função para deletar diretório e todos os arquivos
export const deleteDirectory = (dirPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.rm(dirPath, { recursive: true, force: true }, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Função para obter o caminho completo do arquivo
export const getFilePath = (instituicaoId: string, denunciaId: string, filename: string): string => {
  return path.join(uploadDir, instituicaoId, denunciaId, filename);
};

// Função para verificar se arquivo existe
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

// Função para obter informações do arquivo
export const getFileInfo = (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    return {
      exists: false,
      size: 0,
      created: null,
      modified: null
    };
  }
};


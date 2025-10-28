import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Schema de validação para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  instituicaoId: z.string().min(1, 'ID da instituição é obrigatório')
});

// Schema de validação para criação de usuário
export const createUserSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(200, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.enum(['AGENTE_COMUNITARIO', 'OPERADOR', 'ANALISTA', 'SUPERVISOR', 'COORDENADOR_LOCAL', 'INVESTIGADOR', 'COORDENADOR_ASSOCIACAO']),
  instituicaoId: z.string().min(1, 'ID da instituição é obrigatório')
});

// Schema de validação para criação de instituição
export const createInstitutionSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(200, 'Nome muito longo'),
  tipo: z.enum(['RECEPTORA', 'INVESTIGATIVA', 'COORDENADORA']),
  sigla: z.string().min(2, 'Sigla deve ter pelo menos 2 caracteres').max(10, 'Sigla muito longa'),
  provincia: z.string().min(2, 'Província é obrigatória'),
  distrito: z.string().min(2, 'Distrito é obrigatório'),
  contacto: z.object({
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('Email inválido')
  })
});

// Schema de validação para criação de denúncia
export const createDenunciaSchema = z.object({
  tipoDenuncia: z.enum(['PUBLICA', 'INSTITUCIONAL_PRIVADA', 'INTERNA_INVESTIGACAO']),
  canalDenuncia: z.enum(['WEB', 'APP', 'TELEFONE', 'WHATSAPP', 'PRESENCIAL']),
  tipoTrafico: z.array(z.enum(['SEXUAL', 'LABORAL', 'ADOCAO_ILEGAL', 'ORGAOS', 'SERVIDAO', 'MIGRACAO_FORCADA'])).min(1, 'Pelo menos um tipo de tráfico deve ser selecionado'),
  localizacao: z.object({
    provincia: z.string().min(1, 'Província é obrigatória'),
    distrito: z.string().min(1, 'Distrito é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    localEspecifico: z.string().min(1, 'Local específico é obrigatório'),
    coordenadas: z.object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional()
    }).optional()
  }),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(5000, 'Descrição muito longa'),
  contextoAdicional: z.string().max(2000, 'Contexto adicional muito longo').optional(),
  vitimas: z.array(z.object({
    nome: z.string().optional(),
    genero: z.enum(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO']),
    idade: z.number().min(0).max(120).optional(),
    faixaEtaria: z.enum(['CRIANCA', 'ADOLESCENTE', 'ADULTO', 'IDOSO']),
    nacionalidade: z.string().min(1, 'Nacionalidade é obrigatória'),
    vulnerabilidade: z.array(z.enum(['DESEMPREGADO', 'ESTUDANTE', 'MIGRANTE', 'MENOR', 'DEFICIENTE']))
  })).optional(),
  suspeitos: z.array(z.object({
    identificacao: z.string().optional(),
    sexo: z.string().min(1, 'Sexo é obrigatório'),
    idadeAproximada: z.number().min(0).max(120).optional(),
    relacaoVitima: z.enum(['VIZINHO', 'FAMILIAR', 'DESCONHECIDO', 'RECRUTADOR', 'EMPREGADOR']),
    descricaoFisica: z.string().optional()
  })).optional(),
  contatos: z.object({
    telefoneDenunciante: z.string().optional(),
    telefoneSuspeito: z.string().optional(),
    telefoneVitima: z.string().optional(),
    urls: z.array(z.string().url('URL inválida')).optional(),
    outrosContatos: z.string().optional()
  }),
  denunciante: z.object({
    nome: z.string().min(1, 'Nome do denunciante é obrigatório'),
    telefone: z.string().min(1, 'Telefone do denunciante é obrigatório'),
    email: z.string().email('Email inválido').optional(),
    localizacao: z.string().min(1, 'Localização do denunciante é obrigatória'),
    anonimo: z.boolean()
  }).optional(),
  dataIncidente: z.string().datetime().optional()
});

// Schema de validação para atualização de status
export const updateStatusSchema = z.object({
  status: z.enum(['INCOMPLETA', 'SUSPEITA', 'PROVAVEL', 'DESCARTADA', 'EM_INVESTIGACAO_INTERNA', 'ENCERRADA_SEM_PROCEDENCIA', 'SENDO_PROCESSADO_AUTORIDADES', 'EM_TRANSITO_AGENCIAS', 'ENCERRADO_AUTORIDADE']),
  justificativa: z.string().max(1000, 'Justificativa muito longa').optional(),
  observacao: z.string().max(2000, 'Observação muito longa').optional()
});

// Schema de validação para classificação de caso
export const classificarCasoSchema = z.object({
  nivelRisco: z.enum(['CRITICO', 'ALTO', 'MEDIO', 'BAIXO', 'MINIMO']),
  observacoes: z.string().min(1, 'Observações são obrigatórias').max(2000, 'Observações muito longas'),
  solicitarRevisao: z.boolean().optional()
});

// Schema de validação para encaminhamento
export const encaminharCasoSchema = z.object({
  instituicaoDestinoId: z.string().min(1, 'ID da instituição de destino é obrigatório'),
  justificativa: z.string().min(1, 'Justificativa é obrigatória').max(2000, 'Justificativa muito longa'),
  prioridade: z.enum(['ALTA', 'MEDIA', 'BAIXA'])
});

// Schema de validação para transferência
export const transferirCasoSchema = z.object({
  instituicaoDestinoId: z.string().min(1, 'ID da instituição de destino é obrigatório'),
  justificativa: z.string().min(1, 'Justificativa é obrigatória').max(2000, 'Justificativa muito longa')
});

// Schema de validação para comentário
export const comentarioSchema = z.object({
  texto: z.string().min(1, 'Texto do comentário é obrigatório').max(2000, 'Comentário muito longo'),
  tipo: z.enum(['MENSAGEM', 'SOLICITACAO_APOIO', 'ATUALIZACAO']),
  visibilidadePara: z.array(z.string()).optional()
});

// Middleware genérico de validação
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para validação de parâmetros de query
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          success: false,
          message: 'Parâmetros de consulta inválidos',
          errors
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Schema de validação para paginação
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Schema de validação para filtros de denúncia
export const denunciaFiltersSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.string().optional(),
  tipoTrafico: z.string().optional(),
  nivelRisco: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  canalDenuncia: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  analistaId: z.string().optional(),
  instituicaoId: z.string().optional()
});


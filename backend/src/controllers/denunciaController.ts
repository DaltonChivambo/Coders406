import { Request, Response } from 'express';
import { Denuncia, Historico, Usuario } from '../models';
import { createError, createNotFoundError } from '../middleware/errorHandler';
import { IAuthRequest, IDenunciaFilters, IPaginatedResponse, TipoObservacao, TipoEvidencia, StatusDenuncia } from '../types';
import { uploadMultiple } from '../middleware/upload';
import { getFilePath } from '../middleware/upload';
import { Types } from 'mongoose';

export const createDenuncia = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const denunciaData = req.body;
    
    // Adicionar campos obrigatórios
    denunciaData.nivelRisco = 'MEDIO'; // Valor padrão, será calculado pela IA futuramente
    denunciaData.status = 'AGUARDANDO_TRIAGEM'; // Status inicial para todas as denúncias
    
    // Para denúncias públicas, usar dados padrão
    if (req.user) {
      // Usuário autenticado
      denunciaData.usuarioCriadorId = new Types.ObjectId(req.user.id);
      denunciaData.instituicaoOrigemId = new Types.ObjectId(req.user.instituicaoId);
      denunciaData.instituicoesComAcesso = [new Types.ObjectId(req.user.instituicaoId)];
      
      // Buscar instituição para verificar o tipo
      const { Instituicao } = await import('../models');
      const instituicaoOrigem = await Instituicao.findById(req.user.instituicaoId);
      
      // Se for uma escola, submeter automaticamente para a PGR
      if (instituicaoOrigem?.tipo === 'ESCOLA') {
        const pgr = await Instituicao.findOne({ tipo: 'AUTORIDADE' });
        if (pgr) {
          denunciaData.status = 'SUBMETIDO_AUTORIDADE';
          denunciaData.instituicoesComAcesso.push(pgr._id);
        }
      }
    } else {
      // Denúncia pública - buscar instituição coordenadora
      const { Instituicao } = await import('../models');
      const coordenadora = await Instituicao.findOne({ tipo: 'COORDENADORA' });
      if (!coordenadora) {
        res.status(500).json({
          success: false,
          message: 'Instituição coordenadora não encontrada'
        });
        return;
      }
      denunciaData.instituicaoOrigemId = coordenadora._id;
      denunciaData.instituicoesComAcesso = [coordenadora._id];
      // Para denúncias públicas, não há usuário criador
      denunciaData.usuarioCriadorId = coordenadora._id; // Usar coordenadora como criador
    }

    const denuncia = new Denuncia(denunciaData);
    await denuncia.save();

    // Registrar no histórico
    if (req.user) {
      await Historico.create({
        denunciaId: denuncia._id,
        usuarioId: req.user.id,
        acao: 'CRIACAO',
        detalhes: 'Denúncia criada',
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Denúncia criada com sucesso',
      data: denuncia
    });
  } catch (error) {
    console.error('Erro ao criar denúncia:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: Object.values((error as any).errors).map((err: any) => err.message)
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getAllDenuncias = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      tipoTrafico,
      nivelRisco,
      provincia,
      distrito,
      canalDenuncia,
      dataInicio,
      dataFim,
      analistaId,
      sortBy = 'dataRegistro',
      sortOrder = 'desc'
    } = req.query as any;

    const filter: any = {};
    const userId = req.user!.id;
    const perfil = req.user!.perfil;
    const instituicaoId = req.user!.instituicaoId;

    // Filtros baseados no perfil
    if (perfil === 'GESTOR_SISTEMA') {
      // HUMAI vê todas as denúncias
    } else if (perfil === 'AUTORIDADE') {
      // PGR vê apenas denúncias submetidas
      filter.status = { $in: [
        'SUBMETIDO_AUTORIDADE',
        'EM_INVESTIGACAO',
        'ENCAMINHADO_JUSTICA',
        'CASO_ENCERRADO',
        'ARQUIVADO'
      ]};
    } else {
      // OPERADOR e ANALISTA veem apenas da sua instituição
      filter.$or = [
        { instituicaoOrigemId: instituicaoId },
        { instituicoesComAcesso: instituicaoId }
      ];
    }

    // Aplicar filtros
    if (status) {
      filter.status = Array.isArray(status) ? { $in: status } : status;
    }

    if (tipoTrafico) {
      filter.tipoTrafico = Array.isArray(tipoTrafico) ? { $in: tipoTrafico } : { $in: [tipoTrafico] };
    }

    if (nivelRisco) {
      filter.nivelRisco = Array.isArray(nivelRisco) ? { $in: nivelRisco } : nivelRisco;
    }

    if (provincia) {
      filter['localizacao.provincia'] = Array.isArray(provincia) ? { $in: provincia } : provincia;
    }

    if (distrito) {
      filter['localizacao.distrito'] = Array.isArray(distrito) ? { $in: distrito } : distrito;
    }

    if (canalDenuncia) {
      filter.canalDenuncia = Array.isArray(canalDenuncia) ? { $in: canalDenuncia } : canalDenuncia;
    }

    if (analistaId) {
      filter.analistaResponsavelId = analistaId;
    }

    if (dataInicio || dataFim) {
      filter.dataRegistro = {};
      if (dataInicio) filter.dataRegistro.$gte = new Date(dataInicio);
      if (dataFim) filter.dataRegistro.$lte = new Date(dataFim);
    }

    // Configurar ordenação
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Executar consulta com paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [denuncias, total] = await Promise.all([
      Denuncia.find(filter)
        .populate('usuarioCriadorId', 'nome email')
        .populate('instituicaoOrigemId', 'nome sigla')
        .populate('analistaResponsavelId', 'nome email')
        .populate('instituicaoDestinoId', 'nome sigla')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-evidencias -observacoesInternas -relatorioFinal'),
      Denuncia.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    const response: IPaginatedResponse<any> = {
      data: denuncias,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getDenunciaById = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const denuncia = await Denuncia.findById(id)
      .populate('usuarioCriadorId', 'nome email')
      .populate('instituicaoOrigemId', 'nome sigla tipo')
      .populate('analistaResponsavelId', 'nome email')
      .populate('instituicaoDestinoId', 'nome sigla tipo')
      .populate('equipaInvestigacao', 'nome email')
      .populate('instituicoesComAcesso', 'nome sigla');

    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: denuncia
    });
  } catch (error) {
    console.error('Erro ao buscar denúncia:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const updateDenuncia = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user!.id;

    const denuncia = await Denuncia.findById(id);
    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    // Atualizar denúncia
    const updatedDenuncia = await Denuncia.findByIdAndUpdate(
      id,
      { ...updateData, dataUltimaAtualizacao: new Date() },
      { new: true, runValidators: true }
    );

    // Registrar no histórico
    await Historico.create({
      denunciaId: denuncia._id,
      usuarioId: userId,
      acao: 'MUDANCA_STATUS',
      detalhes: 'Denúncia atualizada',
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Denúncia atualizada com sucesso',
      data: updatedDenuncia
    });
  } catch (error) {
    console.error('Erro ao atualizar denúncia:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: Object.values((error as any).errors).map((err: any) => err.message)
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const updateStatus = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, justificativa, observacao } = req.body;
    const userId = req.user!.id;

    const denuncia = await Denuncia.findById(id);
    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    const statusAnterior = denuncia.status;
    denuncia.status = status;
    denuncia.dataUltimaAtualizacao = new Date();

    if (justificativa) {
      denuncia.observacoesInternas.push({
        usuarioId: new Types.ObjectId(userId),
        texto: justificativa,
        data: new Date(),
        tipo: TipoObservacao.NOTA
      });
    }

    if (observacao) {
      denuncia.observacoesInternas.push({
        usuarioId: new Types.ObjectId(userId),
        texto: observacao,
        data: new Date(),
        tipo: TipoObservacao.NOTA
      });
    }

    await denuncia.save();

    // Registrar no histórico
    await Historico.create({
      denunciaId: denuncia._id,
      usuarioId: userId,
      acao: 'MUDANCA_STATUS',
      statusAnterior,
      statusNovo: status,
      detalhes: `Status alterado de ${statusAnterior} para ${status}`,
      justificativa,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: denuncia
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const uploadEvidencias = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const instituicaoId = req.user!.instituicaoId;

    const denuncia = await Denuncia.findById(id);
    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    // Usar middleware de upload
    uploadMultiple(req, res, async (err) => {
      if (err) {
        console.error('Erro no upload:', err);
        res.status(400).json({
          success: false,
          message: 'Erro no upload de arquivos'
        });
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
        return;
      }

      const files = req.files as Express.Multer.File[];
      const evidencias = [];

      for (const file of files) {
        const evidencia = {
          tipo: TipoEvidencia.DOCUMENTO, // Pode ser melhorado para detectar tipo automaticamente
          nomeArquivo: file.filename,
          caminhoArquivo: file.path,
          dataUpload: new Date(),
          uploadPorId: new Types.ObjectId(userId)
        };

        evidencias.push(evidencia);
      }

      // Adicionar evidências à denúncia
      denuncia.evidencias.push(...evidencias);
      denuncia.dataUltimaAtualizacao = new Date();
      await denuncia.save();

      // Registrar no histórico
      await Historico.create({
        denunciaId: denuncia._id,
        usuarioId: userId,
        acao: 'ADICAO_EVIDENCIA',
        detalhes: `${files.length} arquivo(s) adicionado(s)`,
        timestamp: new Date()
      });

      res.json({
        success: true,
        message: `${files.length} arquivo(s) enviado(s) com sucesso`,
        data: {
          evidencias: evidencias.map(e => ({
            nomeArquivo: e.nomeArquivo,
            tipo: e.tipo,
            dataUpload: e.dataUpload
          }))
        }
      });
    });
  } catch (error) {
    console.error('Erro ao fazer upload de evidências:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getEvidencia = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { instituicaoId, denunciaId, filename } = req.params;

    const filePath = getFilePath(instituicaoId, denunciaId, filename);
    
    // Verificar se arquivo existe
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
      return;
    }

    // Enviar arquivo
    res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao servir arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getDenunciaByCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params;

    const denuncia = await Denuncia.findOne({ codigoRastreio: codigo.toUpperCase() })
      .populate('instituicaoOrigemId', 'nome sigla')
      .select('-evidencias -observacoesInternas -relatorioFinal -denunciante');

    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: denuncia
    });
  } catch (error) {
    console.error('Erro ao buscar denúncia por código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Rastreamento público - apenas status básico
export const getDenunciaPublicaByCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params;

    const denuncia = await Denuncia.findOne({ codigoRastreio: codigo.toUpperCase() })
      .populate('instituicaoOrigemId', 'nome sigla')
      .select('codigoRastreio status dataRegistro dataUltimaAtualizacao instituicaoOrigemId');

    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Código de rastreamento não encontrado'
      });
      return;
    }

    // Retornar apenas informações públicas
    res.json({
      success: true,
      data: {
        codigoRastreio: denuncia.codigoRastreio,
        status: denuncia.status,
        dataRegistro: denuncia.dataRegistro,
        dataUltimaAtualizacao: denuncia.dataUltimaAtualizacao,
        instituicaoOrigem: {
          nome: (denuncia.instituicaoOrigemId as any)?.nome,
          sigla: (denuncia.instituicaoOrigemId as any)?.sigla
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar denúncia pública:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificação de status público da denúncia
export const getStatusPublicoDenuncia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params;

    // Buscar denúncia por código de rastreio
    const denuncia = await Denuncia.findOne({ codigoRastreio: codigo })
      .populate('instituicaoOrigemId', 'nome sigla')
      .lean();

    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    // Calcular progresso baseado no status
    const statusProgressMap: { [key: string]: number } = {
      'INCOMPLETA': 10,
      'SUSPEITA': 20,
      'PROVAVEL': 40,
      'EM_INVESTIGACAO_INTERNA': 60,
      'SENDO_PROCESSADO_AUTORIDADES': 80,
      'EM_TRANSITO_AGENCIAS': 90,
      'ENCERRADO_AUTORIDADE': 100,
      'ENCERRADA_SEM_PROCEDENCIA': 100,
      'DESCARTADA': 100
    };

    const progresso = statusProgressMap[denuncia.status] || 0;

    // Definir etapas do processo
    const etapas = [
      {
        nome: 'Denúncia Recebida',
        status: ['INCOMPLETA', 'SUSPEITA', 'PROVAVEL', 'EM_INVESTIGACAO_INTERNA', 'SENDO_PROCESSADO_AUTORIDADES', 'EM_TRANSITO_AGENCIAS', 'ENCERRADO_AUTORIDADE', 'ENCERRADA_SEM_PROCEDENCIA', 'DESCARTADA'].includes(denuncia.status) ? 'concluida' : 'pendente',
        data: denuncia.dataRegistro,
        responsavel: (denuncia.instituicaoOrigemId as any)?.nome
      },
      {
        nome: 'Análise Inicial',
        status: ['EM_ANALISE', 'SUBMETIDO_AUTORIDADE', 'EM_INVESTIGACAO', 'ENCAMINHADO_JUSTICA', 'CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status) ? 'concluida' : 
               denuncia.status === StatusDenuncia.AGUARDANDO_TRIAGEM ? 'em_andamento' : 'pendente',
        data: denuncia.status === StatusDenuncia.AGUARDANDO_TRIAGEM ? denuncia.dataUltimaAtualizacao : undefined,
        responsavel: (denuncia.instituicaoOrigemId as any)?.nome
      },
      {
        nome: 'Investigação',
        status: ['EM_INVESTIGACAO', 'ENCAMINHADO_JUSTICA', 'CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status) ? 'concluida' : 
               denuncia.status === StatusDenuncia.EM_ANALISE ? 'em_andamento' : 'pendente',
        data: denuncia.status === StatusDenuncia.EM_ANALISE ? denuncia.dataUltimaAtualizacao : undefined,
        responsavel: (denuncia.instituicaoOrigemId as any)?.nome
      },
      {
        nome: 'Coordenação Interinstitucional',
        status: ['ENCAMINHADO_JUSTICA', 'CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status) ? 'concluida' : 
               denuncia.status === StatusDenuncia.EM_INVESTIGACAO ? 'em_andamento' : 'pendente',
        data: denuncia.status === StatusDenuncia.EM_INVESTIGACAO ? denuncia.dataUltimaAtualizacao : undefined,
        responsavel: (denuncia.instituicaoOrigemId as any)?.nome
      },
      {
        nome: 'Conclusão',
        status: ['CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status) ? 'concluida' : 
               ['ENCAMINHADO_JUSTICA'].includes(denuncia.status) ? 'em_andamento' : 'pendente',
        data: ['CASO_ENCERRADO', 'ARQUIVADO'].includes(denuncia.status) ? denuncia.dataUltimaAtualizacao : undefined,
        responsavel: (denuncia.instituicaoOrigemId as any)?.nome
      }
    ];

    // Retornar informações de status
    res.json({
      success: true,
      data: {
        codigoRastreio: denuncia.codigoRastreio,
        status: denuncia.status,
        dataCriacao: denuncia.dataRegistro,
        ultimaAtualizacao: denuncia.dataUltimaAtualizacao,
        instituicaoOrigem: {
          nome: (denuncia.instituicaoOrigemId as any)?.nome,
          sigla: (denuncia.instituicaoOrigemId as any)?.sigla
        },
        tipoTrafico: denuncia.tipoTrafico,
        localizacao: {
          provincia: denuncia.localizacao?.provincia,
          distrito: denuncia.localizacao?.distrito,
          bairro: denuncia.localizacao?.bairro
        },
        descricao: denuncia.descricao,
        progresso,
        etapas
      }
    });
  } catch (error) {
    console.error('Erro ao buscar status da denúncia:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Estatísticas de denúncias por mês
export const getEstatisticasMensais = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ano = new Date().getFullYear() } = req.query;
    const userInstituicaoId = (req as any).user?.instituicaoId;
    
    // Construir filtro baseado na instituição do usuário
    const matchFilter: any = {
      dataRegistro: {
        $gte: new Date(`${ano}-01-01`),
        $lt: new Date(`${parseInt(ano as string) + 1}-01-01`)
      },
      instituicoesComAcesso: { $in: [new Types.ObjectId(userInstituicaoId)] }
    };
    
    // Pipeline de agregação para estatísticas mensais
    const pipeline = [
      {
        $match: matchFilter
      },
      {
        $group: {
          _id: {
            mes: { $month: '$dataRegistro' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.mes',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      },
      {
        $sort: { _id: 1 as 1 }
      }
    ];

    const resultados = await Denuncia.aggregate(pipeline);
    
    // Preparar dados para os gráficos
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const dadosPendentes = meses.map((mes, index) => {
      const mesData = resultados.find(r => r._id === index + 1);
      const pendentes = mesData?.statuses.find((s: any) => 
        ['AGUARDANDO_TRIAGEM', 'EM_ANALISE', 'AGUARDANDO_INFORMACOES'].includes(s.status)
      )?.count || 0;
      
      return { mes, casos: pendentes };
    });

    const dadosSubmetidos = meses.map((mes, index) => {
      const mesData = resultados.find(r => r._id === index + 1);
      const submetidos = mesData?.statuses.find((s: any) => 
        s.status === 'SUBMETIDO_AUTORIDADE'
      )?.count || 0;
      
      return { mes, casos: submetidos };
    });

    res.json({
      success: true,
      data: {
        casosPendentes: dadosPendentes,
        casosSubmetidos: dadosSubmetidos,
        ano: parseInt(ano as string)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas mensais:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Adicionar observação à denúncia
export const adicionarObservacao = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tipo, conteudo, visibilidade } = req.body;

    if (!tipo || !conteudo || !visibilidade) {
      res.status(400).json({
        success: false,
        message: 'Tipo, conteúdo e visibilidade são obrigatórios'
      });
      return;
    }

    const denuncia = await Denuncia.findById(id);
    if (!denuncia) {
      res.status(404).json({
        success: false,
        message: 'Denúncia não encontrada'
      });
      return;
    }

    // Adicionar observação ao array de observações internas
    denuncia.observacoesInternas.push({
      usuarioId: new Types.ObjectId(req.user!.id),
      texto: conteudo,
      data: new Date(),
      tipo: TipoObservacao.NOTA
    });

    await denuncia.save();

    res.json({
      success: true,
      message: 'Observação adicionada com sucesso',
      data: denuncia.observacoesInternas[denuncia.observacoesInternas.length - 1]
    });
  } catch (error) {
    console.error('Erro ao adicionar observação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Criar denúncia pública (sem autenticação)
export const createDenunciaPublica = async (req: Request, res: Response): Promise<void> => {
  try {
    const denunciaData = req.body;
    
    // Adicionar campos obrigatórios para denúncia pública
    denunciaData.nivelRisco = 'MEDIO'; // Valor padrão
    denunciaData.status = 'AGUARDANDO_TRIAGEM'; // Status inicial
    denunciaData.tipoDenuncia = 'PUBLICA'; // Sempre pública
    denunciaData.canalDenuncia = 'WEB'; // Sempre web para denúncias públicas
    
    // Buscar instituição receptora padrão (ONG)
    const { Instituicao } = await import('../models');
    const instituicaoReceptora = await Instituicao.findOne({ tipo: 'RECEPTORA' });
    
    if (!instituicaoReceptora) {
      res.status(500).json({
        success: false,
        message: 'Nenhuma instituição receptora encontrada'
      });
      return;
    }
    
    // Configurar dados da denúncia pública
    denunciaData.instituicaoOrigemId = instituicaoReceptora._id;
    denunciaData.instituicoesComAcesso = [instituicaoReceptora._id];
    
    // Gerar código de rastreamento
    const codigoInstituicao = instituicaoReceptora.sigla || 'PUB';
    const timestamp = Date.now().toString().slice(-6);
    const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
    denunciaData.codigoRastreio = `HUMAI-${codigoInstituicao}-${timestamp}-${randomCode}`;
    
    // Criar a denúncia
    const denuncia = new Denuncia(denunciaData);
    await denuncia.save();
    
    // Criar histórico inicial
    const historico = new Historico({
      denunciaId: denuncia._id,
      acao: 'CRIADA',
      descricao: 'Denúncia pública criada',
      usuarioId: null, // Sem usuário para denúncias públicas
      data: new Date()
    });
    await historico.save();
    
    res.status(201).json({
      success: true,
      message: 'Denúncia pública criada com sucesso',
      data: {
        id: denuncia._id,
        codigoRastreio: denuncia.codigoRastreio,
        status: denuncia.status
      }
    });
  } catch (error) {
    console.error('Erro ao criar denúncia pública:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

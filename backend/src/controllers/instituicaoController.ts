import { Request, Response } from 'express';
import { Instituicao } from '../models';
import { createError, createNotFoundError } from '../middleware/errorHandler';
import { IAuthRequest } from '../types';

export const getAllInstituicoes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ativa, tipo, provincia, distrito } = req.query;
    
    const filter: any = {};
    
    if (ativa !== undefined) {
      filter.ativa = ativa === 'true';
    }
    
    if (tipo) {
      filter.tipo = tipo;
    }
    
    if (provincia) {
      filter.provincia = new RegExp(provincia as string, 'i');
    }
    
    if (distrito) {
      filter.distrito = new RegExp(distrito as string, 'i');
    }

    const instituicoes = await Instituicao.find(filter)
      .select('-__v')
      .sort({ nome: 1 });

    res.json({
      success: true,
      data: instituicoes
    });
  } catch (error) {
    console.error('Erro ao buscar instituições:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getInstituicaoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const instituicao = await Instituicao.findById(id).select('-__v');

    if (!instituicao) {
      res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: instituicao
    });
  } catch (error) {
    console.error('Erro ao buscar instituição:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const createInstituicao = async (req: Request, res: Response): Promise<void> => {
  try {
    const instituicaoData = req.body;

    // Verificar se a sigla já existe
    const existingInstituicao = await Instituicao.findOne({ 
      sigla: instituicaoData.sigla.toUpperCase() 
    });

    if (existingInstituicao) {
      res.status(409).json({
        success: false,
        message: 'Já existe uma instituição com esta sigla'
      });
      return;
    }

    const instituicao = new Instituicao(instituicaoData);
    await instituicao.save();

    res.status(201).json({
      success: true,
      message: 'Instituição criada com sucesso',
      data: instituicao
    });
  } catch (error) {
    console.error('Erro ao criar instituição:', error);
    
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

export const updateInstituicao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar se a instituição existe
    const instituicao = await Instituicao.findById(id);
    if (!instituicao) {
      res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
      return;
    }

    // Se estiver alterando a sigla, verificar se não existe outra com a mesma sigla
    if (updateData.sigla && updateData.sigla !== instituicao.sigla) {
      const existingInstituicao = await Instituicao.findOne({ 
        sigla: updateData.sigla.toUpperCase(),
        _id: { $ne: id }
      });

      if (existingInstituicao) {
        res.status(409).json({
          success: false,
          message: 'Já existe uma instituição com esta sigla'
        });
        return;
      }
    }

    const updatedInstituicao = await Instituicao.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({
      success: true,
      message: 'Instituição atualizada com sucesso',
      data: updatedInstituicao
    });
  } catch (error) {
    console.error('Erro ao atualizar instituição:', error);
    
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

export const deleteInstituicao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar se a instituição existe
    const instituicao = await Instituicao.findById(id);
    if (!instituicao) {
      res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
      return;
    }

    // Verificar se há usuários associados
    const { Usuario } = await import('../models');
    const usuariosCount = await Usuario.countDocuments({ instituicaoId: id, ativo: true });
    
    if (usuariosCount > 0) {
      res.status(409).json({
        success: false,
        message: 'Não é possível excluir instituição com usuários ativos'
      });
      return;
    }

    // Soft delete - marcar como inativa
    await Instituicao.findByIdAndUpdate(id, { ativa: false });

    res.json({
      success: true,
      message: 'Instituição desativada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir instituição:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getInstituicoesByTipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo } = req.params;

    const instituicoes = await Instituicao.find({ 
      tipo, 
      ativa: true 
    })
      .select('nome sigla provincia distrito contacto')
      .sort({ nome: 1 });

    res.json({
      success: true,
      data: instituicoes
    });
  } catch (error) {
    console.error('Erro ao buscar instituições por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};


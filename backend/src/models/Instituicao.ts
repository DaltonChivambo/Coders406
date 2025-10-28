import mongoose, { Schema } from 'mongoose';
import { IInstituicao, TipoInstituicao } from '../types';

const InstituicaoSchema = new Schema<IInstituicao>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  tipo: {
    type: String,
    enum: Object.values(TipoInstituicao),
    required: true
  },
  sigla: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  provincia: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  distrito: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bairro: {
    type: String,
    required: function() { return this.tipo === 'ESCOLA'; },
    trim: true,
    maxlength: 100
  },
  codigoAcesso: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    length: 6,
    uppercase: true
  },
  contacto: {
    telefone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100
    }
  },
  ativa: {
    type: Boolean,
    default: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usando dataCriacao customizada
  versionKey: false
});

// Índices
InstituicaoSchema.index({ sigla: 1 });
InstituicaoSchema.index({ tipo: 1 });
InstituicaoSchema.index({ provincia: 1, distrito: 1 });
InstituicaoSchema.index({ ativa: 1 });
InstituicaoSchema.index({ codigoAcesso: 1 }, { unique: true });

// Validação customizada
InstituicaoSchema.pre('save', function(next) {
  if (this.isModified('sigla')) {
    this.sigla = this.sigla.toUpperCase();
  }
  
  // Gerar código de acesso automático se não fornecido
  if (!this.codigoAcesso) {
    this.codigoAcesso = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  if (this.isModified('codigoAcesso')) {
    this.codigoAcesso = this.codigoAcesso.toUpperCase();
  }
  
  next();
});

export default mongoose.model<IInstituicao>('Instituicao', InstituicaoSchema);

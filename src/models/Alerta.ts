import mongoose, { Schema } from 'mongoose';
import { IAlerta, TipoAlerta } from '../types';

const AlertaSchema = new Schema<IAlerta>({
  denunciaId: {
    type: Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  tipo: {
    type: String,
    enum: Object.values(TipoAlerta),
    required: true
  },
  destinatarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  instituicaoId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao'
  },
  mensagem: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  lido: {
    type: Boolean,
    default: false
  },
  dataAlerta: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usando dataAlerta customizada
  versionKey: false
});

// Índices
AlertaSchema.index({ denunciaId: 1 });
AlertaSchema.index({ tipo: 1 });
AlertaSchema.index({ destinatarioId: 1 });
AlertaSchema.index({ instituicaoId: 1 });
AlertaSchema.index({ lido: 1 });
AlertaSchema.index({ dataAlerta: -1 });
AlertaSchema.index({ destinatarioId: 1, lido: 1 });
AlertaSchema.index({ instituicaoId: 1, lido: 1 });

export default mongoose.model<IAlerta>('Alerta', AlertaSchema);


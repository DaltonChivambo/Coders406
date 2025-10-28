import mongoose, { Schema } from 'mongoose';
import { ITransferencia, StatusTransferencia } from '../types';

const TransferenciaSchema = new Schema<ITransferencia>({
  denunciaId: {
    type: Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  instituicaoOrigemId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: true
  },
  instituicaoDestinoId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: true
  },
  solicitadoPorId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  justificativa: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: Object.values(StatusTransferencia),
    required: true,
    default: StatusTransferencia.PENDENTE
  },
  dataTransferencia: {
    type: Date,
    default: Date.now
  },
  dataConfirmacao: {
    type: Date
  }
}, {
  timestamps: false, // Usando datas customizadas
  versionKey: false
});

// Índices
TransferenciaSchema.index({ denunciaId: 1 });
TransferenciaSchema.index({ instituicaoOrigemId: 1 });
TransferenciaSchema.index({ instituicaoDestinoId: 1 });
TransferenciaSchema.index({ solicitadoPorId: 1 });
TransferenciaSchema.index({ status: 1 });
TransferenciaSchema.index({ dataTransferencia: -1 });
TransferenciaSchema.index({ denunciaId: 1, status: 1 });

export default mongoose.model<ITransferencia>('Transferencia', TransferenciaSchema);


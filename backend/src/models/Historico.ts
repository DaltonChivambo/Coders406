import mongoose, { Schema } from 'mongoose';
import { IHistorico, TipoAcaoHistorico } from '../types';

const HistoricoSchema = new Schema<IHistorico>({
  denunciaId: {
    type: Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  acao: {
    type: String,
    enum: Object.values(TipoAcaoHistorico),
    required: true
  },
  statusAnterior: {
    type: String,
    trim: true,
    maxlength: 100
  },
  statusNovo: {
    type: String,
    trim: true,
    maxlength: 100
  },
  detalhes: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  justificativa: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usando timestamp customizado
  versionKey: false
});

// Índices
HistoricoSchema.index({ denunciaId: 1 });
HistoricoSchema.index({ usuarioId: 1 });
HistoricoSchema.index({ acao: 1 });
HistoricoSchema.index({ timestamp: -1 });
HistoricoSchema.index({ denunciaId: 1, timestamp: -1 });

export default mongoose.model<IHistorico>('Historico', HistoricoSchema);


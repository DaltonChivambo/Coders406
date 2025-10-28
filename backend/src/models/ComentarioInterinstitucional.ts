import mongoose, { Schema } from 'mongoose';
import { IComentarioInterinstitucional, TipoComentario } from '../types';

const ComentarioInterinstitucionalSchema = new Schema<IComentarioInterinstitucional>({
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
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  texto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  tipo: {
    type: String,
    enum: Object.values(TipoComentario),
    required: true
  },
  visibilidadePara: [{
    type: Schema.Types.ObjectId,
    ref: 'Instituicao'
  }],
  dataComentario: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usando dataComentario customizada
  versionKey: false
});

// Índices
ComentarioInterinstitucionalSchema.index({ denunciaId: 1 });
ComentarioInterinstitucionalSchema.index({ instituicaoOrigemId: 1 });
ComentarioInterinstitucionalSchema.index({ usuarioId: 1 });
ComentarioInterinstitucionalSchema.index({ tipo: 1 });
ComentarioInterinstitucionalSchema.index({ dataComentario: -1 });
ComentarioInterinstitucionalSchema.index({ denunciaId: 1, dataComentario: -1 });
ComentarioInterinstitucionalSchema.index({ visibilidadePara: 1 });

export default mongoose.model<IComentarioInterinstitucional>('ComentarioInterinstitucional', ComentarioInterinstitucionalSchema);


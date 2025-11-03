import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUsuario, PerfilUsuario } from '../types';

const UsuarioSchema = new Schema<IUsuario>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  senha: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100
  },
  instituicaoId: {
    type: Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: true
  },
  perfil: {
    type: String,
    enum: Object.values(PerfilUsuario),
    required: true
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: {
    type: Date
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
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ instituicaoId: 1 });
UsuarioSchema.index({ perfil: 1 });
UsuarioSchema.index({ ativo: 1 });
UsuarioSchema.index({ instituicaoId: 1, perfil: 1 });

// Hash da senha antes de salvar
// UsuarioSchema.pre('save', async function(next) {
//   if (!this.isModified('senha')) return next();
//   
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.senha = await bcrypt.hash(this.senha, salt);
//     next();
//   } catch (error) {
//     next(error as Error);
//   }
// });

// Método para comparar senhas
UsuarioSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.senha);
};

// Método para atualizar último login
UsuarioSchema.methods.updateLastLogin = async function() {
  this.ultimoLogin = new Date();
  return this.save();
};

// Transformar JSON (remover senha)
UsuarioSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.senha;
  return userObject;
};

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);

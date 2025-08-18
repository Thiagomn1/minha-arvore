import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tipoPessoa: { type: String, enum: ["PF", "PJ"], required: true },
  cpf: { type: String },
  cnpj: { type: String },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String,
  },
  password: { type: String, required: true },
  consentimentoLGPD: { type: Boolean, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

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
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return (
          value.length >= 6 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[!@#$%^&*(),.?\":{}|<>]/.test(value)
        );
      },
      message:
        "A senha deve ter pelo menos 6 caracteres, com letras maiúsculas, minúsculas, números e um caractere especial.",
    },
  },
  consentimentoLGPD: { type: Boolean, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

import dbConnect from "./mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface UpdateUserPayload {
  nome?: string;
  email?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  senhaAtual?: string;
  novaSenha?: string;
}

/**
 * Atualiza dados do usuário no MongoDB usando Mongoose
 * @param userId ID do usuário
 * @param type Tipo de atualização: 'dados' | 'endereco' | 'senha'
 * @param payload Dados a serem atualizados
 */
export async function updateUser(
  userId: string,
  type: "dados" | "endereco" | "senha",
  payload: UpdateUserPayload
) {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuário não encontrado");

  if (type === "dados") {
    const { nome, email } = payload;
    if ((!nome || nome.trim() === "") && (!email || email.trim() === "")) {
      throw new Error("Preencha ao menos um campo para atualizar");
    }
    if (nome && nome.trim() !== "") user.name = nome;
    if (email && email.trim() !== "") user.email = email;
  } else if (type === "endereco") {
    const endereco = payload.endereco;
    if (
      !endereco ||
      Object.values(endereco).every((v) => !v || v.trim() === "")
    ) {
      throw new Error("Preencha ao menos um campo de endereço para atualizar");
    }

    user.endereco = {
      ...user.endereco.toObject(),
      ...Object.fromEntries(
        Object.entries(endereco).filter(
          ([_, value]) => value && value.trim() !== ""
        )
      ),
    };
  } else if (type === "senha") {
    const { senhaAtual, novaSenha } = payload;
    if (!senhaAtual || !novaSenha) {
      throw new Error("Senha atual e nova senha são obrigatórias");
    }

    const isMatch = await bcrypt.compare(senhaAtual, user.password);
    if (!isMatch) throw new Error("Senha atual incorreta");

    const hashed = await bcrypt.hash(novaSenha, 10);
    user.password = hashed;
  } else {
    throw new Error("Tipo inválido");
  }

  await user.save();
  return user;
}

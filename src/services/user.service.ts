/**
 * Serviço de Usuário - Lógica de negócio relacionada a usuários
 */
import dbConnect from "@/lib/db/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGES } from "@/lib/constants";
import type {
  RegisterUserInput,
  UpdateUserDadosInput,
  UpdateUserEnderecoInput,
  UpdateUserSenhaInput,
} from "@/lib/validations/schemas";

export class UserService {
  /**
   * Registra um novo usuário
   */
  static async registerUser(data: RegisterUserInput) {
    await dbConnect();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      tipoPessoa: data.tipoPessoa,
      cpf: data.cpf,
      cnpj: data.cnpj,
      telefone: data.telefone,
      endereco: data.endereco,
      consentimentoLGPD: data.aceitouTermos,
    });

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  }

  /**
   * Busca usuário por email
   */
  static async getUserByEmail(email: string) {
    await dbConnect();
    return await User.findOne({ email });
  }

  /**
   * Busca usuário por ID
   */
  static async getUserById(userId: string) {
    await dbConnect();
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * Atualiza dados pessoais do usuário
   */
  static async updateUserDados(userId: string, data: UpdateUserDadosInput) {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!data.nome && !data.email) {
      throw new Error("Preencha ao menos um campo para atualizar");
    }

    if (data.nome) user.name = data.nome;
    if (data.email) {
      const existingUser = await User.findOne({ email: data.email, _id: { $ne: userId } });
      if (existingUser) {
        throw new Error("Email já está em uso");
      }
      user.email = data.email;
    }

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Atualiza endereço do usuário
   */
  static async updateUserEndereco(userId: string, data: UpdateUserEnderecoInput) {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const endereco = data.endereco;
    if (!endereco || Object.values(endereco).every((v) => !v || v.trim() === "")) {
      throw new Error("Preencha ao menos um campo de endereço para atualizar");
    }

    user.endereco = {
      ...user.endereco.toObject(),
      ...Object.fromEntries(
        Object.entries(endereco).filter(([, value]) => value && value.trim() !== "")
      ),
    };

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Atualiza senha do usuário
   */
  static async updateUserSenha(userId: string, data: UpdateUserSenhaInput) {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(data.senhaAtual, user.password);
    if (!isMatch) {
      throw new Error("Senha atual incorreta");
    }

    const hashedPassword = await bcrypt.hash(data.novaSenha, 10);
    user.password = hashedPassword;

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Lista todos os usuários (Admin)
   */
  static async getAllUsers(page: number = 1, limit: number = 10) {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Promove usuário a Admin
   */
  static async promoteToAdmin(userId: string) {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    user.role = "Admin";
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Valida credenciais de login
   */
  static async validateCredentials(email: string, password: string) {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  }
}

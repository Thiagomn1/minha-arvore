import { AuthOptions, User as UserType, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { loginRateLimiter } from "./rate-limit";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { success, reset } = await loginRateLimiter.limit(
          credentials.email
        );

        if (!success) {
          const waitTime = Math.ceil((reset - Date.now()) / 1000);
          throw new Error(
            `Muitas tentativas de login. Tente novamente em ${waitTime} segundos.`
          );
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Senha incorreta");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: UserType | undefined;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.cpf = user.cpf;
        token.role = user.role;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.cpf = token.cpf as string;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

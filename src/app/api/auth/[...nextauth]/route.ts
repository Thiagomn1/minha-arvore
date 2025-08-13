import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Cria o handler NextAuth com as opções
const handler = NextAuth(authOptions);

// Exporta handlers nomeados para cada método HTTP
export { handler as GET, handler as POST };

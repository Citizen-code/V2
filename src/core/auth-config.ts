import prisma from "@/core/db"
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Логин", type: "text", placeholder: "Введите логин..." },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.employee_credential.findFirst({where:{login:credentials?.login, password:credentials?.password},include:{employee:true}})
        if (user) {
          const {employee_id} = user;
          const {surname, name, image} = user.employee;
          return {id:employee_id, name:`${surname} ${name}`, image:image}
        } else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) session.user.id = token.uid;
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) token.uid = user.id;
      return token;
    },
  },
  session: {strategy: 'jwt'},
} as AuthOptions
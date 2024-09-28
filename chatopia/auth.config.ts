// Providers
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import type { NextAuthConfig } from "next-auth"

// Prisma Modules
// import { PrismaAdapter } from "@auth/prisma-adapter"

// Prisma Client Instance
import prisma from "@/app/libs/prismadb"

// Bcrypt JS
import bcrypt from "bcryptjs"
 
export default { providers: [
    GithubProvider,
    GoogleProvider,
    CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'email', type: 'text' },
          password: { label: 'password', type: 'password' },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
            throw new Error('Invalid Credentials');
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
  
          if (!user || !user?.hashedPassword) {
            throw new Error('Invalid credentials');
          }
  
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );
  
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
  
          return user;
        }
      })
    ],
} satisfies NextAuthConfig
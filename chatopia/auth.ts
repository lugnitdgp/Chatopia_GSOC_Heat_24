import NextAuth from "next-auth"

// Providers
// import GithubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";

// Prisma Modules
import { PrismaAdapter } from "@auth/prisma-adapter"

// Prisma Client Instance
import prisma from "@/app/libs/prismadb";

import authConfig from "./auth.config"
 
export const { 
    handlers:{ GET, POST}, 
    auth, 
    signIn, 
    signOut 
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
        
    // debug: process.env.NODE_ENV === 'development',
    // callbacks: {
    //     async jwt({token, account , profile}) {
    //         axios.post('http://localhost:3000/api/socket/online', { email: token?.email })
    //         .catch((error) => {
    //             console.error(error);
    //         }
    //         );
    //         return token;
    //     },
    // },
    secret: process.env.AUTH_SECRET,
    pages:{
        signIn: '/users',
    },
})

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        error: '/',
        newUser: '/',
        signIn: '/',
        signOut: '/'
    },
    adapter: PrismaAdapter(prisma),
    providers: [Google],
})
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '../db/schema';
import bcrypt from 'bcryptjs';
import dbConnect from '../db/intit';
import { AuthOptions } from 'next-auth';
import type { JWT } from "next-auth/jwt";
import { type Session } from "next-auth";

interface User{
    email:string,
    password:string
}

type AuthorizedUser = {
    id: string;
    email: string;
};

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials: User | undefined):Promise<AuthorizedUser | null> {
                await dbConnect();
                
                if (!credentials) {
                    return null;
                }

                const userDetails = await User.findOne({
                    email: credentials.email
                });

                if (!userDetails) {
                    return null;
                }

                const passwordVerify = await bcrypt.compare(credentials.password, userDetails.password);
                
                if (!passwordVerify) {
                    return null;
                }
             
                return {
                    id: userDetails._id.toString(), 
                    email: userDetails.email,
                };
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: { // Corrected from 'callback' to 'callbacks'
       
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Use 'id' for consistency
            }
            return token;
        },
    
        async session({ session, token }:{ session: Session; token: JWT }) {
            if (session.user) {
                 // @ts-expect-error: TODO: Define a proper type for this API response post-MVP
                (session.user).id = token.id; 
            }
            return session;
        }
    },
    pages: {
        signIn: "/signin"
    }
};
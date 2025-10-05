import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '../db/schema';
import bcrypt from 'bcryptjs';
import dbConnect from '../db/intit';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials: any) {
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
        async session({ session, token ,user}) {
            if (session.user) {
                (session.user as any).id = token.id; // Cast to 'any' or augment session type

            }
            return session;
        }
    },
    pages: {
        signIn: "/signin"
    }
};
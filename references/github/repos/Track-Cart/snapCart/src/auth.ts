import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        if (typeof credentials.password !== "string") {
          throw new Error("Invalid password");
        }

        const email = credentials.email.toLowerCase();

        await connectDb();

        const user = await User.findOne({ email });
        if (!user) throw new Error("User does not exist");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        await connectDb();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          try {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          } catch (e: any) {
            if (e.code === 11000) {
              dbUser = await User.findOne({ email: user.email });
            } else {
              throw e;
            }
          }
        }

        user.id = dbUser!._id.toString();
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      await connectDb();

      // First login
      if (user?.id) {
        const dbUser = await User.findById(user.id);
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
      }

      // Refresh role on every request
      if (token?.id) {
        const dbUser = await User.findById(token.id).select("role");
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      // Manual session update support
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
});

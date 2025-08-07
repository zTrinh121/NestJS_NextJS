import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/errors";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(">> credentials: ", credentials);
        
        const res = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const responseData = await res.json();
        console.log(">> res: ", responseData);

        if(res.ok){
          return {
            _id: responseData.user._id,
            email: responseData.user.email,
            name: responseData.user.name,
            access_token: responseData.access_token,
          }
        }else if (res.status === 401){
          throw new InvalidEmailPasswordError();
        }else if (res.status === 400){
          throw new InactiveAccountError();
        }else throw new Error("Something went wrong");
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    session({ session, token }) {
      session.user = token.user as any
      return session
    },
  },
});

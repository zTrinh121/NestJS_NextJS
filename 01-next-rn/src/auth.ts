import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InvalidEmailPasswordError } from "./utils/errors";
import { sendRequest } from "./utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        console.log(">> credentials: ", credentials);
        const res = await sendRequest({
          method: "POST",
          url: "http://localhost:8080/api/v1/auth/login",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        console.log(">> res: ", res);
        console.log(">> user ", user);

        if (!user) {
          throw new InvalidEmailPasswordError();
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
});

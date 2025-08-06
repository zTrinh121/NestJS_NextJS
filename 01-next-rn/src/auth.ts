import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        console.log('>> check credentials', credentials)
 
       // call backedn API to validate user credentials
      //  user = {
      //     id: "1",
      //     name: "John Doe",
      //     email: "john.doe@example.com",
      //     isVerify: true,
      //     type: "user",
      //     role: "user",
      //  };
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
    pages: {
    signIn: "/auth/login",
  },
})
"use server"

import {signIn} from "@/auth";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            email: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if((error as any).name === "InvalidEmailPasswordError"){
            return {
                error: (error as any).type || "Invalid email or password",
                code: 1
            }
        }else if((error as any).name === "InactiveAccountError"){
            return {
                error: (error as any).type || "Account is inactive",
                code: 2
            }
        }else{
            return{
                error: "Interna; Server Error",
                code: 0
            }
        }
       
    }
}
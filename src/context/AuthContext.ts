import type { User, UserCredential } from "firebase/auth"
import { createContext } from "react"


interface AuthContextType {
    currentUser: User | null,

    signUp: (email: string, password: string) => Promise<UserCredential>,
    logIn: (email: string, password: string) => Promise<UserCredential>,
    logOut: () => void,


}

export const AuthContext = createContext<AuthContextType | null>(null)
import type { User, UserCredential } from "firebase/auth"
import { createContext } from "react"


interface AuthContextType {
    currentUser: User | null,

    signUp: (email: string, password: string) => Promise<UserCredential>,
    logIn: (email: string, password: string) => Promise<UserCredential>,
    logOut: () => void,

    changeEmail: (email: string) => Promise<void>,
    changeUserName: (name: string) => Promise<void>,
    changePhotoUrl: (url: string) => Promise<void>,
    changePassword: (password: string) => Promise<void>

    userName: string | null
    userEmail: string | null

}

export const AuthContext = createContext<AuthContextType | null>(null)
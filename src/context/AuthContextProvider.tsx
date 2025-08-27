import { useEffect, useState, type PropsWithChildren } from "react"
import { AuthContext } from "./AuthContext"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { auth } from "../services/Firebase"

const AuthContextProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [currentUser, setCurrentUser]= useState< User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return unsubscribe
    },[])

    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () =>{
        return signOut(auth)
    }

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }


    return (

    <AuthContext.Provider value={{
        currentUser,
        logIn,
        logOut,
        signUp,
    }}>

        { children }

    </AuthContext.Provider>


)}

export default AuthContextProvider
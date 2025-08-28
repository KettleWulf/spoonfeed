import { useEffect, useState, type PropsWithChildren } from "react"
import { AuthContext } from "./AuthContext"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile, type User } from "firebase/auth"
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

    const changeEmail = (email: string, ) =>{

        if(!currentUser){
            throw new Error("You must be logged in to update your email");
            
        }

        return updateEmail(currentUser, email)
    }


    const changeUserName = (name: string, ) =>{

        if(!currentUser){
            throw new Error("You must be logged in to update your Name");
            
        }

        return updateProfile(currentUser, {displayName: name})
    }

     const changePhotoUrl = (url: string, ) =>{

        if(!currentUser){
            throw new Error("You must be logged in to update your photo");
            
        }

        return updateProfile(currentUser, {photoURL: url})
    }


     const changePassword = (password: string, ) =>{

        if(!currentUser){
            throw new Error("You must be logged in to update your password");
            
        }

        return updatePassword(currentUser, password)
    }

    return (

    <AuthContext.Provider value={{
        currentUser,
        logIn,
        logOut,
        signUp,
        changeEmail,
        changeUserName,
        changePassword,
        changePhotoUrl,
    }}>

        { children }

    </AuthContext.Provider>


)}

export default AuthContextProvider
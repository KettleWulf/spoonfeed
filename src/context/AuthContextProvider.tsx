import { useEffect, useState, type PropsWithChildren } from "react"
import { AuthContext } from "./AuthContext"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile, type User } from "firebase/auth"
import { auth } from "../services/Firebase"

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)


    const reloadForm =  () => {


        if (!currentUser) {
            throw new Error("You must be logged in");

        }


        setUserName(currentUser.displayName)
        setUserEmail(currentUser.email)

        return 
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)

            if (user) {
                setUserName(user.displayName)
                setUserEmail(user.email)
            } else {
                setUserName(null)
                setUserEmail(null)
            }

            setLoading(false)
        })

        return unsubscribe
    }, [])


    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        return signOut(auth)
    }

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const changeEmail = (email: string,) => {

        if (!currentUser) {
            throw new Error("You must be logged in to update your email");

        }

        return updateEmail(currentUser, email)
    }


    const changeUserName = (name: string,) => {

        if (!currentUser) {
            throw new Error("You must be logged in to update your Name");

        }

        return updateProfile(currentUser, { displayName: name })
    }

    const changePhotoUrl = (url: string,) => {

        if (!currentUser) {
            throw new Error("You must be logged in to update your photo");

        }

        return updateProfile(currentUser, { photoURL: url })
    }


    const changePassword = (password: string,) => {

        if (!currentUser) {
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
            userName,
            userEmail,
            reloadForm,
        }}>

            {loading ? (<div>Loading</div>
            ) : children

            }

        </AuthContext.Provider>


    )
}

export default AuthContextProvider
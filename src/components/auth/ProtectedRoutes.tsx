
import useAuth from '../../hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    throw new Error("You must be logged in");
  }


  return (

    currentUser ? <Outlet /> : <Navigate to={"/"} />

  )

}


export default ProtectedRoutes
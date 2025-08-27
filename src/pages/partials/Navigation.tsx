import { useContext } from "react"
import { Container, NavDropdown } from "react-bootstrap"
import { Nav } from "react-bootstrap"
import { Navbar } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import { FirebaseError } from "firebase/app"
import { toast } from "react-toastify"


const Navigation = () => {

    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error("Trying to use authcontext outside of authcontextprovider");

    }

    const { currentUser, logOut } = authContext

    const handleLogOut = async () => {

        try {

           const logout =  await logOut()

           return logout

        } catch (e) {
            if (e instanceof FirebaseError) {
                toast.error(e.message)
            } else if (e instanceof Error) {
                toast.error(e.message)
            }
        }
    }

    return (
        <>
            <Navbar bg="success" variant="dark">
                <Container>
                    <Navbar.Brand href="*">Namn på sidan </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="*">About us</Nav.Link>
                        <Nav.Link href="*">Resturants</Nav.Link>
                        <Nav.Link href="*">Send us a tip</Nav.Link>
                        {currentUser

                            ?
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={currentUser.email}
                                menuVariant="dark"
                            >

                                <NavDropdown.Item 
                                 className="text-danger fw-bold"
                                 onClick={handleLogOut} href="*"
                                >
                                        Log Out
                                </NavDropdown.Item>
                            </NavDropdown>

                            : <Nav.Link href="/login">Log In</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>

        </>
    )
}

export default Navigation
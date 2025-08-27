import { useContext } from "react"
import { Container } from "react-bootstrap"
import { Nav } from "react-bootstrap"
import { Navbar } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"


const Navigation = () => {

     const authContext = useContext(AuthContext)
    
        if (!authContext) {
            throw new Error("Trying to use authcontext outside of authcontextprovider");
    
        }
    
        const { currentUser } = authContext

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
                        ? <p>{currentUser.email}</p>
                        : <Nav.Link href="/login">Log In</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>
            
        </>
    )
}

export default Navigation
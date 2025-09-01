import { Container, NavDropdown } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router";

const Navigation = () => {

    const { currentUser, logOut } = useAuth()

    const handleLogOut = async () => {

        try {

            const logout = await logOut()

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
                    <Navbar.Brand as={Link} to="/">Namn på sidan </Navbar.Brand>
                    <Nav>
                        <Nav.Link as={NavLink} to="/about">About us</Nav.Link>
                        <Nav.Link as={NavLink} to="/places">Resturants</Nav.Link>
                        <Nav.Link as={NavLink} to="/tips">Send us a tip</Nav.Link>
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
    );
};

export default Navigation;

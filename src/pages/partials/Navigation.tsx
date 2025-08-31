import { Container, Image, NavDropdown } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

const Navigation = () => {

    const { currentUser, logOut, userUrl, userEmail, userName } = useAuth()

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
                    <Navbar.Brand href="/">Namn på sidan </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="*">About us</Nav.Link>
                        <Nav.Link href="*">Resturants</Nav.Link>
                        <Nav.Link href="*">Send us a tip</Nav.Link>
                        {currentUser

                            ?
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={userUrl 
                                    ? 
                                    <Image
                                        src={userUrl}
                                        title={(userName || userEmail) || ""}
										className="img-cover"
										fluid
										height={30}
										width={30}
										roundedCircle
                                    />
                                    : userName || userEmail
                                }
                                menuVariant="dark"
                            >
                                <NavDropdown.Item
                                     href="/Profile"
                                >
                                    Profile
                                </NavDropdown.Item>

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

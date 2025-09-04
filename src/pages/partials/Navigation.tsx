import { Container, Image, NavDropdown } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router";
import loga from "../../assets/images/Loga.png"

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
            <Navbar className="navbar">
                <Container className={currentUser ?"m-0" : "d-flex justify-content-center"} >
                    
                           <Navbar.Brand as={Link} to="/"><Image className="loga" src={loga}></Image></Navbar.Brand>
                    <Nav>
                        {currentUser
                            ?
                            <>
                                <Nav.Link as={NavLink} to="/Admins">Admins</Nav.Link>

                                <Nav.Link as={NavLink} to="/Profile">Profile</Nav.Link>

                                <Nav.Link as={NavLink} to="/places">Resturants</Nav.Link>

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
                                    menuVariant=""
                                >
                                   
                                    <NavDropdown.Item
                                        className="btn"
                                        onClick={handleLogOut} href="/"
                                    >
                                        Log Out
                                    </NavDropdown.Item>

                                </NavDropdown>
                            </>

                            : <Nav.Link href="/login">Log In</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;

import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

const Navigation = () => {
	return (
		<>
			<Navbar bg="success" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Namn på sidan </Navbar.Brand>
					<Nav>
						<Nav.Link href="*">About us</Nav.Link>
						<Nav.Link href="*">Resturants</Nav.Link>
						<Nav.Link href="*">Send us a tip</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default Navigation;

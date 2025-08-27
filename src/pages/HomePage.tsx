
import { Col, Container, Row } from "react-bootstrap";
import EstablishmentFormModal from "../components/EstablishmentFormModal";
import Map from "../components/Map";


const HomePage = () => {
	return (
		<Container className="py-2">
			<Row className="justify-content-center">
				<Col md={8} lg={6}>
					<Map />
					<EstablishmentFormModal onSave={() => {}} isAdmin={true}/>
				</Col>
			</Row>
</Container>
	)
}


export default HomePage;

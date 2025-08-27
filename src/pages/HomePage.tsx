
import { Col, Container, Row } from "react-bootstrap";
import EstablishmentFormModal from "../components/EstablishmentFormModal";
import Map from "../components/Map";
import type { EstablishmentFormData } from "../types/Establishment.types";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { newEstablishmentsCol } from "../services/Firebase";
import { toast } from "react-toastify";


const HomePage = () => {

	const addEstablishment = async (establishment: EstablishmentFormData) => {
		// Create document with a generated ID
		const docRef = await addDoc(newEstablishmentsCol, {
			...establishment,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		console.log("Establishment created with ID:", docRef.id);
		console.log("Wrote to:", docRef.path);

		// 🥂
		toast.success("Establishment added!");
	}


	return (
		<Container className="py-2">
			<Row className="justify-content-center">
				<Col md={8} lg={6}>
					<Map />
					<EstablishmentFormModal onSave={addEstablishment} isAdmin={true}/>
				</Col>
			</Row>
</Container>
	)
}


export default HomePage;

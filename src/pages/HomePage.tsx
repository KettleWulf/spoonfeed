
import { Col, Container, Row } from "react-bootstrap";
import Map from "../components/Map";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { newPlacesCol } from "../services/Firebase";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import type { PlaceFormData } from "../types/Place.types";
import PlaceFormModal from "../components/PlaceFormModal";


const HomePage = () => {

	const { currentUser } = useAuth();

	const addPlace = async (place: PlaceFormData) => {
		// Create document with a generated ID
		await addDoc(newPlacesCol, {
			...place,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			isSuggestion: !currentUser
		});


		// 🥂
		toast.success("Place added!");
	}


	return (
		<Container className="py-2">
			<Row className="justify-content-center">
				<Col md={8} lg={6}>
					<Map />
					<PlaceFormModal onSave={addPlace} />
				</Col>
			</Row>
		</Container>
	)
}


export default HomePage;

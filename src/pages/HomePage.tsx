
import { Col, Container, Row } from "react-bootstrap";
import Map from "../components/Map";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { newPlacesCol } from "../services/Firebase";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import type { PlaceFormData } from "../types/Place.types";



const HomePage = () => {

	const { currentUser } = useAuth();

	const addPlace = async (place: PlaceFormData) => {
		// Create document with a generated ID
		const docRef = await addDoc(newPlacesCol, {
			...place,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			isSuggestion: !currentUser
		});
		console.log("Place created with ID:", docRef.id);
		console.log("Wrote to:", docRef.path);
		console.log("isSuggestion value:", !currentUser); // Debug
    	console.log("Current user:", currentUser);

		// 🥂
		toast.success("Place added!");
	}


	return (
		<Container className="py-2">
			<Row className="justify-content-center">
				<Col md={8} lg={6}>
					<Map onSavePlace={addPlace}/>
				</Col>
			</Row>
		</Container>
	)
}


export default HomePage;

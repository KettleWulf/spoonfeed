import { Card, Col, Container, Row } from "react-bootstrap";
import Map from "../components/Map";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { newPlacesCol } from "../services/Firebase";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import type { Place, PlaceFormData } from "../types/Place.types";
import { useGetPlacesByCity } from "../hooks/useGetPlacesByCity";
import SortableTable from "../components/SortableTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const HomePage = () => {
	const [ city, setCity ] = useState("");
	const { currentUser } = useAuth();
	const { data: places } = useGetPlacesByCity(city);

	console.log("PLACES", places);

	const columnDefs: ColumnDef<Place>[] = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "category", header: "Category" },
	];

	const setCityState = (city: string) => {
		setCity(city.split(",")[0]);
		console.log("CITY STATE HP", city.split(",")[0]);
	}

	const addPlace = async (place: PlaceFormData) => {
		await addDoc(newPlacesCol, {
			...place,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			isSuggestion: !currentUser,
		});
		toast.success("Place added!");
	};

	return (
		<Container fluid className="py-3">
			<Row className="g-4">

				<Col xs={12} lg={{ span: 4, offset: 4 }}>
					<Card className="shadow-sm rounded-3">
						<Card.Header as="h5" className="bg-white border-0">
							Nearby map
						</Card.Header>
						<Card.Body className="pt-0">
							<Map onSavePlace={addPlace} setCityString={setCityState}/>
						</Card.Body>
					</Card>
				</Col>


				<Col xs={12} lg={2} className="me-auto">
					<Card className="shadow-sm rounded-3 h-100">
						<Card.Header as="h5" className="bg-white border-0">
							Places
						</Card.Header>
						<Card.Body className="pt-0">
							{places && (
								<SortableTable
									columns={columnDefs}
									data={places}
									getRowLink={(row) => `/places/${row._id}`}
								/>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default HomePage;

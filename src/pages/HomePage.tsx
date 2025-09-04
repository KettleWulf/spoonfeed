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
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const HomePage = () => {
	const [city, setCity] = useState("");
	const { currentUser } = useAuth();
	const { data: places } = useGetPlacesByCity(city);
	console.log("HOME PAGE CITY", city);
	const [searchParams] = useSearchParams();

	console.log("PLACES", places);

	const columnDefs: ColumnDef<Place>[] = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "category", header: "Category" },
	];

	useEffect(() => {
		const queryCity = searchParams.get("query");
		if (queryCity && queryCity !== city) {
			setCity(queryCity);
		}
	}, [searchParams, city]);

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
				<Col xs={12} md={12} lg={9}>
					<Card className=" map text-center  shadow border-0 ">
						<Card.Header as="h2" className="bg-white border-0 map m-1">
							SpoonFeed
						</Card.Header>
						<Card.Body className="py-0">
							<Map onSavePlace={addPlace} />
						</Card.Body>
					</Card>
				</Col>

				<Col xs={12} md={12} lg={3} className="me-auto">
					<Card className=" cardHome  border-0 h-100">
						<Card.Header
							as="h3"
							className="bg-white border-0 cardHome text-center "
						>
							Places
						</Card.Header>
						<hr />
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

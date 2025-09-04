import type { ColumnDef } from "@tanstack/react-table";
import SortableTable from "../components/SortableTable";
import type { Place } from "../types/Place.types";
import { useGetPlaces } from "../hooks/useGetPlaces";
import { useGetSuggestions } from "../hooks/useGetSuggestions";
import { Card, Col, Container, Row } from "react-bootstrap";


const columnDefs: ColumnDef<Place>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "city",
		header: "City",
		meta: {
			align: "end",
		},
	},
	{
		accessorKey: "category",
		header: "Category",
	},
];


const PlacesPage = () => {


	const { data: places } = useGetPlaces();
	const { data: suggestions, isLoading } = useGetSuggestions();

	if (isLoading) <p>"Loading..."</p>

	return (
		<>

			<Container className="py-5 center-y">
				<Row>
					<Col>
						<Card className="mb-3 shadow-lg rounded-3 border-0">
							<Card.Body>
								<h2>Places</h2>
								{places && <SortableTable columns={columnDefs} data={places} getRowLink={(row) => `/places/${row._id}`} />}

								<hr />

								<h2>Places by city</h2>
								{placesByCity && <SortableTable columns={columnDefs} data={placesByCity} getRowLink={(row) => `/places/${row._id}`} />}

								<hr />

								<h2>Suggestions</h2>
								{suggestions && <SortableTable columns={columnDefs} data={suggestions} getRowLink={(row) => `/places/${row._id}`} />}

								<hr />

							</Card.Body>
						</Card>
					</Col>
				</Row >
			</Container >
		</>
	)
};

export default PlacesPage;

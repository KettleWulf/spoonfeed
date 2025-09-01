import type { ColumnDef } from "@tanstack/react-table";
import SortableTable from "../components/SortableTable";
import type { Place } from "../types/Place.types";
import { useGetPlacesByCity } from "../hooks/useGetPlacesByCity";
import { useGetPlaces } from "../hooks/useGetPlaces";
import { useGetSuggestions } from "../hooks/useGetSuggestions";


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

	const { data: placesByCity } = useGetPlacesByCity("Stockholm");
	const { data: places } = useGetPlaces();
	const { data: suggestions } = useGetSuggestions();

	// if (isLoading) <p>"I'm loading, chill..."</p>

	return (
		<>
			<h2>Places</h2>
			{places && <SortableTable columns={columnDefs} data={places} getRowLink={(row) => `/places/${row._id}`} />}

			<hr />

			<h2>Places by city</h2>
			{placesByCity && <SortableTable columns={columnDefs} data={placesByCity} getRowLink={(row) => `/places/${row._id}`} />}

			<hr />

			<h2>Suggestions</h2>
			{suggestions && <SortableTable columns={columnDefs} data={suggestions} getRowLink={(row) => `/places/${row._id}`} />}
		</>
	)
};

export default PlacesPage;

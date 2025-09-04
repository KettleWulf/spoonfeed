import type { ColumnDef } from "@tanstack/react-table";
import SortableTable from "../components/SortableTable";
import type { Place } from "../types/Place.types";
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


	const { data: places } = useGetPlaces();
	const { data: suggestions, isLoading } = useGetSuggestions();

	if (isLoading) <p>"Loading..."</p>

	return (
		<>
			<h2>Places</h2>
			{places && <SortableTable columns={columnDefs} data={places} getRowLink={(row) => `/places/${row._id}`} />}

			<hr />

			<h2>Suggestions</h2>
			{suggestions && <SortableTable columns={columnDefs} data={suggestions} getRowLink={(row) => `/places/${row._id}`} />}
				
			<hr />
		</>
	)
};

export default PlacesPage;

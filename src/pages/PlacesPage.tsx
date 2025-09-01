import type { ColumnDef } from "@tanstack/react-table";
import SortableTable from "../components/SortableTable";
import type { Place } from "../types/Place.types";
import useGetAllPlaces from "../hooks/useGetAllPlaces";

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

	const { data, isLoading } = useGetAllPlaces();

	if (isLoading) <p>"I'm loading, chill..."</p>

	return (
		<>
			<h1>Restaurants</h1>
			{data && <SortableTable columns={columnDefs} data={data} getRowLink={(row) => `/places/${row._id}`} />}
		</>
	)
};

export default PlacesPage;

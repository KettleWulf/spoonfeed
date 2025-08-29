import type { ColumnDef } from "@tanstack/react-table";
import SortableTable from "../components/SortableTable";
import useGetEstablishments from "../hooks/useGetEstablishments";
import type { Establishment } from "../types/Establishment.types";

const columnDefs: ColumnDef<Establishment>[] = [
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


const EstablishmentsPage = () => {

	const { data, isLoading } = useGetEstablishments();

	if (isLoading) <p>"I'm loading, chill..."</p>

	return (
		<>
			<h1>Restaurants</h1>
			{data && <SortableTable columns={columnDefs} data={data} />}
		</>
	)
};

export default EstablishmentsPage;

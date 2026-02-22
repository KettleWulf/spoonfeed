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

	if (isLoading) <p>"Loading..."</p>;

	return (
		<div className="py-2">
			<div className="rounded-2xl border border-white/70 bg-white p-6 shadow-lg">
				<h2 className="text-2xl font-semibold">Suggestions</h2>
				<div className="mt-3">
					{suggestions && (
						<SortableTable
							columns={columnDefs}
							data={suggestions}
							getRowLink={(row) => `/places/${row._id}`}
						/>
					)}
				</div>

				<hr className="my-8 border-emerald-100" />

				<h2 className="text-2xl font-semibold">Confirmed Locations</h2>
				<div className="mt-3">
					{places && (
						<SortableTable
							columns={columnDefs}
							data={places}
							getRowLink={(row) => `/places/${row._id}`}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default PlacesPage;

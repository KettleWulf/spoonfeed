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
	const [searchParams] = useSearchParams();

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
		<div className="py-3">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<section className="lg:col-span-9">
					<div className="rounded-2xl border border-white/70 bg-[whitesmoke] text-center shadow">
						<h2 className="m-1 rounded-xl bg-[whitesmoke] py-2 text-2xl font-semibold">
							SpoonFeed
						</h2>
						<div className="pb-2">
							<Map onSavePlace={addPlace} />
						</div>
					</div>
				</section>

				<aside className="lg:col-span-3">
					<div className="h-full rounded-2xl border border-white/60 bg-[#e8f5e9] shadow">
						<h3 className="px-4 py-3 text-center text-xl font-semibold">Places</h3>
						<hr className="border-emerald-100" />
						<div className="p-4 pt-2">
							{places && (
								<SortableTable
									columns={columnDefs}
									data={places}
									getRowLink={(row) => `/places/${row._id}`}
								/>
							)}
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default HomePage;

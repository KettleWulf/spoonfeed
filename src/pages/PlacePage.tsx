import { useNavigate, useParams } from "react-router";
import useGetPlace from "../hooks/useGetPlace";
import { firebaseTimestampToString } from "../helpers/time";
import DropZone from "../components/DropZone";
import useAuth from "../hooks/useAuth";
import useStreamPlaceImages from "../hooks/useStreamPlaceImages";
import noImgPiqture from "../assets/images/No_Image_Available.jpg";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../services/Firebase";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import type { PlaceFormData } from "../types/Place.types";
import PlaceFormModal from "../components/PlaceFormModal";

const PlacePage = () => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const { id } = useParams<{ id: string }>();
	const { data: place, isLoading, error } = useGetPlace(id);
	const { data: images } = useStreamPlaceImages(id);

	const [showEdit, setShowEdit] = useState(false);
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const initValues = useMemo<PlaceFormData | undefined>(() => {
		if (!place) return undefined;
		return {
			name: place.name,
			address: place.address,
			city: place.city,
			description: place.description,
			category: place.category,
			offers: place.offers,
			email: place.email,
			phone: place.phone,
			website: place.website,
			facebook: place.facebook,
			instagram: place.instagram,
			location: place.location,
		};
	}, [place]);

	const updatePlace = async (data: PlaceFormData) => {
		if (!id) return;
		try {
			await setDoc(
				doc(db, "places", id),
				{
					...data,
					isSuggestion: !currentUser,
					updatedAt: serverTimestamp(),
				},
				{ merge: true }
			);
			toast.success("Place updated");
		} catch (err) {
			console.error(err);
			toast.error("Failed to update place");
		}
	};

	const deletePlace = async () => {
		if (!id) return;
		try {
			await deleteDoc(doc(db, "places", id));
			toast.success("Place deleted");
			navigate("/");
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete place");
		}
	};

	const hasImages = !!images && images.length > 0;
	const safeImages = images ?? [];
	const activeImage = hasImages ? safeImages[activeImageIndex] : null;

	const handlePreviousImage = () => {
		if (!images?.length) return;
		setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		if (!images?.length) return;
		setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	if (isLoading) {
		return (
			<div className="py-4">
				<div className="rounded-xl bg-white p-4 shadow-sm">
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
						<span>Loading place...</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-4">
				<div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
					Failed to load place: {String(error)}
				</div>
			</div>
		);
	}

	if (!place || !id) {
		return (
			<div className="py-4">
				<div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
					Place not found.
				</div>
			</div>
		);
	}

	return (
		<div className="py-4">
			<div className="rounded-2xl border border-white/70 bg-white p-3 shadow">
				<div className="grid gap-4 lg:grid-cols-2">
					<section className="py-3">
						<h1 className="text-center text-[33px] font-semibold">{place.name}</h1>

						<hr className="mt-4 border-emerald-100" />
						<div className="mt-5 rounded-xl border border-white/70 bg-white p-4 shadow">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div className="text-gray-500">
									{place.address}, {place.city}
								</div>
								<div className="flex gap-2">
									<span className="rounded-full bg-gray-600 px-3 py-1 text-xs text-white">
										{place.category}
									</span>
									{place.isSuggestion && (
										<span className="rounded-full bg-amber-300 px-3 py-1 text-xs text-amber-900">
											Suggestion
										</span>
									)}
								</div>
							</div>

							{place.description && <p className="mt-3">{place.description}</p>}

							{place.offers && (
								<div className="mt-3">
									<div className="mb-1 font-semibold">Offers</div>
									<span className="rounded-full bg-gray-600 px-3 py-1 text-xs text-white">
										{place.offers}
									</span>
								</div>
							)}

							<div className="mt-4">
								<div className="mb-1 font-semibold">Contact</div>
								<div className="space-y-1">
									{place.phone && (
										<div>
											<span className="text-gray-500">Phone:</span> {place.phone}
										</div>
									)}
									{place.email && (
										<div>
											<span className="text-gray-500">Email:</span> {place.email}
										</div>
									)}
									{place.website && (
										<div>
											<span className="text-gray-500">Website:</span> {place.website}
										</div>
									)}
									{place.facebook && (
										<div>
											<span className="text-gray-500">Facebook:</span> {place.facebook}
										</div>
									)}
									{place.instagram && (
										<div>
											<span className="text-gray-500">Instagram:</span> {place.instagram}
										</div>
									)}
									{!place.phone &&
										!place.email &&
										!place.website &&
										!place.facebook &&
										!place.instagram && (
											<div className="text-gray-500">No contact information provided.</div>
										)}
								</div>
							</div>
							{currentUser && (
								<div className="mt-3 flex justify-end">
									<button
										type="button"
										onClick={() => setShowEdit(true)}
										className="rounded-md bg-[#5e936c] px-3 py-2 text-sm text-white transition-colors hover:bg-[#67c090] hover:text-black"
									>
										Edit
									</button>
								</div>
							)}
						</div>
					</section>

					<section>
						<div className="rounded-xl p-2">
							<h2 className="mt-4 text-center text-xl font-semibold">Pictures</h2>
							<hr className="my-4 border-emerald-100" />

							{activeImage ? (
								<div>
									<div className="flex h-[550px] w-full items-center justify-center">
										<img
											src={activeImage.url}
											alt={`piqture on ${activeImage.name}`}
											className="h-full w-full rounded-[15px] object-cover"
										/>
									</div>
									{safeImages.length > 1 && (
										<div className="mt-3 flex items-center justify-center gap-2">
											<button
												type="button"
												onClick={handlePreviousImage}
												className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
											>
												Previous
											</button>
											<span className="text-sm text-gray-600">
												{activeImageIndex + 1} / {safeImages.length}
											</span>
											<button
												type="button"
												onClick={handleNextImage}
												className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
											>
												Next
											</button>
										</div>
									)}
								</div>
							) : (
								<div className="flex justify-center">
									<img
										alt="No Image Available"
										src={noImgPiqture}
										className="h-[200px] w-[200px] rounded-[15px] object-cover"
									/>
								</div>
							)}
						</div>
					</section>
				</div>

				{currentUser && <DropZone user={currentUser} placeId={id} />}
				<div className="mt-1 text-sm text-gray-500">
					{place.updatedAt && (
						<>Last Updated: {firebaseTimestampToString(place.updatedAt)}</>
					)}
				</div>
			</div>

			<PlaceFormModal
				show={showEdit}
				onHide={() => setShowEdit(false)}
				initValues={initValues}
				address={place?.address}
				city={place?.city}
				coords={place?.location}
				onSave={updatePlace}
				onDelete={currentUser ? deletePlace : undefined}
			/>
		</div>
	);
};

export default PlacePage;

import { useForm, type SubmitHandler } from "react-hook-form";
import type {
	Category,
	Location,
	Offer,
	PlaceFormData,
} from "../types/Place.types";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const CATEGORY_OPTIONS: Category[] = [
	"Café",
	"Restaurant",
	"Fast food",
	"Bodega",
	"Foodtruck",
	"Slop house",
];
const OFFER_OPTIONS: Offer[] = [
	"Breakfast",
	"Lunch",
	"After Work",
	"Á la carte",
];

interface PlaceFormModalProps {
	show: boolean;
	onHide: () => void;
	initValues?: PlaceFormData;
	address?: string;
	city?: string;
	coords?: Location;
	onSave: (establishment: PlaceFormData) => void;
	onDelete?: () => void;
}

const inputBaseClass =
	"w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2";

const PlaceFormModal: React.FC<PlaceFormModalProps> = ({
	onSave,
	onDelete,
	initValues,
	show,
	address,
	city,
	coords,
	onHide,
}) => {
	const { currentUser } = useAuth();

	const {
		handleSubmit,
		register,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<PlaceFormData>({
		defaultValues: {
			...initValues,
			email: initValues?.email ?? "",
			phone: initValues?.phone ?? "",
			website: initValues?.website ?? "",
			facebook: initValues?.facebook ?? "",
			instagram: initValues?.instagram ?? "",
		},
	});

	useEffect(() => {
		if (show && initValues) {
			reset({
				...initValues,
				email: initValues.email ?? "",
				phone: initValues.phone ?? "",
				website: initValues.website ?? "",
				facebook: initValues.facebook ?? "",
				instagram: initValues.instagram ?? "",
			});
		}
	}, [show, initValues, reset]);

	useEffect(() => {
		if (show && address) {
			const parts = address.split(",");
			const street = parts.length > 2 ? parts[0].trim() : address;
			setValue("address", street);
			if (city) setValue("city", city);
		}
	}, [show, address, city, setValue]);

	const withProtocol = (url: string) =>
		url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;

	const onFormSubmit: SubmitHandler<PlaceFormData> = (data) => {
		const placeData: PlaceFormData = {
			...data,
			website: data.website ? withProtocol(data.website) : "",
			facebook: data.facebook ? withProtocol(data.facebook) : "",
			instagram: data.instagram ? withProtocol(data.instagram) : "",
			...(coords && { location: { lat: coords.lat, lng: coords.lng } }),
		};

		onSave(placeData);
		reset();
		onHide();
	};

	const handleClose = () => {
		if (isSubmitting) return;
		reset();
		onHide();
	};

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-[whitesmoke] p-4 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold">
						{currentUser && initValues
							? "Edit Place"
							: currentUser
							? "Add Place"
							: "Suggest Place"}
					</h2>
					<button
						type="button"
						onClick={handleClose}
						className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
					>
						Close
					</button>
				</div>

				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
					<div>
						<label htmlFor="name" className="mb-1 block text-sm font-medium">
							Name
						</label>
						<input
							id="name"
							type="text"
							className={inputBaseClass}
							placeholder="Enter name of establishment"
							{...register("name", {
								required: "Please enter name of establishment",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-600">
								{errors.name.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="address" className="mb-1 block text-sm font-medium">
							Address
						</label>
						<input
							id="address"
							type="text"
							className={inputBaseClass}
							placeholder="Enter address of establishment"
							{...register("address", {
								required: "Please enter address of establishment",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.address && (
							<p className="mt-1 text-sm text-red-600">
								{errors.address.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="city" className="mb-1 block text-sm font-medium">
							City
						</label>
						<input
							id="city"
							type="text"
							className={inputBaseClass}
							placeholder="Enter name of city"
							{...register("city", {
								required: "Please enter city",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.city && (
							<p className="mt-1 text-sm text-red-600">
								{errors.city.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="description"
							className="mb-1 block text-sm font-medium"
						>
							Description
						</label>
						<textarea
							id="description"
							rows={3}
							className={inputBaseClass}
							placeholder="Describe the establishment (optional)..."
							{...register("description")}
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600">
								{errors.description.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="category" className="mb-1 block text-sm font-medium">
							Category
						</label>
						<select
							id="category"
							className={inputBaseClass}
							{...register("category", {
								required: "Please choose a category",
							})}
						>
							{CATEGORY_OPTIONS.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
						{errors.category && (
							<p className="mt-1 text-sm text-red-600">
								{errors.category.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="offers" className="mb-1 block text-sm font-medium">
							Offer
						</label>
						<select
							id="offers"
							className={inputBaseClass}
							{...register("offers", { required: "Please choose a service" })}
						>
							{OFFER_OPTIONS.map((offer) => (
								<option key={offer} value={offer}>
									{offer}
								</option>
							))}
						</select>
						{errors.offers && (
							<p className="mt-1 text-sm text-red-600">
								{errors.offers.message || "Invalid value"}
							</p>
						)}
					</div>

					<hr className="border-emerald-100" />
					<div className="font-semibold">Contact</div>

					<div>
						<label htmlFor="phone" className="mb-1 block text-sm font-medium">
							Phone
						</label>
						<input
							id="phone"
							type="tel"
							inputMode="tel"
							className={inputBaseClass}
							placeholder="+46 70 123 45 67"
							{...register("phone", {
								pattern: {
									value: /^[0-9+()\-\s]{6,}$/,
									message: "Please enter a valid phone number",
								},
							})}
						/>
						{errors.phone && (
							<p className="mt-1 text-sm text-red-600">
								{errors.phone.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="email" className="mb-1 block text-sm font-medium">
							Email
						</label>
						<input
							id="email"
							type="email"
							className={inputBaseClass}
							placeholder="name@example.com"
							{...register("email")}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">
								{errors.email.message || "Invalid value"}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="website" className="mb-1 block text-sm font-medium">
							Website
						</label>
						<input
							id="website"
							type="url"
							className={inputBaseClass}
							placeholder="https://example.com"
							{...register("website")}
						/>
					</div>

					<div>
						<label htmlFor="facebook" className="mb-1 block text-sm font-medium">
							Facebook
						</label>
						<input
							id="facebook"
							type="url"
							className={inputBaseClass}
							placeholder="https://facebook.com/yourpage"
							{...register("facebook")}
						/>
					</div>

					<div>
						<label htmlFor="instagram" className="mb-1 block text-sm font-medium">
							Instagram
						</label>
						<input
							id="instagram"
							type="url"
							className={inputBaseClass}
							placeholder="https://instagram.com/yourhandle"
							{...register("instagram")}
						/>
					</div>

					{coords && (
						<p className="text-sm text-gray-500">
							Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
						</p>
					)}

					<div className="mt-4 flex flex-wrap justify-end gap-2">
						{currentUser && onDelete && (
							<button
								type="button"
								onClick={() => onDelete()}
								className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
							>
								Delete
							</button>
						)}
						<button
							type="button"
							onClick={handleClose}
							disabled={isSubmitting}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
						>
							Back
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-md bg-[#5e936c] px-4 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PlaceFormModal;

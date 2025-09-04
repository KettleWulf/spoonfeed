import { useForm, type SubmitHandler } from "react-hook-form";
import type {
	Category,
	Location,
	Offer,
	PlaceFormData,
} from "../types/Place.types";
import { Button, Modal, Form } from "react-bootstrap";
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
		reset();
		onHide();
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			backdrop="static"
			keyboard={!isSubmitting}
			centered
		>
			<Form onSubmit={handleSubmit(onFormSubmit)} className="m-3">
				<Modal.Header closeButton>
					<Modal.Title>
						{currentUser && initValues
							? "Edit Place"
							: currentUser
							? "Add Place"
							: "Suggest Place"}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{/* Name */}
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter name of establishment"
							{...register("name", {
								required: "Please enter name of establishment",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.name && (
							<div className="form-text text-danger">
								{errors.name.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* Address */}
					<Form.Group className="mb-3" controlId="address">
						<Form.Label>Address</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter address of establishment"
							{...register("address", {
								required: "Please enter address of establishment",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.address && (
							<div className="form-text text-danger">
								{errors.address.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* City */}
					<Form.Group className="mb-3" controlId="city">
						<Form.Label>City</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter name of city"
							{...register("city", {
								required: "Please enter city",
								minLength: { value: 2, message: "At least 2 characters" },
							})}
						/>
						{errors.city && (
							<div className="form-text text-danger">
								{errors.city.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* Description */}
					<Form.Group className="mb-3" controlId="description">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Describe the establishment (optional)..."
							{...register("description")}
						/>
						{errors.description && (
							<div className="form-text text-danger">
								{errors.description.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* Category */}
					<Form.Group className="mb-3" controlId="category">
						<Form.Label>Category</Form.Label>
						<Form.Select
							isInvalid={!!errors.category}
							{...register("category", {
								required: "Please choose a category",
							})}
						>
							{CATEGORY_OPTIONS.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</Form.Select>
						{errors.category && (
							<div className="form-text text-danger">
								{errors.category.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* Offer */}
					<Form.Group className="mb-3" controlId="offers">
						<Form.Label>Offer</Form.Label>
						<Form.Select
							isInvalid={!!errors.offers}
							{...register("offers", { required: "Please choose a service" })}
						>
							{OFFER_OPTIONS.map((offer) => (
								<option key={offer} value={offer}>
									{offer}
								</option>
							))}
						</Form.Select>
						{errors.offers && (
							<div className="form-text text-danger">
								{errors.offers.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					{/* Contact */}
					<hr />
					<div className="fw-semibold mb-2">Contact</div>

					<Form.Group className="mb-3" controlId="phone">
						<Form.Label>Phone</Form.Label>
						<Form.Control
							type="tel"
							inputMode="tel"
							placeholder="+46 70 123 45 67"
							{...register("phone", {
								pattern: {
									value: /^[0-9+()\-\s]{6,}$/,
									message: "Please enter a valid phone number",
								},
							})}
						/>
						{errors.phone && (
							<div className="form-text text-danger">
								{errors.phone.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					<Form.Group className="mb-3" controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="name@example.com"
							{...register("email")}
						/>
						{errors.email && (
							<div className="form-text text-danger">
								{errors.email.message || "Invalid value"}
							</div>
						)}
					</Form.Group>

					<Form.Group className="mb-3" controlId="website">
						<Form.Label>Website</Form.Label>
						<Form.Control
							type="url"
							placeholder="https://example.com"
							{...register("website")}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="facebook">
						<Form.Label>Facebook</Form.Label>
						<Form.Control
							type="url"
							placeholder="https://facebook.com/yourpage"
							{...register("facebook")}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="instagram">
						<Form.Label>Instagram</Form.Label>
						<Form.Control
							type="url"
							placeholder="https://instagram.com/yourhandle"
							{...register("instagram")}
						/>
					</Form.Group>

					{coords && (
						<Form.Text className="text-muted d-block mb-2">
							Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
						</Form.Text>
					)}
				</Modal.Body>

				<Modal.Footer>
					{currentUser && onDelete && (
						<Button variant="danger" onClick={() => onDelete()}>
							Delete
						</Button>
					)}
					<Button
						variant="secondary"
						onClick={handleClose}
						disabled={isSubmitting}
					>
						Back
					</Button>
					<Button variant="primary" type="submit" disabled={isSubmitting}>
						Save
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default PlaceFormModal;

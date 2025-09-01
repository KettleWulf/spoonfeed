import { useForm, type SubmitHandler } from "react-hook-form";
import type {
	Category,
	EstablishmentFormData,
	Location,
	Offer,
} from "../types/Establishment.types";
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
	"Á la carte"
];

interface EstablishmentFormModalProps {
	show: boolean;
	onHide: () => void;
	initValues?: EstablishmentFormData;
	address?: string;
	coords?: Location;
	onSave: (establishment: EstablishmentFormData) => void;
}

const EstablishmentFormModal: React.FC<EstablishmentFormModalProps> = ({ 
	onSave, 
	initValues,
	show,
	address,
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
	} = useForm<EstablishmentFormData>({
		defaultValues: initValues,
	});

	useEffect(()=> {
		if(show && address){
			const addressParts = address.split(",");

			if(addressParts.length > 2) {
				const street = addressParts[0].trim();
				const city = addressParts[1].trim();

				setValue("address", street);
				setValue("city", city);
			} else {
				setValue("address", address);
			}
		}
	}, [show, address, setValue]);

	const onFormSubmit: SubmitHandler<EstablishmentFormData> = (data) => {
		const placeData = {
			...data,
			...(coords && {
				location: {
					lat: coords.lat,
					lng: coords.lng,
				}
			})
		}
		console.log(placeData);

		onSave(placeData);

		reset(); // maybe reset, maybe not?
		onHide();
	}

	const handleClose = () => {
		reset();
		onHide();
	}

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={!isSubmitting}
				centered
			>

				<Form onSubmit={handleSubmit(onFormSubmit)} className="m-3">

					<Modal.Header closeButton>
						<Modal.Title>Add Establishment</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name of establishment"
								{...register("name", {
									required: "Please enter name of establishment",
									minLength: {
										value: 2,
										message: "Atleast 2 characters, dude",
									},
								})}
							/>
							{errors.name && (
								<div className="form-text text-danger text-small">{errors.name.message || "Invalid value"}</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="adress">
							<Form.Label>Address</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter address of establishment"
								{...register("address", {
									required: "Please enter address of establishment",
									minLength: {
										value: 2,
										message: "Atleast 2 characters, dude",		// bättre validering? Minst 5 chars och 1 siffra?
									},
								})}
							/>
							{errors.address && (
								<div className="form-text text-danger text-small">{errors.address.message || "Invalid value"}</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="city">
							<Form.Label>City</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name of city"
								{...register("city", {
									required: "Please enter city",
									minLength: {
										value: 2,
										message: "Atleast 2 characters, dude",
									},
								})}
							/>
							{errors.city && (
								<div className="form-text text-danger text-small">{errors.city.message || "Invalid value"}</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Describe the establishment (optional)..."
								{...register("description")}
							/>
							{errors.description && (
								<div className="form-text text-danger text-small">{errors.description.message || "Invalid value"}</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="category">
							<Form.Label>Category</Form.Label>
							<Form.Select
								isInvalid={!!errors.category}
								{...register("category", { required: "Please choose a category" })}
							>
								{CATEGORY_OPTIONS.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</Form.Select>
							{errors.category && (
								<div className="form-text text-danger text-small">{errors.category.message || "Invalid value"}</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="Offers">
							<Form.Label>Offers</Form.Label>
							<Form.Select
								isInvalid={!!errors.offers}
								{...register("offers", { required: "Please choose a service" })}
							>
								{OFFER_OPTIONS.map((o) => (
									<option key={o} value={o}>
										{o}
									</option>
								))}
							</Form.Select>
							{errors.offers && (
								<div className="form-text text-danger text-small">{errors.offers.message || "Invalid value"}</div>
							)}
							{coords && (
								<Form.Text className="text-muted d-block mb-2">
									Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
								</Form.Text>
							)}
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						{initValues && currentUser && (
							<Button variant="danger" onClick={() => {}}>Delete</Button>
						)}
						<Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
							Avbryt
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={isSubmitting}
							onClick={() => {
								// säkerställ att offers valideras (minst 1)
								// if (!offers || offers.length === 0) {
								// 	// trigga manuell felindikator
								// }
							}}
						>
							Save
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
};

export default EstablishmentFormModal;

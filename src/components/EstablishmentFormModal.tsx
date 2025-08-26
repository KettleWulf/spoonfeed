import { useForm, type SubmitHandler } from "react-hook-form";
import type {
	Category,
	EstablishmentFormData,
	Offer,
} from "../types/Establishment.types";
import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

const CATEGORY_OPTIONS: Category[] = [
	"Café",
	"Restaurang",
	"Snabbmat",
	"Kiosk/grill",
	"Foodtruck",
];

const OFFER_OPTIONS: Offer[] = ["Fika", "Lunch", "After Work", "Á la carte"];

interface EstablishmentFormModalProps {
	initValues?: EstablishmentFormData;
	isAdmin: boolean;
	onSave: (establishment: EstablishmentFormData) => void;
}

const EstablishmentFormModal: React.FC<EstablishmentFormModalProps> = ({ onSave, isAdmin = false, initValues }) => {
	
	const [show, setShow] = useState(false);
	const open = () => setShow(true);
	const close = () => setShow(false);

	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<EstablishmentFormData>({
		defaultValues: initValues,
	});

	const onFormSubmit: SubmitHandler<EstablishmentFormData> = (data) => {
		console.log(data);

		// Kontrollera om admin (spara data) eller gäst (spara tips, somehow?)
		if (isAdmin) {
			onSave(data);
		}

		reset(); // maybe reset, maybe not?
	}

	return (
		<>
			<Button onClick={open}>Lägg till matställe</Button>
			<Modal
				show={show}
				onHide={close}
				backdrop="static"
				keyboard={!isSubmitting}
				centered
			>

				<Form onSubmit={handleSubmit(onFormSubmit)}>

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
								{...register("address", {
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
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={close} disabled={isSubmitting}>
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
)};

export default EstablishmentFormModal;

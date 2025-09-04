import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { PasswordcheckCredentials } from "../../types/User.types";
import { toast } from "react-toastify";
import { Card } from "react-bootstrap";

type PasswordGuardProp = {
	password: string;
	correctPassword: () => void;
};

const PasswordGuard: React.FC<PasswordGuardProp> = ({
	correctPassword,
	password,
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<PasswordcheckCredentials>();

	const onPasswordGuard: SubmitHandler<PasswordcheckCredentials> = (data) => {
		if (data.password === password) {
			correctPassword();
			toast.success("Welcome my friend");
		} else {
			toast.error("Wrong password");
		}
	};

	return (
		<>
			<Card.Title className="mb-3">Welcome</Card.Title>

			<Form onSubmit={handleSubmit(onPasswordGuard)}>
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						{...register("password", {
							required: "Enter a Password",
						})}
					/>
					{errors.password && (
						<p className="text-danger">
							{errors.password.message || "invalid"}
						</p>
					)}
				</Form.Group>

				<Button variant="primary" type="submit" disabled={isSubmitting}>
					continue
				</Button>
			</Form>
		</>
	);
};

export default PasswordGuard;

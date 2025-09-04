import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { Link } from "react-router";

type Props = {
	onSubmit: SubmitHandler<SignUpCredentials>;
};

const SignUpForm: React.FC<Props> = ({ onSubmit }) => {
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<SignUpCredentials>();
	const password = watch("password");
	return (
		<>
			<Card.Title className="mb-3">Sign Up</Card.Title>

			{/* Sign up form */}
			<Form onSubmit={handleSubmit(onSubmit)}>
				{/* Email */}
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						{...register("email", {
							required: "You must enter an Email",
						})}
					/>
					{errors.email ? (
						<p className="text-danger">{errors.email.message || "invalid"}</p>
					) : (
						<Form.Text className="text-muted">
							We'll never share your email with anyone else.
						</Form.Text>
					)}
				</Form.Group>

				{/* Password */}
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						autoComplete="new-password"
						placeholder="Password"
						{...register("password", {
							required: "You must enter an password",
							minLength: {
								message: "Enter at least 6 characters",
								value: 6,
							},
						})}
					/>
					{errors.password && (
						<p className="text-danger">
							{errors.password.message || "invalid"}
						</p>
					)}
				</Form.Group>

				{/* Comfirm Password */}
				<Form.Group className="mb-3" controlId="formBasicCheckbox">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						autoComplete="off"
						placeholder="Confirm Password"
						{...register("confirmPassword", {
							required: "You must enter an password",
							validate: (value) =>
								value === password || "Paswords do not match",
						})}
					/>
					{errors.confirmPassword && (
						<p className="text-danger">
							{errors.confirmPassword.message || "invalid"}
						</p>
					)}
				</Form.Group>
				<Button variant="primary" type="submit" disabled={isSubmitting}>
					Submit
				</Button>
			</Form>

			<div className="text-center">
				Already have an account <Link to="/Login">Log in</Link>
			</div>
		</>
	);
};

export default SignUpForm;

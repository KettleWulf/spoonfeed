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
			<h1 className="mb-3 text-2xl font-semibold">Sign Up</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor="signup-email" className="block text-sm font-medium">
						Email address
					</label>
					<input
						id="signup-email"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="email"
						placeholder="Enter email"
						{...register("email", {
							required: "You must enter an Email",
						})}
					/>
					{errors.email ? (
						<p className="text-sm text-red-600">
							{errors.email.message || "invalid"}
						</p>
					) : (
						<p className="text-xs text-gray-500">
							We'll never share your email with anyone else.
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label htmlFor="signup-password" className="block text-sm font-medium">
						Password
					</label>
					<input
						id="signup-password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
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
						<p className="text-sm text-red-600">
							{errors.password.message || "invalid"}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label htmlFor="signup-confirm-password" className="block text-sm font-medium">
						Confirm Password
					</label>
					<input
						id="signup-confirm-password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
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
						<p className="text-sm text-red-600">
							{errors.confirmPassword.message || "invalid"}
						</p>
					)}
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-[#5e936c] px-4 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
				>
					Submit
				</button>
			</form>

			<div className="mt-3 text-center text-sm">
				Already have an account <Link to="/Login">Log in</Link>
			</div>
		</>
	);
};

export default SignUpForm;

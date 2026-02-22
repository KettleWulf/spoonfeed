import { useForm, type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { Link } from "react-router";

type Props = {
	onSubmit: SubmitHandler<SignUpCredentials>;
};

const LogInForm: React.FC<Props> = ({ onSubmit }) => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<SignUpCredentials>();
	return (
		<>
			<h1 className="mb-3 text-2xl font-semibold">Log In</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor="email" className="block text-sm font-medium">
						Email address
					</label>
					<input
						id="email"
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
					<label htmlFor="password" className="block text-sm font-medium">
						Password
					</label>
					<input
						id="password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="password"
						autoComplete="new-password"
						placeholder="Password"
						{...register("password", {
							required: "You must enter an password",
							minLength: {
								message: "Enter at least a few characters",
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

				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-[#5e936c] px-4 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
				>
					Log In
				</button>
			</form>

			<div className="mt-3 text-center text-sm">
				<p>
					Have you <Link to="/forgot-Password">Forgot Password</Link> Create a
					Admin <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</>
	);
};

export default LogInForm;

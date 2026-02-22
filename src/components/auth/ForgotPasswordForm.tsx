import { useForm, type SubmitHandler } from "react-hook-form";
import type { ForgotPasswordCredentials } from "../../types/User.types";

type ForgotPasswordFormProps = {
	onForgotPassword: SubmitHandler<ForgotPasswordCredentials>;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
	onForgotPassword,
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordCredentials>();

	return (
		<>
			<h1 className="mb-3 text-2xl font-semibold">Forgot Password</h1>

			<form onSubmit={handleSubmit(onForgotPassword)} className="space-y-4">
				<div className="space-y-1">
					<label
						htmlFor="forgot-password-email"
						className="block text-sm font-medium"
					>
						Email address
					</label>
					<input
						id="forgot-password-email"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="email"
						placeholder="Email"
						{...register("email", {
							minLength: {
								value: 3,
								message: "You have to have at least 3 characters long",
							},
						})}
					/>
					{errors.email && (
						<p className="text-sm text-red-600">
							{errors.email.message || "invalid"}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-[#5e936c] px-4 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
				>
					Send
				</button>
			</form>
		</>
	);
};

export default ForgotPasswordForm;

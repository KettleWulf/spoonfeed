import { useForm, type SubmitHandler } from "react-hook-form";
import type { PasswordcheckCredentials } from "../../types/User.types";
import { toast } from "react-toastify";

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
			<h1 className="mb-3 text-2xl font-semibold">Welcome</h1>

			<form onSubmit={handleSubmit(onPasswordGuard)} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor="guard-password" className="block text-sm font-medium">
						Password
					</label>
					<input
						id="guard-password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="password"
						{...register("password", {
							required: "Enter a Password",
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
					continue
				</button>
			</form>
		</>
	);
};

export default PasswordGuard;

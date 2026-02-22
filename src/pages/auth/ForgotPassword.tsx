import { type SubmitHandler } from "react-hook-form";
import type { ForgotPasswordCredentials } from "../../types/User.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
	const { forgotPassword } = useAuth();

	const onForgotPassword: SubmitHandler<ForgotPasswordCredentials> = async (
		data
	) => {
		try {
			await forgotPassword(data.email);

			toast.success(
				"We have send you an link to your email to reset your password (also check your spam)"
			);
		} catch (e) {
			if (e instanceof FirebaseError) {
				toast.error(e.message);
			} else if (e instanceof Error) {
				toast.error(e.message);
			}
		}
	};

	return (
		<div className="flex min-h-[70vh] items-center justify-center py-5">
			<div className="w-full max-w-xl rounded-2xl border border-white/70 bg-[whitesmoke] p-6 shadow-lg">
				<ForgotPasswordForm onForgotPassword={onForgotPassword} />
			</div>
		</div>
	);
};

export default ForgotPassword;

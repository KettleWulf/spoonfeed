import { useNavigate } from "react-router";
import { type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import useAuth from "../../hooks/useAuth";
import LogInForm from "../../components/auth/LogInForm";

const LoginPage = () => {
	const navigate = useNavigate();

	const { logIn } = useAuth();

	const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {
		try {
			await logIn(data.email, data.password);

			toast.success("Welcome Back My Friend");

			navigate("/");
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
				<LogInForm onSubmit={onSubmit} />
			</div>
		</div>
	);
};

export default LoginPage;

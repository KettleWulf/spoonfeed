import SignUpForm from "../../components/auth/SignUpForm";
import { useState } from "react";
import PasswordGuard from "../../components/auth/PasswordGuard";
import { type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { usersCol } from "../../services/Firebase";
import { doc, setDoc } from "firebase/firestore";

const password = import.meta.env.VITE_SECRET_PASSWORD_TO_LOGIN;

const SignupPage = () => {
	const navigate = useNavigate();
	const [passwordCheck, setPasswordCheck] = useState(false);

	const { signUp } = useAuth();

	const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {
		try {
			const cred = await signUp(data.email, data.password);
			const uid = cred.user.uid;

			await setDoc(
				doc(usersCol, uid),
				{
					_id: uid,
					email: data.email,
				},
				{ merge: true } // ersätter inte hela dokumentet om det redan finns, enbart säkerhetsåtgärd
			);

			toast.success("Welcome to the team");
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
				{passwordCheck ? (
					<SignUpForm onSubmit={onSubmit} />
				) : (
					<PasswordGuard
						password={password}
						correctPassword={() => setPasswordCheck(true)}
					/>
				)}
			</div>
		</div>
	);
};

export default SignupPage;

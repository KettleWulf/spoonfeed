import blankProfile from "../../assets/images/blank-profile-picture-973460_1280.png";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UppdateUserCredentials } from "../../types/User.types";
import type { User } from "firebase/auth";

type UpdateProfileFromProps = {
	currentUser: User | null;
	userUrl: string | null;
	userEmail: string | null;
	userName: string | null;
	onUppdateProfile: SubmitHandler<UppdateUserCredentials>;
};

const UpdateProfileFrom: React.FC<UpdateProfileFromProps> = ({
	currentUser,
	userUrl,
	userEmail,
	userName,
	onUppdateProfile,
}) => {
	const [urlUpload, seturlUpload] = useState<string | null>(null);

	const {
		handleSubmit,
		register,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<UppdateUserCredentials>({
		defaultValues: {
			email: userEmail ?? "",
			username: userName ?? "",
		},
	});

	const password = watch("password");
	return (
		<>
			<div className="flex justify-center">
				<img
					alt={currentUser?.photoURL ?? blankProfile}
					src={userUrl || urlUpload || undefined}
					className="aspect-square w-3/4 max-w-48 rounded-full object-cover"
				/>
			</div>

			<form onSubmit={handleSubmit(onUppdateProfile)} className="mt-6 space-y-4">
				<div className="space-y-1">
					<label htmlFor="profile-email" className="block text-sm font-medium">
						Email address
					</label>
					<input
						id="profile-email"
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
					<label htmlFor="profile-name" className="block text-sm font-medium">
						Name
					</label>
					<input
						id="profile-name"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="text"
						placeholder="Sven"
						{...register("username", {
							minLength: {
								value: 3,
								message: "You have to have at least 3 characters long",
							},
						})}
					/>
					{errors.username && (
						<p className="text-sm text-red-600">
							{errors.username.message || "invalid"}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label htmlFor="profile-photo" className="block text-sm font-medium">
						Profile Picture
					</label>
					<input
						id="profile-photo"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-emerald-700 file:px-3 file:py-1 file:text-white hover:file:bg-emerald-600 focus:ring-2 focus:ring-emerald-500"
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						{...register("photoUrl", {
							onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
								const file = e.currentTarget.files?.[0] ?? null;

								seturlUpload(file ? URL.createObjectURL(file) : null);
							},
						})}
					/>

					{errors.photoUrl && (
						<p className="text-sm text-red-600">
							{errors.photoUrl.message || "invalid"}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label htmlFor="profile-password" className="block text-sm font-medium">
						Password
					</label>
					<input
						id="profile-password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="password"
						autoComplete="new-password"
						placeholder="Password"
						{...register("password", {
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
					<label
						htmlFor="profile-confirm-password"
						className="block text-sm font-medium"
					>
						Confirm Password
					</label>
					<input
						id="profile-confirm-password"
						className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
						type="password"
						autoComplete="off"
						placeholder="Confirm Password"
						{...register("confirmPassword", {
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
					Save
				</button>
			</form>
		</>
	);
};

export default UpdateProfileFrom;

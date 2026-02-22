import { useForm, type SubmitHandler } from "react-hook-form";
import type { UppdateUserCredentials } from "../../types/User.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../services/Firebase";
import UpdateProfileFrom from "../../components/auth/UpdateProfileFrom";

const UppdateProfile = () => {
	const {
		currentUser,
		changeEmail,
		changePassword,
		changePhotoUrl,
		changeUserName,
		userName,
		userUrl,
		userEmail,
		reloadForm,
		updateUserDataName,
		updateUserDataPhoto,
	} = useAuth();

	const { reset } = useForm<UppdateUserCredentials>();

	const onUppdateProfile: SubmitHandler<UppdateUserCredentials> = async (
		data
	) => {
		if (!currentUser) {
			throw new Error("You must be logged in to update your Profile");
		}

		try {
			if (data.email !== (userEmail ?? "")) {
				await changeEmail(data.email);
			}

			if (data.username !== (userName ?? "")) {
				await changeUserName(data.username);

				await updateUserDataName(currentUser.uid, data.username);
			}

			if (data.photoUrl.length) {
				const photo = data.photoUrl[0];

				const fileRef = ref(
					storage,
					`ProfileImage/${currentUser.uid}/${photo.name}`
				);

				try {
					const uploadUrl = await uploadBytes(fileRef, photo);

					const photoUrl = await getDownloadURL(uploadUrl.ref);

					await changePhotoUrl(photoUrl);
					await updateUserDataPhoto(currentUser.uid, photoUrl);
				} catch (e) {
					if (e instanceof FirebaseError) {
						toast.error(e.message);
					} else if (e instanceof Error) {
						toast.error(e.message);
					}
				}
			}

			if (data.password) {
				await changePassword(data.password);
			}

			reloadForm();

			reset();

			toast.success("Success you updated your Profile");
		} catch (e) {
			if (e instanceof FirebaseError) {
				toast.error(e.message);
			} else if (e instanceof Error) {
				toast.error(e.message);
			}
		}
	};

	return (
		<div className="flex min-h-[70vh] items-center justify-center py-3">
			<div className="w-full max-w-xl rounded-2xl border border-white/70 bg-[whitesmoke] p-6 shadow-lg">
				<UpdateProfileFrom
					onUppdateProfile={onUppdateProfile}
					currentUser={currentUser}
					userUrl={userUrl}
					userEmail={userEmail}
					userName={userName}
				/>
			</div>
		</div>
	);
};

export default UppdateProfile;

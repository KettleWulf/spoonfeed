import type { User } from "firebase/auth";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { newImagesCol, storage } from "../services/Firebase";

const useUploadPlaceIMG = (user: User, placeId: string) => {
	const [error, setError] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState<number | null>(null);

	const upload = async (image: File) => {
		setError(null);
		setIsError(false);
		setIsSuccess(false);
		setIsUploading(false);
		setProgress(null);

		try {
			setIsUploading(true);

			const uuid = uuidv4();

			const ext = image.name.substring(image.name.lastIndexOf("."));

			const filename = image.name.replace(ext, "");

			const storageFilename = `${filename}_${uuid}${ext}`;


			//UPLOAD till DATABASE
			const storageRef = ref(storage, `places/${placeId}/${storageFilename}`);

			const uploadTask = uploadBytesResumable(storageRef, image);

			uploadTask.on("state_changed", (snapshot) => {
				setProgress(
					Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100 * 10
					) / 10
				);
			});

			await uploadTask.then();

			const url = await getDownloadURL(storageRef);

			/**
			 * Create document in Firestore for the uploaded image
			 */
			// SKAPA dokument i FIRESTORE
			const colRef = newImagesCol(placeId);

			await addDoc(colRef, {
				createdAt: serverTimestamp(),
				name: image.name,
				path: storageRef.fullPath,
				size: image.size,
				type: image.type,
				uid: user.uid,
				url,
			});

			setIsSuccess(true);
			setProgress(null);
		} catch (err) {
			setIsError(true);

			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred.");
			}
		} finally {
			setIsUploading(false);
		}
	};

	return {
		error,
		isError,
		isSuccess,
		isUploading,
		progress,
		upload,
	};
};

export default useUploadPlaceIMG;

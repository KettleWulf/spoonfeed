import type { User } from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../services/Firebase";


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

			// extract file extension from filename
			const ext = image.name.substring(image.name.lastIndexOf(".")); // ".jpg"

			// remove file extension from filename
			const filename = image.name.replace(ext, "");

			// construct filename to save image as
			const storageFilename = `${filename}_${uuid}${ext}`;  // "display.flex_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.jpg"


			/**
			 * Upload the image to Cloud Storage
			 */

			// create reference to the file
			const storageRef = ref(storage, `places/${placeId}/${storageFilename}`);
			


			const uploadTask = uploadBytesResumable(storageRef, image);

			uploadTask.on("state_changed", (snapshot) => {
				// 🗣️ update progress
				setProgress(
					Math.round(
						snapshot.bytesTransferred / snapshot.totalBytes * 100 * 10
					) / 10
				);
			});

			// wait for upload to complete
			await uploadTask.then();

			// get download url for the uploaded image
			const url = await getDownloadURL(storageRef);

			
			/**
			 * Create document in Firestore for the uploaded image
			 */

			const imagesCol = collection(db, "places", placeId, "images");
			const imageDoc = doc(imagesCol);


			await setDoc(imageDoc, {
				_id: imageDoc.id,
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

			console.log("Phew, all went well 😓");

		} catch (err) {
			// catch! 🎾
			console.error("Error thrown when uploading:", err);
			setIsError(true);

			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred.");
			}

		} finally {
			setIsUploading(false);
		}
	}

	return {
		error,
		isError,
		isSuccess,
		isUploading,
		progress,
		upload,
	}
}

export default useUploadPlaceIMG;

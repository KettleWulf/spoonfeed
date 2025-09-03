import clsx from "clsx";
import type { User } from "firebase/auth";
import { useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import useUploadPlaceIMG from "../hooks/useUploadPlaceIMG";

interface UploadMemesProps {
	user: User;
	placeId: string;
}

const DropZone: React.FC<UploadMemesProps> = ({ user, placeId }) => {
	const uploadPlaceIMG = useUploadPlaceIMG(user, placeId);

	// Drop it like it's hot 🔥
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		if (!acceptedFiles.length) {
			toast.warning("Please don't add more than 3 files at once - we're not Meta.");
			return;
		}

	

		for (const file of acceptedFiles) {
			await uploadPlaceIMG.upload(file);
  		}

	}, [uploadPlaceIMG]);

	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
		accept: {
			"image/gif": [],
			"image/heic": [],
			"image/jpeg": [],
			"image/png": [],
			"image/webp": [],
		},
		maxFiles: 3,
		maxSize: 4 * 1024 * 1024,
		onDrop,
	});

	const dropzoneWrapperClasses = clsx({
		"drag-accept": isDragAccept,
		"drag-reject": isDragReject,
	});

	return (
		<div {...getRootProps()} id="dropzone-wrapper" className={dropzoneWrapperClasses}>
			<input {...getInputProps()} />

			<div id="indicator">
				{isDragActive
					? isDragAccept
						? <p>YU-HUP</p>
						: <p>NAH-AH</p>
					: <div>
						<p className="h5 mb-1">- UPLOAD -</p>
						<p>(drop your images here or click to choose in finder)</p>
					</div>
				}
			</div>

			{/* Upload Progress Bar */}
			{uploadPlaceIMG.progress !== null && (
				<ProgressBar
					animated
					label={`${uploadPlaceIMG.progress}%`}
					now={uploadPlaceIMG.progress}
					variant="success"
				/>
			)}

			{uploadPlaceIMG.isError && <Alert variant="danger">{uploadPlaceIMG.error}</Alert>}
			{uploadPlaceIMG.isSuccess && <Alert variant="light">Successfully uploaded!</Alert>}
		</div>
	)
}

export default DropZone;

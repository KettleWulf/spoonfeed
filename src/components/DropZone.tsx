import clsx from "clsx";
import type { User } from "firebase/auth";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import useUploadPlaceIMG from "../hooks/useUploadPlaceIMG";

interface UploadMemesProps {
	user: User;
	placeId: string;
}

const DropZone: React.FC<UploadMemesProps> = ({ user, placeId }) => {
	const uploadPlaceIMG = useUploadPlaceIMG(user, placeId);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (!acceptedFiles.length) {
				toast.warning(
					"Please don't add more than 3 files at once - we're not Meta."
				);
				return;
			}

			for (const file of acceptedFiles) {
				await uploadPlaceIMG.upload(file);
			}
		},
		[uploadPlaceIMG]
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
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

	const dropzoneWrapperClasses = clsx(
		"mt-4 cursor-pointer rounded border-2 border-dashed border-gray-300 bg-[#cccccc] px-5 py-8 text-center transition-colors",
		{
			"border-green-700 bg-[#155724] text-[#d4edda]": isDragAccept,
			"border-red-700 bg-[#721c24] text-[#f8d7da]": isDragReject,
		}
	);

	return (
		<div {...getRootProps()} id="dropzone-wrapper" className={dropzoneWrapperClasses}>
			<input {...getInputProps()} />

			<div id="indicator">
				{isDragActive ? (
					isDragAccept ? (
						<p>YU-HUP</p>
					) : (
						<p>NAH-AH</p>
					)
				) : (
					<div>
						<p className="mb-1 text-lg font-semibold">- UPLOAD -</p>
						<p>(drop your images here or click to choose in finder)</p>
					</div>
				)}
			</div>

			{uploadPlaceIMG.progress !== null && (
				<div className="mt-6">
					<div className="mb-1 text-sm font-medium text-gray-700">
						{uploadPlaceIMG.progress}%
					</div>
					<div className="h-6 w-full overflow-hidden rounded bg-emerald-100">
						<div
							className="h-full bg-emerald-600 text-xs text-white transition-all"
							style={{ width: `${uploadPlaceIMG.progress}%` }}
						/>
					</div>
				</div>
			)}

			{uploadPlaceIMG.isError && (
				<div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{uploadPlaceIMG.error}
				</div>
			)}
			{uploadPlaceIMG.isSuccess && (
				<div className="mt-6 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
					Successfully uploaded!
				</div>
			)}
		</div>
	);
};

export default DropZone;

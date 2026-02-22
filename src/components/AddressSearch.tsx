import { useState } from "react";
import type { Location } from "../types/Place.types";
import useReverseGeocoding from "../hooks/useReverseGeocoding";
import { useSearchParams } from "react-router";

interface AddressSearchProps {
	onLocationFound: (coords: Location, city?: string) => void;
	placeholder?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
	onLocationFound,
	placeholder = "Search for an Address (ex. Kungsgatan 1, Stockholm)",
}) => {
	const [searchInput, setSearchInput] = useState("");
	const [searchError, setSearchError] = useState<string | null>(null);
	const [, setSearchParams] = useSearchParams();

	const {
		getCoordinates,
		isLoading,
		error: geocodingError,
	} = useReverseGeocoding();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		setSearchError(null);

		if (!searchInput.trim()) {
			setSearchError("Please search for an address");
			return;
		}

		getCoordinates(
			searchInput,
			(coords, city) => {
				onLocationFound(coords, city);

				const extractedCity = city.split(",")[0];

				setSearchInput("");
				setSearchError(null);
				setSearchParams({ query: extractedCity });
			},
			(error) => {
				setSearchError(error);
			}
		);
	};

	const handleClear = () => {
		setSearchInput("");
		setSearchError(null);
	};

	return (
		<form onSubmit={handleSearch}>
			<div className="flex flex-wrap gap-2">
				<input
					type="text"
					placeholder={placeholder}
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					disabled={isLoading}
					className="min-w-[240px] flex-1 rounded-md border border-emerald-200 bg-white px-3 py-2 outline-none ring-emerald-500 focus:ring-2 disabled:opacity-60"
				/>
				{searchInput && (
					<button
						type="button"
						onClick={handleClear}
						disabled={isLoading}
						className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
					>
						Clear
					</button>
				)}
				<button
					type="submit"
					disabled={isLoading || !searchInput.trim()}
					className="rounded-md bg-[#5e936c] px-4 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
				>
					Search
				</button>
			</div>

			{(searchError || geocodingError) && (
				<div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{searchError || geocodingError}
				</div>
			)}
		</form>
	);
};

export default AddressSearch;

import useGetPlacesBase from "./useGetPlacesBase";

// Hämtar places i specifik stad, sorterar bokstavsordning (först städer, sen namn A -> Ö)
export const useGetPlacesByCity = (city: string) => {
	return useGetPlacesBase({
		isSuggestion: false,
		city,
		orderByField: "name",
		orderDir: "asc",
	});
};

import useGetPlacesBase from "./useGetPlacesOrSuggestions";

// Hämtar alla places i bokstavsordning (A -> Ö) (inte suggestions, men oavsett stad)
export const useGetPlaces = () => {
	return useGetPlacesBase({
		isSuggestion: false,
		orderByField: "name",
		orderDir: "asc",
	});
};
import useGetPlacesBase from "./useGetPlacesOrSuggestions";

// Alla suggestions (oavsett stad, nyast -> äldst)
export const useGetSuggestions = () => {
	return useGetPlacesBase({
		isSuggestion: true,
		orderByField: "createdAt",
		orderDir: "desc",
	});
};

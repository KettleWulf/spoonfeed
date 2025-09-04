const extractCityFromResults = (
	result: google.maps.GeocoderResult
): string | null => {
	for (const component of result.address_components) {
		if (component.types.includes("locality")) {
			return component.long_name;
		}
		if (component.types.includes("postal_town")) {
			return component.long_name;
		}
		if (component.types.includes("administrative_area_level_2")) {
			return component.long_name;
		}
	}

	const addressParts = result.formatted_address.split(",");
	if (addressParts.length > 1) {
		const cityCandidate = addressParts[addressParts.length - 2]?.trim();
		if (cityCandidate) {
			const cleanCity = cityCandidate.replace(/\d+/g, "").trim();
			return cleanCity || null;
		}
	}
	return null;
};

export default extractCityFromResults;

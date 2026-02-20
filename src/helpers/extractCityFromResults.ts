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

	return null;
};

export default extractCityFromResults;

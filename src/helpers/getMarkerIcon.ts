import type { Place } from "../types/Place.types";

export const USER_MARKER_ICON = {
	url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
};

const CATEGORY_ICONS: Record<Place["category"], string> = {
	Café:         "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
	Restaurant:   "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
	"Fast food":  "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
	Bodega:       "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
	Foodtruck:    "https://maps.google.com/mapfiles/ms/icons/pink-dot.png",
	"Slop house": "https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
};

const getMarkerIcon = (category: Place["category"]) => ({ url: CATEGORY_ICONS[category] });
export default getMarkerIcon;

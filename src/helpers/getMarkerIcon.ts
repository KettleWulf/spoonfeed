import type { Place } from "../types/Place.types";

const getMarkerIcon = (category: Place['category']) => {
    const iconMap: Record<Place['category'], string> = {
        'Café': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        'Restaurant': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        'Fast food': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        'Bodega': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        'Foodtruck': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
        'Slop house': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    };

    return { url: iconMap[category] };
};

export default getMarkerIcon;

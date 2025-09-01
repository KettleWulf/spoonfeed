import { Marker } from "@react-google-maps/api";
import type { Place } from "../types/Place.types";

interface PlaceMarkersProps {
    places: Place[];
    onPlaceClick: (place: Place) => void;
}

const getMarkerIcon = (category: Place["category"]) => {
    const iconMap: Record<Place["category"], string> = {
        'Café': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        'Restaurant': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', 
        'Fast food': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        'Bodega': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        'Foodtruck': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
        'Slop house': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    };
    return { url: iconMap[category] };
};

const PlaceMarkers: React.FC<PlaceMarkersProps> = ({ places, onPlaceClick }) => {
    return (
        <>
            {places.map((place) => (
                <Marker 
                    key={place._id}
                    position={place.location}
                    title={`${place.name} - ${place.category}`}
                    icon={getMarkerIcon(place.category)}
                    onClick={()=> onPlaceClick(place)}
                    animation={google.maps.Animation.BOUNCE}
                />
            ))}
        </>
    )
};

export default PlaceMarkers;
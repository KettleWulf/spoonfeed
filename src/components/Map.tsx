import { GoogleMap, LoadScript } from "@react-google-maps/api";
import useUserLocation from "../hooks/useUserLocation";

const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const Map = () => {
    const {userLocation, isLoading, error } = useUserLocation();
    
    console.log(userLocation, isLoading, error);
    const containerStyle = {
        width: "400px",
        height: "400px",
    }

    if(!userLocation){
        return;
    }
    
    const center = {
        // Coordinates to STOCKHOLM as fallback 
        lat: 59.334591,
        lng: 18.063240,
    }


    return (
        <LoadScript
            googleMapsApiKey={mapApiKey}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation}
                zoom={12}
            ></GoogleMap>

        </LoadScript>
    )
}

export default Map

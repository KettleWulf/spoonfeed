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

    if(error &&  !userLocation){
         return <p>Kunde inte hämta din position. Visar Stockholm istället.</p>
    }
    
    if(isLoading){
        return <p>Hämtar din position... </p>
    }
    const FALLBACK_CENTER = {
        // Coordinates to STOCKHOLM as fallback 
        lat: 59.334591,
        lng: 18.063240,
    }

    const mapCenter = userLocation || FALLBACK_CENTER;

    {/*funktion för när man trycker på kartan */}
    const onHandleMapClick = (e: google.maps.MapMouseEvent ) => {
  
        if(!e.latLng){
            return;
        }

        console.log(e.latLng.lat(), e.latLng.lng());
    } 


    return (
        <LoadScript
            googleMapsApiKey={mapApiKey}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onClick={onHandleMapClick}
            ></GoogleMap>

        </LoadScript>
    )
}

export default Map

import { GoogleMap } from "@react-google-maps/api";
import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useState } from "react";

const Map = () => {

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const {
        userLocation, 
        isLoading: locationLoading, 
        error: locationError
    } = useUserLocation();

    const { getAdress,
            address,
            // lägg till erroor handling senare : error: geocodingError, isLoading: geocoingIsLoading
            } = useGeocoding();
    
    const containerStyle = {
        width: "400px",
        height: "400px",
    }

    if(locationError &&  !userLocation){
         return <p>Kunde inte hämta din position. Visar Stockholm istället.</p>
    }
    
    if(locationLoading){
        return <p>Hämtar din position... </p>
    }
    const FALLBACK_CENTER = {
        // Coordinates to STOCKHOLM as fallback 
        lat: 59.334591,
        lng: 18.063240,
    }

    const mapCenter = userLocation || FALLBACK_CENTER;

    {/*funktion för när man trycker på kartan */}
    const onHandleMapClick = async (e: google.maps.MapMouseEvent ) => {
  
        if(!e.latLng){
            return;
        }

        const clickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        getAdress(clickedCoords,
            (foundAddress) => {
                setSelectedAddress(foundAddress);
                console.log("Found address", foundAddress);
                console.log("For coordinates", clickedCoords);
            }
        );
        console.log("Last clicked address: ", address, " Current clicked address ", selectedAddress);
    } 


    return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={mapCenter}
			zoom={12}
			onClick={onHandleMapClick}
		></GoogleMap>
    )
}

export default Map

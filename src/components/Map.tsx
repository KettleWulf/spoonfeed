import { GoogleMap, LoadScript } from "@react-google-maps/api";

const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const containerStyle = {
    width: "400px",
    height: "400px",
}

const center = {
    lat: -3.745,
    lng: -38.523,
}
const Map = () => {
  return (
    <LoadScript
        googleMapsApiKey={mapApiKey}
    >
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
        ></GoogleMap>
    
    </LoadScript>
  )
}

export default Map

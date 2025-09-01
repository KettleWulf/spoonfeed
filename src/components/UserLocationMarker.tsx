import { Marker } from "@react-google-maps/api";
import type { Location } from "../types/Place.types";

interface UserLocationMarkerProps {
    userLocation: Location | null;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ userLocation }) => {
    if(!userLocation) {
        return null;
    }

    return (
        <Marker
            position={userLocation}
            title="Your position"
            icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
            animation={google.maps.Animation.DROP} 
        />
    )
}


export default UserLocationMarker
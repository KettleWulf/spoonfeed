import { Marker, InfoWindow } from "@react-google-maps/api";
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string;
}

interface ClickedLocationMarkerProps {
    selectedLocation: ClickedLocation | null;
    isLoadingAddress: boolean;
    onCloseClick: () => void;
    onOpenModal: () => void;
}
const ClickedLocationMarker: React.FC<ClickedLocationMarkerProps> = ({
    selectedLocation,
    isLoadingAddress,
    onCloseClick,
    onOpenModal,
}) => {

    if (!selectedLocation) {
        return null;
    }

    // canAddPlace stoppar lägg till knappen från att renderas titta på det!

    const canAddPlace = !isLoadingAddress && selectedLocation.address !== "Getting address..." && selectedLocation.address !== "Couldn't get address";

    return (
        <>
            <Marker
                position={selectedLocation!.coords}
                title={selectedLocation?.address}
            />
            <InfoWindow
                position={selectedLocation!.coords}
                onCloseClick={onCloseClick}
            >
                <Container>
                    <p>Chosen Place</p>
                    <p>{selectedLocation!.address}</p>
                    {canAddPlace && (
                        <Button
                            onClick={onOpenModal}
                            className="btn btn-sm btn-primary"
                            style={{ width: "100%"}}
                        >
                            Add a place to eat
                        </Button>
                    )}

                </Container>

            </InfoWindow>
        </>
    )

}

export default ClickedLocationMarker

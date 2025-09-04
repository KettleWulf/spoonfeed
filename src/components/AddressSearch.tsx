import { useState } from "react"
import type { Location } from "../types/Place.types";
import useReverseGeocoding from "../hooks/useReverseGeocoding";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useSearchParams } from "react-router";



interface AddressSearchProps {
    onLocationFound: (coords: Location, city?: string) => void;
    placeholder?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
    onLocationFound,
    placeholder = "Search for an Address (ex. Kungsgatan 1, Stockholm)",
}) => {

    const [searchInput, setSearchInput] = useState("");
    const [searchError, setSearchError] = useState<string | null>(null);
    const [, setSearchParams] = useSearchParams();



    const {
        getCoordinates,
        isLoading,
        error: geocodingError,
    } = useReverseGeocoding();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        setSearchError(null);

        if (!searchInput.trim()) {
            setSearchError("Please search for an address");
            return;
        }

        getCoordinates(
            searchInput, (coords, city) => {
                if(city){

                    const cleanCity = city.split(",")[0];

                    setSearchParams({query: cleanCity});
                }


                onLocationFound(coords, city);

                setSearchInput("");
                setSearchError(null);
            },
            (error) => {
                setSearchError(error);
            }
        );
    };

    const handleClear = () => {
        setSearchInput("");
        setSearchError(null);
    }


    return (
        <>
            <Form onSubmit={handleSearch}>
                <InputGroup>
                    <Form.Control 
                    type="text"
                    placeholder={placeholder}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    disabled={isLoading}

                    />
                    {searchInput && (
                        <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleClear}
                        disabled={isLoading}
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading || !searchInput.trim()}
                    >
                        Search
                    </Button>
                </InputGroup>

                {searchError || geocodingError && (
                    <Alert variant="danger">
                        {searchError || geocodingError}
                    </Alert>
                )}
            </Form>
        </>
    )
}

export default AddressSearch

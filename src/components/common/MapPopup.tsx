'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import Modal from 'react-modal'; // Or use any other modal library
import zIndex from '@mui/material/styles/zIndex';
import { Button, TextField, Typography } from '@mui/material';

const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 20.5937, // Default center: India
    lng: 78.9629
};

const MapPopup = ({ isOpen, onClose, onSelectCoordinates }: any) => {
    const [selectedCoords, setSelectedCoords] = useState<any>(null);
    const [autocomplete, setAutocomplete] = useState<any>(null);

    const onMapClick = useCallback((event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedCoords({ ...selectedCoords, lat: lat, lng: lng });
    }, []);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const { lat, lng } = place.geometry.location;
                setSelectedCoords({ lat: lat(), lng: lng() });
            }
        }
    };

    return (
        <div className='map-popup' style={{ margin: "5%", padding: "5%" }}>

            <Modal isOpen={isOpen} onRequestClose={onClose} >
                <LoadScript googleMapsApiKey="" libraries={['places']}>
                    <Typography>Search</Typography>

                    <Autocomplete
                        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <TextField
                            type="text"
                            placeholder="Search location"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                margin: "2%",
                            }}
                        />
                    </Autocomplete>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={selectedCoords || center}
                        zoom={selectedCoords ? 15 : 5}
                        onClick={onMapClick}
                    >
                        {selectedCoords && <Marker position={selectedCoords} />}
                    </GoogleMap>
                    <Button
                        variant="contained"
                        sx={{ alignItems: "center", justifyContent: "center", display: "flex", marginTop: "2%" }}
                        onClick={() => {
                            if (selectedCoords) {
                                onSelectCoordinates(selectedCoords);
                                onClose();
                            } else {
                                alert('Please select a location on the map.');
                            }
                        }}
                    >
                        Select Location
                    </Button>
                </LoadScript>
            </Modal>
        </div>

    );
};

export default MapPopup;

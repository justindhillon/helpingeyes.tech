"use client"
import React, { useEffect, useState } from 'react';
import {
    getVenueMaker,
    MappedinLocation,
    TGetVenueMakerOptions,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import "@mappedin/mappedin-js/lib/esm/renderer/index.js"
import NavigationDetail from './navigationDetail';

const options = {
    mapId: "65ac414604c23e7916b1d0bc",
    key: "65ac4800ca641a9a1399dc2c",
    secret: "9582760b40e4ba1617afe5a9e622d826b793396338c11734b13c515ef344bf53",
};

function LocationList() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    async function fetchData() {
        try {
            const venue = await getVenueMaker(options);

            const sortedCategories = [
                ...venue.categories.sort((a, b) => (a.name > b.name ? 1 : 0)),
            ];

            const allLocations = sortedCategories.flatMap(category =>
                category.locations.map(location => location.name)
            );

            const sortedLocations = [...allLocations].sort();

            setLocations(sortedLocations);
        } catch (error) {
            console.error("Error fetching venue:", error);
        }
    }

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <div id='locationBox'>
                <h1>List of locations</h1>
                <ul>
                    {locations.map((location, index) => (
                        <li key={index} onClick={() => handleLocationClick(location)}>{location}</li>
                    ))}
                </ul>
            </div>
            {/* <NavigationDetail selectedLocation={selectedLocation} /> */}
        </>
    );
}

export default LocationList;

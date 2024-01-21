"use client"
import React, { useEffect, useRef, useState } from 'react';
import {
    E_SDK_EVENT,
    getVenueMaker,
    MappedinDestinationSet,
    showVenue,
    PositionUpdater,
    STATE,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";


const Test = () => {
    const options = {
        mapId: "65ac414604c23e7916b1d0bc",
        key: "65ac4800ca641a9a1399dc2c",
        secret: "9582760b40e4ba1617afe5a9e622d826b793396338c11734b13c515ef344bf53",
    };

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    let step = 0
    const mapViewRef = useRef(null);
    const state = useRef(false);
    const init = async () => {
        try {
            if (state.current) {
                return;
            }
            const venue = await getVenueMaker(options);
            const mapView = await showVenue(document.getElementById("app"), venue);
            state.current = true;
            const canvasElement = mapViewRef.current?.canvas;
            if (canvasElement) {
                canvasElement.style.display = 'none';
            }

            const sortedCategories = [
                ...venue.categories.sort((a, b) => (a.name > b.name ? 1 : 0)),
            ];

            const allLocations = sortedCategories.flatMap(category =>
                category.locations.map(location => location.name)
            );

            const sortedLocations = [...allLocations].sort();

            // Find the location to use as a start point.
            const startLocation = selectedLocation
                ? venue.locations.find((l) => l.name === selectedLocation)
                : venue.locations.find((l) => l.name === "Entrance 1");

            //label all locations
            mapView.FloatingLabels.labelAllLocations();
            //Making polygons interactive allows them to respond to click and hover events.
            mapView.addInteractivePolygonsForAllLocations();

            const destinations = [
                venue.locations.find((l) => l.name === "Wash Room 1"),
                venue.locations.find((l) => l.name === "Wash Room 2"),
                venue.locations.find((l) => l.name === "Exit 1"),
                venue.locations.find((l) => l.name === "Entrance 2"),
                venue.locations.find((l) => l.name === "Entrance 1")
            ];

            // Get directions from the start location to all destinations.
            const directions = startLocation.directionsTo(
                new MappedinDestinationSet(destinations)
            );

            mapView.Journey.draw(directions, {
                pathOptions: {
                    nearRadius: 2.5,
                    farRadius: 2.5
                },
                inactivePathOptions: {
                    nearRadius: 2,
                    farRadius: 2,
                    color: "lightblue"
                }
            });

            mapView.setState(STATE.FOLLOW);

            mapView.BlueDot.enable({
                allowImplicitFloorLevel: true,
                smoothing: false,
                positionUpdater: positionUpdater,
                useRotationMode: true,
                showBearing: true,
            });

            mapView.on(E_SDK_EVENT.CLICK, ({ position }) => {
                const currentStep = step % destinations.length;
                if (destinations[currentStep].polygons &&
                    destinations[currentStep].polygons[0] &&
                    destinations[currentStep].polygons[0].map !== mapView.currentMap) {
                    mapView.setMap(destinations[currentStep].polygons[0].map);
                } else {
                    mapView.Journey.setStep(++step % destinations.length);
                }
            });

            setLocations(sortedLocations);
        } catch (error) {
            console.error("Error fetching venue:", error);
        }
    };
    init()

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };

    useEffect(() => {
        init();
    }, [selectedLocation]);

    return (
        <>
            <div id='locationBox'>
                <h1>List of locations</h1>
                <ul>
                    {locations.map((location, index) => (
                        <li key={index} onClick={() => handleLocationClick(location)}>{location}</li>
                    ))}
                </ul>
            </div></>
    )
}


export default Test;

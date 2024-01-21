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


const MapComponent = () => {
    const mapViewRef = useRef(null);
    const state = useRef(false);
    const [startLocation, setStartLocation] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [step, setStep] = useState(0);
    useEffect(() => {
        // See Trial API key Terms and Conditions
        // https://developer.mappedin.com/guides/api-keys
        const options = {
            mapId: "65ac414604c23e7916b1d0bc",
            key: "65ac4800ca641a9a1399dc2c",
            secret: "9582760b40e4ba1617afe5a9e622d826b793396338c11734b13c515ef344bf53",
        };

        let blueDotPosition = {
            timestamp: Date.now(),
            coords: {
                latitude: 43.51913063428935,
                longitude: -80.54104173445346,
                accuracy: 4,
            },
        };

        const positionUpdater = new PositionUpdater();

        const init = async () => {
            if (state.current) {
                return;
            }
            // Wait while the venue is downloaded.
            const venue = await getVenueMaker(options);
            // Display the default map in the app div.
            console.log('I should only be called once')
            const mapView = await showVenue(document.getElementById("app"), venue);
            mapViewRef.current = mapView;
            console.log(mapViewRef.current);
            const canvasElement = mapViewRef.current?.canvas;
            if (canvasElement) {
                canvasElement.style.display = 'none';
            }

            state.current = true;
            // Find the location to use as a start point.
            // const startLocation = venue.locations.find((l) => l.name === "Entrance 1");

            //label all locations
            mapView.FloatingLabels.labelAllLocations();
            //Making polygons interactive allows them to respond to click and hover events.
            mapView.addInteractivePolygonsForAllLocations();

            const initialStartLocation = venue.locations.find((l) => l.name === "Entrance 1");
            setStartLocation(initialStartLocation);

            // Create an array of locations to use as waypoints for a
            // multi-destination journey.
            const initialDestinations = [
                venue.locations.find((l) => l.name === "Wash Room 1"),
                venue.locations.find((l) => l.name === "Wash Room 2"),
                venue.locations.find((l) => l.name === "Exit 1"),
                venue.locations.find((l) => l.name === "Entrance 2"),
                venue.locations.find((l) => l.name === "Entrance 1")
            ];
            setDestinations(initialDestinations);

            // Get directions from the start location to all destinations.
            const directions = initialStartLocation.directionsTo(
                new MappedinDestinationSet(initialDestinations)
            );


            // Pass the directions to Journey to be drawn on the map.
            // Set the paths as interactive so the user can click to
            // highlight each leg in the journey.
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

            console.log(directions)

            mapView.setState(STATE.FOLLOW);

            console.log(directions)

            mapView.BlueDot.enable({
                allowImplicitFloorLevel: true,
                smoothing: false,
                positionUpdater: positionUpdater,
                useRotationMode: true,
                showBearing: true,
            });

            console.log(initialStartLocation)
            // Capture when the user clicks on the map and then highlight
            // the next step of the journey.
            positionUpdater.update({
                timestamp: Date.now(),
                coords: {
                    latitude: initialStartLocation.nodes[0].lat,
                    longitude: initialStartLocation.nodes[0].lon,
                    accuracy: 4,
                },
            });

            mapView.on(E_SDK_EVENT.CLICK, ({ position }) => {
                const currentStep = step % destinations.length;
                if (destinations[currentStep].polygons &&
                    destinations[currentStep].polygons[0] &&
                    destinations[currentStep].polygons[0].map !== mapView.currentMap) {
                    mapView.setMap(destinations[currentStep].polygons[0].map);
                } else {
                    setStep((prevStep) => (prevStep + 1) % destinations.length);
                    mapView.Journey.setStep(step);
                }
            });


            //Set the user's initial position to coordinates of the
            //start point, Entrance 1.




        };

        init();
    }, [destinations, startLocation, step]); // Empty dependency array to run the effect only once on mount

    return;
};

export default MapComponent;

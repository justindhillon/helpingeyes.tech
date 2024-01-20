"use client"

import { useEffect, useRef } from 'react';

const CameraStream = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((error) => {
                    console.error("Error accessing the camera:", error);
                });
        }
    }, []);

    return <video ref={videoRef} width="640" height="480" autoPlay />;
};

export default CameraStream;

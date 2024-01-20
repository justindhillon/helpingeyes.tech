"use client"

// components/CameraStream.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const CameraStream = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3000');
        socketRef.current.on('signal', handleSignal);

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setupPeerConnection(stream);
            });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const setupPeerConnection = (stream) => {
        const peerConnection = new RTCPeerConnection();

        // Add stream to the connection
        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Handle ICE candidate
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('signal', { candidate: event.candidate });
            }
        };

        peerConnectionRef.current = peerConnection;
    };

    const handleSignal = (data) => {
        if (data.candidate) {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay />
            <video ref={remoteVideoRef} autoPlay />
        </div>
    );
};

export default CameraStream;

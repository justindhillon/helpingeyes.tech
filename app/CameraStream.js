"use client"

// components/CameraStream.js
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const CameraStream = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        socketRef.current = io('http://localhost:3000');
        socketRef.current.on('signal', handleSignal);

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setupPeerConnection(stream);
            })
            .catch((error) => {
                console.error("Error accessing the camera:", error);
                setErrorMessage("Error accessing the camera.");
            });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const setupPeerConnection = (stream) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

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

        // Create offer on connection establishment
        if (typeof window !== 'undefined') {
            window.onbeforeunload = () => {
                socketRef.current.emit('signal', { closeConnection: true });
            };
        }

        peerConnectionRef.current = peerConnection;
    };

    const handleSignal = (data) => {
        if (!peerConnectionRef.current) return;

        if (data.candidate) {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else if (data.offer) {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer))
                .then(() => peerConnectionRef.current.createAnswer())
                .then(answer => peerConnectionRef.current.setLocalDescription(answer))
                .then(() => {
                    socketRef.current.emit('signal', { answer: peerConnectionRef.current.localDescription });
                });
        } else if (data.answer) {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.closeConnection) {
            closeConnection();
        }
    };

    const createOffer = () => {
        peerConnectionRef.current.createOffer()
            .then(offer => peerConnectionRef.current.setLocalDescription(offer))
            .then(() => {
                socketRef.current.emit('signal', { offer: peerConnectionRef.current.localDescription });
            })
            .catch(error => {
                console.error('Error creating an offer:', error);
                setErrorMessage('Error creating an offer.');
            });
    };

    const closeConnection = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay />
            <video ref={remoteVideoRef} autoPlay />
            <button onClick={createOffer}>Call</button>
            {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
    );
};

export default CameraStream;

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
    // Add to the CameraStream component's state
    const [isCallInitiated, setIsCallInitiated] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [clientIdentifier, setClientIdentifier] = useState('');

    useEffect(() => {
        socketRef.current = io('https://helpingeyes.tech:3001');
        socketRef.current.on('signal', handleSignal);

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: true
        })
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
        // Generate a random 4-digit identifier
        const identifier = Math.floor(1000 + Math.random() * 9000).toString();
        setClientIdentifier(identifier);
        socketRef.current.emit("register", identifier);
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

        // Handle incoming ICE candidates
        if (data.candidate) {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }

        // Handle incoming offers
        else if (data.offer) {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer))
                .then(() => peerConnectionRef.current.createAnswer())
                .then(answer => peerConnectionRef.current.setLocalDescription(answer))
                .then(() => {
                    socketRef.current.emit('signal', { answer: peerConnectionRef.current.localDescription });
                })
                .catch(error => {
                    console.error('Error responding to offer:', error);
                    setErrorMessage('Error responding to offer.');
                });
        }

        // Handle incoming answers
        else if (data.answer) {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        // Handle incoming call initiation
        else if (data.callInitiated) {
            console.log(`Received call from ${data.from}.`);
            const acceptCall = confirm(`Incoming call from ID: ${data.from}. Do you want to accept?`);
            if (acceptCall) {
                setIncomingCall(true);
                socketRef.current.emit('call-accepted', {
                    to: data.from,
                    from: clientIdentifier
                });

                // Additional logic to create or accept WebRTC offer/answer
            }
        }

        // Handle disconnection or call closing
        else if (data.closeConnection) {
            closeConnection();
        }
    };

    const createOffer = () => {
        const recipientId = prompt("Enter the recipient's ID:");
        if (recipientId) {
            // Request ID validation from the server
            socketRef.current.emit('validate-id', { recipientId }, (response) => {
                if (response.isValid) {
                    setIsCallInitiated(true);
                    socketRef.current.emit('call-initiated', {
                        to: recipientId,
                        from: clientIdentifier
                    });
                } else {
                    alert("Recipient ID not found.");
                }
            });
        }
    };

    // Function to handle call acceptance
    const acceptCall = () => {
        setIncomingCall(false); // Hide the 'Accept Call' button

        // Create an answer to the caller's offer
        peerConnectionRef.current.createAnswer()
            .then(answer => peerConnectionRef.current.setLocalDescription(answer))
            .then(() => {
                // Send the answer to the caller via the server
                socketRef.current.emit('signal', { answer: peerConnectionRef.current.localDescription });
            })
            .catch(error => {
                console.error('Error creating an answer:', error);
                setErrorMessage('Error creating an answer.');
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
            <p>Your ID: {clientIdentifier}</p> {/* Display the client's identifier */}
            <video ref={localVideoRef} autoPlay />
            <video ref={remoteVideoRef} autoPlay />
            {!isCallInitiated && (
                <button onClick={() => createOffer()}>
                    Call
                </button>
            )}
            {incomingCall && <button onClick={acceptCall}>Accept Call</button>}
            {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
    );
};

export default CameraStream;

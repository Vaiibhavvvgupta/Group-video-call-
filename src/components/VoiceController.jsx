// import React, { useState, useEffect, useRef } from 'react';
// import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

// const App = ({ stream, room, userId }) => {
//     const [userID, setUserID] = useState(userId);
//     const [roomID, setRoomID] = useState(room);
//     const [streamID, setStreamID] = useState(stream);
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStreams, setRemoteStreams] = useState({});
//     const [isMuted, setIsMuted] = useState(false);
//     const [userCount, setUserCount] = useState(0);
//     const [mediaError, setMediaError] = useState('');
//     const zgRef = useRef(null);

//     // useEffect(() => {
//     //     const initZego = async () => {
//     //         try {
//     //             const token = await handleJoinRoom();
//     //             const appID = 1943790779;
//     //             const server = '89495af8dc85d7ca7c146d5853847d39';
//     //             zgRef.current = new ZegoExpressEngine(appID, server);
    
//     //             await zgRef.current.loginRoom(roomID, token, { userID: userID, userName: 'User' }, { userUpdate: true });
    
//     //             const localStream = await zgRef.current.createZegoStream({ camera: { audio: true, video: false } });
//     //             localStream.playAudio()
//     //             setLocalStream(localStream);
//     //             await zgRef.current.startPublishingStream(streamID, localStream);
    
//     //             zgRef.current.on('roomStateUpdate', (roomID, state, errorCode) => {
//     //                 console.log(`Room State Update: ${roomID}, ${state}, ${errorCode}`);
//     //                 if (state === 'DISCONNECTED') {
//     //                     // Handle reconnection logic here
//     //                     console.error('Disconnected from room, trying to reconnect...');
//     //                     // Add reconnection attempts logic here
//     //                 }
//     //             });
    
//     //             zgRef.current.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
//     //                 if (updateType === 'ADD') {
//     //                     for (const stream of streamList) {
//     //                         const streamID = stream.streamID;   
//     //                         const remoteStream = await zgRef.current.startPlayingStream(streamID);
//     //                         setRemoteStreams(prev => ({ ...prev, [streamID]: remoteStream }));
//     //                     }
//     //                 } else if (updateType === 'DELETE') {
//     //                     for (const stream of streamList) {
//     //                         const streamID = stream.streamID;
//     //                         zgRef.current.stopPlayingStream(streamID);
//     //                         setRemoteStreams(prev => {
//     //                             const newStreams = { ...prev };
//     //                             delete newStreams[streamID];
//     //                             return newStreams;
//     //                         });
//     //                     } 
//     //                 }
//     //             });
    
//     //             zgRef.current.on('error', (err) => {
//     //                 console.error('Zego Engine Error:', err);
//     //                 if (err.code === 3002) {
//     //                     setMediaError('Failed to connect to the server. Please check your network connection.');
//     //                 }
//     //             });
    
//     //         } catch (error) {
//     //             console.error('Error initializing Zego engine:', error);
//     //             setMediaError('Failed to initialize Zego engine. Please try again.');
//     //         }
//     //     };
    
//     //     initZego();
//     // }, []);
//     useEffect(() => {
//         const initZego = async () => {
//             try {
//                 const token = await handleJoinRoom();
//                 const appID = 1943790779;
//                 const server = '89495af8dc85d7ca7c146d5853847d39';
//                 zgRef.current = new ZegoExpressEngine(appID, server);
    
//                 await zgRef.current.loginRoom(roomID, token, { userID: userID, userName: 'User' }, { userUpdate: true });
    
//                 // Creating stream with echo cancellation
//                 const localStream = await zgRef.current.createZegoStream({
//                     camera: { audio: true, video: false },
//                     audioOptions: {
//                         echoCancellation: true,
//                         noiseSuppression: true,
//                         autoGainControl: true
//                     }
//                 });
//                 localStream.playAudio();
//                 setLocalStream(localStream);
//                 await zgRef.current.startPublishingStream(streamID, localStream);
    
//                 zgRef.current.on('roomStateUpdate', (roomID, state, errorCode) => {
//                     console.log(`Room State Update: ${roomID}, ${state}, ${errorCode}`);
//                     if (state === 'DISCONNECTED') {
//                         // Handle reconnection logic here
//                         console.error('Disconnected from room, trying to reconnect...');
//                         // Add reconnection attempts logic here
//                     }
//                 });
    
//                 zgRef.current.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
//                     if (updateType === 'ADD') {
//                         for (const stream of streamList) {
//                             const streamID = stream.streamID;   
//                             const remoteStream = await zgRef.current.startPlayingStream(streamID);
//                             setRemoteStreams(prev => ({ ...prev, [streamID]: remoteStream }));
//                         }
//                     } else if (updateType === 'DELETE') {
//                         for (const stream of streamList) {
//                             const streamID = stream.streamID;
//                             zgRef.current.stopPlayingStream(streamID);
//                             setRemoteStreams(prev => {
//                                 const newStreams = { ...prev };
//                                 delete newStreams[streamID];
//                                 return newStreams;
//                             });
//                         } 
//                     }
//                 });
    
//                 zgRef.current.on('error', (err) => {
//                     console.error('Zego Engine Error:', err);
//                     if (err.code === 3002) {
//                         setMediaError('Failed to connect to the server. Please check your network connection.');
//                     }
//                 });
    
//             } catch (error) {
//                 console.error('Error initializing Zego engine:', error);
//                 setMediaError('Failed to initialize Zego engine. Please try again.');
//             }
//         };
    
//         initZego();
//     }, []);
    

//     const handleJoinRoom = async () => {
//         try {
//             const response = await fetch('https://apiv.ultrapay.info/auth/zego-auth-token', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: userId }) // Add userId in the body
//             });
    
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
    
//             const data = await response.json();
//             return data.data.token;
//         } catch (error) {
//             console.error('Error joining room:', error);
//             setMediaError('Failed to join the room. Please check your network connection and try again.');
//         }
//     };
    

//     const handleLeaveRoom = () => {
//         if (localStream) {
//             zgRef.current.stopPublishingStream(streamID);
//             zgRef.current.destroyStream(localStream);
//             setLocalStream(null);
//         }
//         zgRef.current.logoutRoom(roomID);
//         zgRef.current.destroyEngine();
//     };

//     const handleToggleMute = () => {
//         if (localStream) {
//             const audioTrack = localStream.getAudioTracks()[0];
//             if (audioTrack) {
//                 audioTrack.enabled = !isMuted;
//                 setIsMuted(!isMuted);
//             }
//         }
//     };

//     return (
//         <div className="app-container">
//             <div className="control-panel">
//                 <input
//                     type="text"
//                     placeholder="User ID"
//                     value={userID}
//                     onChange={(e) => setUserID(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Room ID"
//                     value={roomID}
//                     onChange={(e) => setRoomID(e.target.value)}
//                 />
//                 <button onClick={handleJoinRoom} className="btn">Join Room</button>
//                 <button onClick={handleLeaveRoom} className="btn">Leave Room</button>
//                 <button onClick={handleToggleMute} className="btn">
//                     {isMuted ? 'Unmute' : 'Mute'}
//                 </button>
//             </div>
//             {mediaError && <div className="error-message">{mediaError}</div>}
//             <div className="user-info">
//                 <h3>Number of people in room: {userCount}</h3>
//             </div>
//             <div className="stream-container">
//                 {Object.keys(remoteStreams).map(streamID => (
//                     <div key={streamID} className="user-stream">
//                         <audio
//                             autoPlay
//                             ref={audio => {
//                                 if (audio) {
//                                     audio.srcObject = remoteStreams[streamID];
//                                 }
//                             }}
//                         />
//                         <div className="user-voice-visualization">
//                             {/* Add any voice visualization here */}
//                             <p>Voice Visualization for {streamID}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default App;


import React, { useState, useEffect, useRef } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const App = ({ stream, room, userId }) => {
    const [userID, setUserID] = useState(userId);
    const [roomID, setRoomID] = useState(room);
    const [streamID, setStreamID] = useState(stream);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [mediaError, setMediaError] = useState('');
    const zgRef = useRef(null);

    useEffect(() => {
        const initZego = async () => {
          
                const token = await handleJoinRoom();
                const appID = 1943790779;
                const server = '89495af8dc85d7ca7c146d5853847d39';
                zgRef.current = new ZegoExpressEngine(appID, server);

                await zgRef.current.loginRoom(roomID, token, { userID: userID, userName: 'User' }, { userUpdate: true });

                // Creating stream with echo cancellation
                const localStream = await zgRef.current.createZegoStream({
                    camera: { audio: true, video: false },
                    audioOptions: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                localStream.playAudio();
                setLocalStream(localStream);
                await zgRef.current.startPublishingStream(streamID, localStream);

                // Handle publisher state updates
                zgRef.current.on('publisherStateUpdate', (result) => {
                    console.log('Publisher State Update:', result);
                    // Handle various publisher states here
                });

                // Handle publish quality updates
                zgRef.current.on('publishQualityUpdate', (streamID, stats) => {
                    console.log('Publish Quality Update:', streamID, stats);
                    // Handle publish quality updates here
                });

                // Handle player state updates
                zgRef.current.on('playerStateUpdate', (result) => {
                    console.log('Player State Update:', result);
                    // Handle player state updates here
                });

                // Handle play quality updates
                zgRef.current.on('playQualityUpdate', (streamID, stats) => {
                    console.log('Play Quality Update:', streamID, stats);
                    // Handle play quality updates here
                });

                zgRef.current.on('roomStateUpdate', (roomID, state, errorCode) => {
                    console.log(`Room State Update: ${roomID}, ${state}, ${errorCode}`);
                    if (state === 'DISCONNECTED') {
                        // Handle reconnection logic here
                        console.error('Disconnected from room, trying to reconnect...');
                        // Add reconnection attempts logic here
                    }
                });

                zgRef.current.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
                    console.warn('Room Stream Update:', roomID, updateType, streamList);
                    if (updateType === 'ADD') {
                        for (const stream of streamList) {
                            const streamID = stream.streamID;
                            const remoteStream = await zgRef.current.startPlayingStream(streamID);
                            setRemoteStreams(prev => ({ ...prev, [streamID]: remoteStream }));
                        }
                    } else if (updateType === 'DELETE') {
                        for (const stream of streamList) {
                            const streamID = stream.streamID;
                            zgRef.current.stopPlayingStream(streamID);
                            setRemoteStreams(prev => {
                                const newStreams = { ...prev };
                                delete newStreams[streamID];
                                return newStreams;
                            });
                        }
                    }
                });

                // const handleError = (error) => {
                //     if (error instanceof Error) {
                //         console.error('Error message:', error.message);
                //         console.error('Error stack:', error.stack);
                //     } else {
                //         console.error('Unexpected error:', JSON.stringify(error, null, 2));
                //     }
                // };
                
                // // Example usage in event callbacks:
                // zgRef.current.on('error', (err) => {
                //     handleError(err);
                //     if (err.code === 3002) {
                //         setMediaError('Failed to connect to the server. Please check your network connection.');
                //     }
                // });
            }
        initZego();
    }, [roomID, userID, streamID]); // Add dependencies here as needed

    const handleJoinRoom = async () => {
        try {
            const response = await fetch('https://apiv.ultrapay.info/auth/zego-auth-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userID }) // Add userID in the body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.data.token;
        } catch (error) {
            console.error('Error joining room:', error);
            setMediaError('Failed to join the room. Please check your network connection and try again.');
        }
    };

    const handleLeaveRoom = () => {
        if (localStream) {
            zgRef.current.stopPublishingStream(streamID);
            zgRef.current.destroyStream(localStream);
            setLocalStream(null);
        }
        zgRef.current.logoutRoom(roomID);
        zgRef.current.destroyEngine();
    };

    const handleToggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !isMuted;
                setIsMuted(!isMuted);
            }
        }
    };

    return (
        <div className="app-container">
            <div className="control-panel">
                <input
                    type="text"
                    placeholder="User ID"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Room ID"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                />
                <button onClick={handleJoinRoom} className="btn">Join Room</button>
                <button onClick={handleLeaveRoom} className="btn">Leave Room</button>
                <button onClick={handleToggleMute} className="btn">
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
            </div>
            {mediaError && <div className="error-message">{mediaError}</div>}
            <div className="user-info">
                <h3>Number of people in room: {userCount}</h3>
            </div>
            <div className="stream-container">
                {Object.keys(remoteStreams).map(streamID => (
                    <div key={streamID} className="user-stream">
                        <audio
                            autoPlay
                            ref={audio => {
                                if (audio) {
                                    audio.srcObject = remoteStreams[streamID];
                                }
                            }}
                        />
                        <div className="user-voice-visualization">
                            {/* Add any voice visualization here */}
                            <p>Voice Visualization for {streamID}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;


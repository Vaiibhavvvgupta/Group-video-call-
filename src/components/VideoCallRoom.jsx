import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useLocation } from 'react-router-dom';

function randomID(len) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  for (let i = 0; i < (len || 5); i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function getUrlParams(url) {
  const urlStr = url.split('/room/')[1];
  return urlStr;
}

export default function VideoCallRoom() {
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false); // State to track mute/unmute
  const location = useLocation();
  const roomID = getUrlParams(location.pathname);
  const zp = useRef(null); // Reference to the Zego UI Kit instance

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Generate Kit Token
        const appID = 1943790779;
        const serverSecret = '89495af8dc85d7ca7c146d5853847d39';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

        console.log('Generated Kit Token:', kitToken);

        zp.current = ZegoUIKitPrebuilt.create(kitToken);
        if (zp.current) {
          console.log('ZegoUIKitPrebuilt instance created successfully.');

          if (containerRef.current) {
            console.log('Container reference is valid.');

            zp.current.joinRoom({
              turnOnCameraWhenJoining: false,
              showMyCameraToggleButton: false,
              showAudioVideoSettingsButton: true,
              showScreenSharingButton: false,
              showPreJoinView: false,
              container: containerRef.current,
              scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall, // Group voice call
              },
              userConfig: {
                audio: true,  // Ensure audio is enabled
                video: false,
              }
            });
          } else {
            console.error('Container reference is null or invalid.');
          }
        } else {
          console.error('Failed to create ZegoUIKitPrebuilt instance.');
        }
      } catch (error) {
        console.error('Error initializing meeting:', error);
      }
    };

    initializeMeeting();
  }, [roomID]);

  const handleMuteToggle = () => {
    // Example: Replace with actual SDK call for muting/unmuting
    if (zp.current) {
      console.log('Mute/Unmute functionality needs to be implemented according to Zego SDK.');
      setIsMuted(!isMuted);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{
           overflowX1: 'auto',
          width: '500px', // Adjust width as needed
          height: '300px', // Adjust height as needed
          position: 'absolute',
          bottom: '60px', // Distance from the bottom
          right: '60px',  // Distance from the right
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Optional: add a background color with transparency
          borderRadius: '8px', // Optional: add rounded corners
          overflow: 'hidden' // Ensure no overflow outside the container
        }}
      >
        <p>Loading voice call...</p>
      </div>
      <button
        onClick={handleMuteToggle}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}

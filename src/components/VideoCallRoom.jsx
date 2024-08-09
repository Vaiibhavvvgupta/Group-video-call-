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

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Generate Kit Token
        const appID = 1943790779;
        const serverSecret = '89495af8dc85d7ca7c146d5853847d39';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

        console.log('Generated Kit Token:', kitToken);

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        if (zp) {
          console.log('ZegoUIKitPrebuilt instance created successfully.');

          if (containerRef.current) {
            console.log('Container reference is valid.');

            zp.joinRoom({
              container: containerRef.current,
              scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall, // Group voice call
              },
              userConfig: {
                audio: true,  // Ensure audio is enabled
                video: false  // Disable video
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
    if (containerRef.current) {
      const audioTracks = containerRef.current.getAudioTracks();
      audioTracks.forEach(track => track.enabled = !isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <p>Loading voice call...</p>
      <button
        onClick={handleMuteToggle}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isMuted ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}

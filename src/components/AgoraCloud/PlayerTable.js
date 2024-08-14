// src/components/PlayerTable.js
import React from 'react';
import useAgora from './useAgora';

const appId = '39861fd403704cadb2813028035aadbd';  // Replace with your Agora App ID
const token = null;           // Optionally use a token for authentication
const channel = 'casino-channel'; 
 // Unique channel name

const PlayerTable = () => {
  const { localTrack, remoteUsersRef, joined } = useAgora(appId, token, channel,123456);
  const [muted, setMuted] = React.useState(false);

  const handleMuteToggle = () => {
    localTrack?.setEnabled(!muted);
    setMuted(!muted);
  };

  return (
    <div className="player-table">
      {joined ? (
        <div className="table-container">
          <div className="local-player">
            <p>You</p>
            <button onClick={handleMuteToggle}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
          {Object.keys(remoteUsersRef.current).map(uid => (
            <div key={uid} className="remote-player">
              <p>Player {uid}</p>
              {/* You can add additional controls or info about remote users here */}
            </div>
          ))}
        </div>
      ) : (
        <p>Joining channel...</p>
      )}
    </div>
  );
};

export default PlayerTable;

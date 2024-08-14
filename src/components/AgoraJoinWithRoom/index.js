import React, { useState } from 'react';
import Room from './Room';

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);

  const handleJoinRoom = () => {
    if (roomId) {
      setJoinedRoom(true);
    }
  };
  const value = null

  return (
    <div>
      {!joinedRoom ? (
        <div>
          <h1>Enter Room ID</h1>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <Room
          appId="39861fd403704cadb2813028035aadbd"
          token =  {value} // Replace with your Agora token or use null for testing
          roomId={roomId}
          uid={Math.floor(Math.random() * 10000)} // Example UID, generate a unique ID as needed
        />
      )}
    </div>
  );
};

export default App;

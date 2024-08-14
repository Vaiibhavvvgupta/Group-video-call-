import React, { useState, useContext } from 'react';
import LobbyForm from './LobbyFOrm';
import RoomHeader from './RoomHeader';
import MemberList from './MemberList';
import { AgoraProvider, useAgora } from './Appservice';

const App = () => {
  const [roomId, setRoomId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const { joinRoom } = useAgora();

  const handleEnterRoom = (room, name, selectedAvatar) => {
    joinRoom(room, name, selectedAvatar);
    setRoomId(room);
    setDisplayName(name);
    setAvatar(selectedAvatar);
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setDisplayName('');
    setAvatar(null);
  };

  return (

      <div id="container">
        {roomId ? (
          <>
            <RoomHeader roomId={roomId} onLeaveRoom={handleLeaveRoom} />
            <MemberList />
          </>
        ) : (
          <LobbyForm onEnterRoom={handleEnterRoom} />
        )}
      </div>

  );
};

export default App;


import React from 'react';
import { useAgora } from './Appservice';

const RoomHeader = ({ roomId, onLeaveRoom }) => {
  const { toggleMic, micMuted } = useAgora();

  return (
    <div id="room-header">
      <h1 id="room-name">{roomId}</h1>
      <div id="room-header-controls">
        <img
          id="mic-icon"
          className="control-icon"
          src={micMuted ? 'icons/mic-off.svg' : 'icons/mic.svg'}
          onClick={toggleMic}
          alt="mic"
        />
        <img
          id="leave-icon"
          className="control-icon"
          src="icons/leave.svg"
          onClick={onLeaveRoom}
          alt="leave"
        />
      </div>
    </div>
  );
};

export default RoomHeader;

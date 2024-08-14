import React, { useState } from 'react';

const LobbyForm = ({ onEnterRoom }) => {
  const [roomname, setRoomname] = useState('');
  const [displayname, setDisplayname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAvatar) {
      alert('Please select an avatar');
      return;
    }
    onEnterRoom(roomname.toLowerCase(), displayname, selectedAvatar);
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <div>
        <h3>Select An Avatar:</h3>
      </div>
      <div id="avatars">
        {['male-1.png', 'male-2.png', 'male-4.png', 'male-5.png', 'female-1.png', 'female-2.png', 'female-4.png', 'female-5.png'].map((avatar, index) => (
          <img
            key={index}
            className={`avatar-selection ${selectedAvatar === avatar ? 'selected' : ''}`}
            src={`avatars/${avatar}`}
            alt="avatar"
            onClick={() => handleAvatarClick(avatar)}
          />
        ))}
      </div>
      <div id="form-fields">
        <label>Display Name:</label>
        <input
          required
          name="displayname"
          type="text"
          placeholder="Enter username..."
          value={displayname}
          onChange={(e) => setDisplayname(e.target.value)}
        />
        <label>Room Name:</label>
        <input
          required
          name="roomname"
          type="text"
          placeholder="Enter room name..."
          value={roomname}
          onChange={(e) => setRoomname(e.target.value)}
        />
        <input type="submit" value="Enter Room" />
      </div>
    </form>
  );
};

export default LobbyForm;

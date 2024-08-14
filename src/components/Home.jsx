import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceController from './VoiceController';

export default function Home() {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [join , setJoin] = useState(false);
    const [stream ,setStreamID] = useState('');
    const [room ,setRoomID] = useState('');
    const [userId,serUserId] = useState('');

    const handleJoin = () => {
        if (value.trim()) {  // Ensure the roomId is not empty or just whitespace
            navigate(`/room/${value.trim()}`);
        }
    };
    const handleVoice = () => {
        setJoin(!join)

    }


    return (
        <>
        {join && <VoiceController stream={stream} room={room} userId={userId} />}
      { false && <div>
            Enter the room
            <input
                type="text"
                placeholder="Enter the id"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

        </div> }
        <div>
            Enter the room
            <input
                type="text"
                placeholder="Enter the id"
                value={room}
                onChange={(e) => setRoomID(e.target.value)}
                />

        </div>
        <div>
            enter the user id
            <input
                type="text"
                placeholder="Enter the id"
                value={userId}
                onChange={(e) => serUserId(e.target.value)}
                />

        </div>
        <div>
            enter stream id 
            <input
                type="text"
                placeholder="Enter the id"
                value={stream}
                onChange={(e) => setStreamID(e.target.value)}
                />
  
        </div>

            <button onClick={handleVoice}>Join the room</button>
     

                </>
    );
}

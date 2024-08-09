import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const handleJoin = () => {
        if (value.trim()) {  // Ensure the roomId is not empty or just whitespace
            navigate(`/room/${value.trim()}`);
        }
    };

    return (
        <div>
            Enter the room
            <input
                type="text"
                placeholder="Enter the id"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={handleJoin}>Join the room</button>
        </div>
    );
}

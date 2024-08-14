import React, { useState, useEffect, useRef } from 'react';
import { createClient, createMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

const AgoraVoiceCall = ({ appId, token, channelName, uid }) => {
  const [joined, setJoined] = useState(false);
  const [localTrack, setLocalTrack] = useState(null);
  const [users, setUsers] = useState([]);
  const [speakingUser, setSpeakingUser] = useState(null);
  const [userStates, setUserStates] = useState({}); // Track publish state for each user
  const clientRef = useRef(null);
  const remoteUsersRef = useRef({});

  useEffect(() => {
    const client = createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const initAgora = async () => {
      try {
        // Join the channel
        await client.join(appId, String(channelName), token, uid);
        console.log('Successfully joined the room');

        // Create and publish the local audio track
        const audioTrack = await createMicrophoneAudioTrack();
        setLocalTrack(audioTrack);
        await client.publish([audioTrack]);
        setJoined(true);
        setUserStates(prevStates => ({ ...prevStates, [uid]: true }));
        console.log('Local audio track published');

        // Listen for remote users publishing their tracks
        client.on('user-published', async (user, mediaType) => {
          console.log('User published:', user.uid, mediaType);
          try {
            await client.subscribe(user, mediaType);
            console.log('Subscription success!');
            if (mediaType === 'audio') {
              const remoteAudioTrack = user.audioTrack;
              remoteUsersRef.current[user.uid] = remoteAudioTrack;
              remoteAudioTrack.play();
              setUsers(prevUsers => [...prevUsers, { uid: user.uid, track: remoteAudioTrack }]);
              setUserStates(prevStates => ({ ...prevStates, [user.uid]: true }));
            }
          } catch (error) {
            console.error('Error subscribing to user:', error);
          }
        });

        // Handle users unpublishing their tracks
        client.on('user-unpublished', async (user, mediaType) => {
          console.log('User unpublished:', user.uid, mediaType);
          try {
            if (mediaType === 'audio' && remoteUsersRef.current[user.uid]) {
              remoteUsersRef.current[user.uid].stop();
              delete remoteUsersRef.current[user.uid];
              setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
              setUserStates(prevStates => ({ ...prevStates, [user.uid]: false }));
            }
          } catch (error) {
            console.error('Error handling user unpublished:', error);
          }
        });

        // Handle users leaving the channel
        client.on('user-left', (user) => {
          console.log('User left:', user.uid);
          try {
            if (remoteUsersRef.current[user.uid]) {
              remoteUsersRef.current[user.uid].stop();
              delete remoteUsersRef.current[user.uid];
              setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
              setUserStates(prevStates => ({ ...prevStates, [user.uid]: false }));
            }
          } catch (error) {
            console.error('Error handling user left:', error);
          }
        });

        // Handle volume indications
        client.on('volume-indication', (volumes) => {
          if (volumes.length > 0) {
            const maxVolumeUser = volumes.reduce((prev, current) => (prev.volume > current.volume ? prev : current));
            setSpeakingUser(maxVolumeUser.uid);
          }
        });

      } catch (error) {
        console.error('Error joining the room:', error);
      }
    };

    initAgora();

    return () => {
      const client = clientRef.current;
      if (client) {
        client.leave().then(() => console.log('Left the room')).catch(console.error);
      }
      if (localTrack) {
        localTrack.close();
      }
    };
  }, [appId, channelName, token, uid]);

  const handleLeave = async () => {
    if (clientRef.current && localTrack) {
      await clientRef.current.unpublish([localTrack]);
      localTrack.close();
      await clientRef.current.leave();
      setJoined(false);
      setLocalTrack(null);
      setUsers([]);
      setUserStates({});
    }
  };

  const bothUsersReady = Object.values(userStates).length === 2 && Object.values(userStates).every(state => state);

  return (
    <div>
      <h1>Voice Call</h1>
      {joined ? (
        <div>
          <p>Joined the channel and publishing audio.</p>
          <button onClick={handleLeave}>Leave Channel</button>
          <p>Number of users: {users.length}</p>
          <ul>
            {users.map(user => (
              <li key={user.uid}>
                User ID: {user.uid} {speakingUser === user.uid && '(Speaking)'}
              </li>
            ))}
          </ul>
          {bothUsersReady ? (
            <button>Join the Call</button>
          ) : (
            <p>Waiting for both users to join and publish their audio...</p>
          )}
        </div>
      ) : (
        <p>Joining the channel...</p>
      )}
    </div>
  );
};

export default AgoraVoiceCall;

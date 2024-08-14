import { useEffect, useState, useRef } from 'react';
import { createClient, createMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

const useAgora = (appId, token, channel, uid) => {
  const [localTrack, setLocalTrack] = useState(null);
  const [joined, setJoined] = useState(false);
  const remoteUsersRef = useRef({});
  const clientRef = useRef(null);

  useEffect(() => {
    const client = createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const initAgora = async () => {
      try {
        // Join the channel
        await client.join(appId, channel, token, uid);
        console.log('Successfully joined the channel');

        // Create and publish the microphone audio track
        const audioTrack = await createMicrophoneAudioTrack();
        setLocalTrack(audioTrack);
        await client.publish([audioTrack]);
        setJoined(true);
        console.log('Audio track published successfully');

        // Handle remote user events
        client.on('user-published', async (user, mediaType) => {
          if (mediaType === 'audio') {
            await client.subscribe(user, mediaType);
            const remoteAudioTrack = user.audioTrack;
            remoteUsersRef.current[user.uid] = remoteAudioTrack;
            remoteAudioTrack.play();
            console.log(`User ${user.uid} published audio track`);
          }
        });

        client.on('user-unpublished', (user) => {
          if (remoteUsersRef.current[user.uid]) {
            remoteUsersRef.current[user.uid].stop();
            delete remoteUsersRef.current[user.uid];
            console.log(`User ${user.uid} unpublished audio track`);
          }
        });

        client.on('leave', (user) => {
          if (remoteUsersRef.current[user.uid]) {
            remoteUsersRef.current[user.uid].stop();
            delete remoteUsersRef.current[user.uid];
            console.log(`User ${user.uid} left`);
          }
        });
      } catch (error) {
        console.error('Error joining the channel or publishing track:', error);
      }
    };

    initAgora();

    return () => {
      // Clean up on component unmount
      const client = clientRef.current;
      if (client) {
        client.leave().then(() => {
          console.log('Left the channel successfully');
        }).catch((error) => {
          console.error('Error leaving the channel:', error);
        });
      }
      if (localTrack) {
        localTrack.close();
      }
    };
  }, [appId, channel, token, uid]);

  return { localTrack, remoteUsersRef, joined };
};

export default useAgora;

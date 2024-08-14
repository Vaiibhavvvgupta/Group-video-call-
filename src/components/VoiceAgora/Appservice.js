// const signalingEngine = new AgoraRTM.RTM(appid, '123', { token: null });
import React, { useState, useEffect, createContext, useContext } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import  AgoraRTM from "agora-rtm-sdk";

export const AgoraContext = createContext();

export const AgoraProvider = ({ children }) => {
  const [rtcClient, setRtcClient] = useState(null);
//   const [rtmClient, setRtmClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [micMuted, setMicMuted] = useState(true);
  const [audioTracks, setAudioTracks] = useState({ localAudioTrack: null, remoteAudioTracks: {} });

  const appid = "39861fd403704cadb2813028035aadbd"; // Replace with your Agora App ID
  useEffect(() => {
    const initializeAgora = async () => {
      const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    //   const rtmClient = AgoraRTM.createInstance(appid);
    // const client = AgoraRTM.createInstance(appid)
    // const client = AgoraRTM.createInstance(appid, { enableLogUpload: false });
    // const signalingEngine = new AgoraRTM.RTM(appid, rtmUid, { token: 'temporary-token' });
      setRtcClient(rtcClient);
    //   setRtmClient(client);
    };

    initializeAgora();
  }, []);

  const toggleMic = async () => {
    if (audioTracks.localAudioTrack) {
      await audioTracks.localAudioTrack.setMuted(!micMuted);
      setMicMuted(!micMuted);
    }
  };

  const joinRoom = async (roomId, displayName, avatar) => {
    try {
      const rtcUid = Math.floor(Math.random() * 1000000);  // Generate random UID for RTC
    //   const rtmUid = Math.floor(Math.random() * 1000000);  // Generate random UID for RTM

      // Join the RTC (Real-Time Communication) channel
      await rtcClient.join(appid, roomId, null, rtcUid);
      
      // Create and publish the local audio track
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await rtcClient.publish(localAudioTrack);
      setAudioTracks({ ...audioTracks, localAudioTrack });
    

      // Login to RTM (Real-Time Messaging) with the user's UID
    //   await rtmClient.login({ uid: rtmUid.toString(), token: null });

      // Create and join the RTM channel
    //   const channel = rtmClient.createChannel(roomId);
    //   await channel.join();

      // Set user attributes in RTM for identification
    //   await rtmClient.addOrUpdateLocalUserAttributes({
    //     name: displayName,
    //     userRtcUid: rtcUid.toString(),
    //     userAvatar: avatar,
    //   });

      // Set the current channel
    //   setChannel(channel);

      // Event listeners for when members join or leave the RTM channel
    //   channel.on('MemberJoined', handleMemberJoined);
    //   channel.on('MemberLeft', handleMemberLeft);

      // Fetch the initial list of members in the channel
    //   const memberList = await channel.getMembers();
//       const fetchedMembers = await Promise.all(
//         memberList.map(async (memberId) => {
//           const { name, userRtcUid, userAvatar } = await rtmClient.getUserAttributesByKeys(memberId, ['name', 'userRtcUid', 'userAvatar']);
//           return { uid: userRtcUid, name, avatar: userAvatar };
//         })
//       );
//       setMembers(fetchedMembers);

    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Error: Unable to join the room. Please try again.');
    }
  };

  const leaveRoom = async () => {
    if (audioTracks.localAudioTrack) {
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
      rtcClient.unpublish();
      rtcClient.leave();
    }

    if (channel) {
      await channel.leave();
    //   await rtmClient.logout();
    }

    setMembers([]);
  };

//   const handleMemberJoined = async (memberId) => {
//     const { name, userRtcUid, userAvatar } = await rtmClient.getUserAttributesByKeys(memberId, ['name', 'userRtcUid', 'userAvatar']);
//     setMembers((prevMembers) => [...prevMembers, { uid: userRtcUid, name, avatar: userAvatar }]);
//   };

//   const handleMemberLeft = (memberId) => {
//     setMembers((prevMembers) => prevMembers.filter((member) => member.uid !== memberId));
//   };

  return (
    <AgoraContext.Provider value={{ micMuted, toggleMic, members, joinRoom, leaveRoom }}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => useContext(AgoraContext);

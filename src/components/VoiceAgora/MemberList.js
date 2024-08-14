import React from 'react';
import { useAgora } from './Appservice';

const MemberList = () => {
  const { members } = useAgora();

  return (
    <div id="members">
      {members.map((member) => (
        <div key={member.uid} className={`speaker user-rtc-${member.uid}`}>
          <img className={`user-avatar avatar-${member.uid}`} src={member.avatar} alt="avatar" />
          <p>{member.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MemberList;

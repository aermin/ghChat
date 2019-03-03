import React from 'react';
import './styles.scss';
import UserAvatar from '../UserAvatar';

function GroupAvatar({ members }) {
  if (!members.length) return <UserAvatar name="?" size="46" borderRadius="50%" />;
  const willRenderMembers = members.slice(0, 4);
  const avatarRender = willRenderMembers.map((e) => {
    const size = `${46 / 2}`;
    return <UserAvatar key={e.user_id} src={e.avatar} name={e.name} size={size} borderRadius="0%" />;
  });

  return (
    <div className="groupAvatar">
      {avatarRender}
    </div>
  );
}


export default GroupAvatar;

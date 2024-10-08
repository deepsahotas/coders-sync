import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
  return (
    <div className="client">
      <Avatar name={username} size="50" round="6px" />
      <p className="username">{username}</p>
    </div>
  );
};

export default Client;

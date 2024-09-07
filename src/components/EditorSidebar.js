import React from 'react';
import Client from './Client';

const EditorSidebar = ({ clients, copyRoomId, leaveRoom }) => {
  return (
    <div className="flex flex-col min-h-screen py-4 px-7 bg-gray-300 w-1/6 justify-between">
      <div className="aside-inner flex justify-between flex-col">
        <div className="logo">
          <h2 className="text-2xl font-bold mb-6">
            Coder's <span className="text-indigo-600">Sync</span>
          </h2>
        </div>
        <div className="text-green-800 mb-6">Connected !</div>
        <div className="clientList flex justify-between text-center">
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
      </div>
      <div>
        <button
          className="bg-indigo-800 text-white p-2 rounded-md w-full"
          onClick={copyRoomId}
        >
          Copy ROOM ID
        </button>
        <button
          className="bg-red-700 text-white p-2 rounded-md w-full mt-4"
          onClick={leaveRoom}
        >
          Leave The Room
        </button>
      </div>
    </div>
  );
};

export default EditorSidebar;

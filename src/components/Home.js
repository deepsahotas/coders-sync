import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// import logo from './../logo.png';

const Home = () => {
  const [roomID, setRoomID] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomID(id);
    toast.success('Created New Room !');
  };
  const joinRoom = () => {
    if (!roomID || !username) {
      toast.error('Room id & username is required !');
      return;
    }
    // Redirect
    navigate(`/editor/${roomID}`, {
      state: {
        username,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-md max-w-md w-full p-10 shadow-md">
        {/* <img width="150px" src={logo} alt="" /> */}
        <h2 className="text-2xl font-bold mb-6">
          Coder's <span className="text-indigo-600">Sync</span>
        </h2>
        <div className="mb-4">
          <label className="block text-sm">Paste invitation ROOM ID</label>
          <input
            className="block border border-gray-300 rounded-md w-full p-3 mt-3 focus:outline-none shadow-md"
            type="text"
            placeholder="ROOM ID"
            name="roomid"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            className="block border border-gray-300 rounded-md w-full p-3 mt-3 focus:outline-none shadow-md"
            type="text"
            placeholder="USERNAME"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <div>
            <button
              onClick={joinRoom}
              className="bg-indigo-800 text-white rounded-md p-2 px-10 mt-6 focus:bg-indigo-700"
            >
              Join Now !
            </button>
          </div>
        </div>
        <h3 className="text-sm text-gray-500 mt-10">
          If you don't have an invite then create{' '}
          <button onClick={createNewRoom} className="text-indigo-900 underline">
            New Room
          </button>
        </h3>
      </div>
    </div>
  );
};

export default Home;

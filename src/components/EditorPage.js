import React, { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import EditorSidebar from './EditorSidebar';

const EditorPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const location = useLocation();
  const [clients, setClient] = useState([]);
  const handleErrors = (e) => {
    console.log('socket error, e');
    toast.error('Socket connection failed try again later');
    reactNavigator('/');
  };
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('failed', (err) => handleErrors(err));
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      // Lisetening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            toast.success(`${username} joined the room`);
          }
          setClient(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const copyRoomId = async () => {
    try {
      if (navigator) {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
      }
    } catch (err) {
      toast.error("Could't copied room ID", err);
    }
  };

  const leaveRoom = () => {
    reactNavigator('/');
  };

  if (!location.state) {
    <Navigate to={'/'} />;
  }
  return (
    <div className="flex">
      <EditorSidebar
        clients={clients}
        copyRoomId={copyRoomId}
        leaveRoom={leaveRoom}
      />
      <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(code) => (codeRef.current = code)}
      />
    </div>
  );
};

export default EditorPage;

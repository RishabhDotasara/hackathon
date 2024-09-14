"use client";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button } from '@/components/ui/button';


const socket = io('http://localhost:3000');

const SocketIOClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
      const socketId = socket.id;
      console.log(`Socket ID: ${socketId}`);
    });

    socket.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      
      
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.send(message);
    setMessage('');
  };

  return (
    <div>
       <h1>Socket.IO Client</h1>
      <p>Socket ID: {socket.id}</p>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        placeholder="Enter message"
        className='border border-gray-300 rounded px-2 py-1'
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>Send Message</Button>
    </div>
  );
};

export default SocketIOClient;







"use client";

import React, { useState } from 'react';
import { FiMenu, FiSearch, FiVideo, FiPhone, FiSend, FiPaperclip, FiHome, FiMessageSquare, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

// Define types for Contact
interface Contact {
  id: number;
  name: string;
  avatar: string;
}

const ChatPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState<string>('');

  const contacts: Contact[] = [
    { id: 1, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ];


  const handleContactSelect = (contact: Contact) => setSelectedContact(contact);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-100">

      {/* Contacts Sidebar */}
      <div className="bg-white shadow-lg transition-all duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-black font-semibold">Chats</h2>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-800" />
          </div>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedContact?.id === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              >
                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
                <span className="text-black">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedContact && (
      <>
      <div className="flex-1 flex flex-col">
        {/* Header */}
         <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full mr-3" />
                <span className="font-semibold">{selectedContact.name}</span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-blue-600" >
              <FiVideo size={20} />
            </button>
            <button className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-blue-600">
              <FiPhone size={20} />
            </button>
          </div>
        </div> 

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sample messages - replace with actual message components */}
           <div className="flex justify-end">
            <div className="bg-blue-500 text-black rounded-lg p-3 max-w-xs lg:max-w-md">
              Hey there! How's it going?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-xs lg:max-w-md">
              Hi! I'm doing great, thanks for asking. How about you?
            </div>
          </div>
        </div>

        {/* Message Input */}
         <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
          <div className="flex items-center space-x-2">
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </div> 
      </>
      )}
    </div>
  );
};

export default ChatPage;


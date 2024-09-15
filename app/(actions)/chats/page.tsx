'use client'

import React, { useEffect, useState, useRef } from 'react'
import { FiVideo, FiPhone, FiSend, FiPaperclip, FiChevronDown, FiUser } from 'react-icons/fi'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import io, { Socket } from "socket.io-client"

interface Contact {
  id: number
  name: string
  avatar: string
}

const contacts: Contact[] = [
  { id: 1, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 2, name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 3, name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

interface Message {
  id: number
  sender: string
  content: string
}

export default function ChatPage() {
  const socket = useRef<Socket | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [room, setRoom] = useState<number | undefined>()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [receivedMessage, setReceivedMessage] = useState('')

  useEffect(() => {
    socket.current = io('http://localhost:3000')

    return () => {
      socket.current?.disconnect()
    }
  }, [])

  const joinRoom = () => {
    if (room) socket.current?.emit('join_room', room)
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setRoom(contact.id)
    joinRoom()
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      socket.current?.emit('send_message', { message, room })
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), sender: 'Me', content: message }
      ])
      setMessage('') // Clear message input
    }
  }

  useEffect(() => {
    socket.current?.on('receive_message', (data: any) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), sender: 'Other', content: data.message }
      ])
    })

    return () => {
      socket.current?.off('receive_message')
    }
  }, [])

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {selectedContact ? (
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full rounded-full" />
            ) : (
              <FiUser className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                {selectedContact ? selectedContact.name : 'Select a chat'}
                <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {contacts.map((contact:any) => (
                <DropdownMenuItem key={contact.id} onSelect={() => handleContactSelect(contact)}>
                  {contact.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-x-2">
          <Button size="icon" variant="ghost">
            <FiVideo className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <FiPhone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedContact ? (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.sender === 'Me' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} rounded-lg p-3 max-w-xs lg:max-w-md`}>
                <p><strong>{msg.sender}</strong></p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No chat selected</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Button type="button" size="icon" variant="ghost">
            <FiPaperclip className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

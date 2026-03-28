import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, User, Search } from 'lucide-react';
import { useStaffMessages } from '../contexts/StaffMessageContext';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface StaffMessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffMessagePanel({ isOpen, onClose }: StaffMessagePanelProps) {
  const {
    conversations,
    activeConversation,
    activeMessages,
    allUsers,
    unreadCount,
    setActiveConversation,
    sendMessage,
    startConversation,
    refreshUnreadCount
  } = useStaffMessages();

  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Poll for unread count when panel is closed
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, refreshUnreadCount]);

  const handleSend = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      await sendMessage(messageInput.trim());
      setMessageInput('');
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.id !== user?.id &&
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[450px] bg-gray-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-indigo-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Staff Messages</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            {/* New Message Button */}
            <button
              onClick={() => setShowNewMessage(true)}
              className="p-3 m-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <User size={18} />
              <span>New Message</span>
            </button>

            {/* Search/Filter */}
            <div className="px-2 pb-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3 text-left border-b border-gray-700 transition-colors ${
                    activeConversation?.id === conv.id
                      ? 'bg-indigo-900/50'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white truncate">
                      {conv.otherParticipant.name}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  )}
                </button>
              ))}

              {conversations.length === 0 && (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {showNewMessage ? (
              /* New Message View */
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-white font-medium">Select Recipient</h3>
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {filteredUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        startConversation(u.id);
                        setShowNewMessage(false);
                      }}
                      className="w-full p-3 text-left hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                    >
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : activeConversation ? (
              /* Active Conversation View */
              <>
                {/* Conversation Header */}
                <div className="p-3 border-b border-gray-700">
                  <h3 className="text-white font-medium">
                    {activeConversation.otherParticipant.name}
                  </h3>
                  <p className="text-xs text-gray-400 capitalize">
                    {activeConversation.otherParticipant.role}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {activeMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender_id === user?.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-indigo-200' : 'text-gray-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Select a conversation or start a new message</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

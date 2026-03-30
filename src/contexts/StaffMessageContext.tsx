import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authFetch } from '../store/authStore';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

interface Conversation {
  id: string;
  otherParticipant: StaffUser;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface StaffMessageContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeMessages: Message[];
  allUsers: StaffUser[];
  unreadCount: number;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
  startConversation: (userId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const StaffMessageContext = createContext<StaffMessageContextType | undefined>(undefined);

export function StaffMessageProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<StaffUser[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Polling interval (30 seconds)
  const POLL_INTERVAL = 30000;

  // Fetch all users for composing new messages
  const fetchUsers = useCallback(async () => {
    try {
      const response = await authFetch('http://localhost:3000/api/staff-messages/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // Fetch conversations
  const refreshConversations = useCallback(async () => {
    try {
      const response = await authFetch('http://localhost:3000/api/staff-messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, []);

  // Fetch unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await authFetch('http://localhost:3000/api/staff-messages/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await authFetch(`http://localhost:3000/api/staff-messages/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setActiveMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // Start polling
  useEffect(() => {
    refreshConversations();
    refreshUnreadCount();
    fetchUsers();

    const pollInterval = setInterval(() => {
      refreshConversations();
      refreshUnreadCount();
      if (activeConversation) {
        fetchMessages(activeConversation.id);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [refreshConversations, refreshUnreadCount, fetchUsers, activeConversation, fetchMessages]);

  // When active conversation changes, fetch messages
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      // Clear unread count for this conversation locally
      setConversations(prev => prev.map(c =>
        c.id === activeConversation.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  }, [activeConversation, fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversation) return;

    try {
      const response = await authFetch('http://localhost:3000/api/staff-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setActiveMessages(prev => [...prev, newMessage]);
        // Refresh conversations to update last message
        refreshConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [activeConversation, refreshConversations]);

  // Start new conversation
  const startConversation = useCallback(async (userId: string) => {
    try {
      const response = await authFetch('http://localhost:3000/api/staff-messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      });

      if (response.ok) {
        const conversation = await response.json();
        await refreshConversations();
        // Find the conversation we just created/retrieved
        const found = conversations.find(c => c.id === conversation.id) || {
          id: conversation.id,
          otherParticipant: allUsers.find(u => u.id === userId),
          lastMessage: null,
          lastMessageAt: null,
          unreadCount: 0
        };
        setActiveConversation(found);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }, [conversations, allUsers, refreshConversations]);

  return (
    <StaffMessageContext.Provider
      value={{
        conversations,
        activeConversation,
        activeMessages,
        allUsers,
        unreadCount,
        setActiveConversation,
        sendMessage,
        startConversation,
        refreshConversations,
        refreshUnreadCount,
      }}
    >
      {children}
    </StaffMessageContext.Provider>
  );
}

export function useStaffMessages() {
  const context = useContext(StaffMessageContext);
  if (context === undefined) {
    throw new Error('useStaffMessages must be used within a StaffMessageProvider');
  }
  return context;
}

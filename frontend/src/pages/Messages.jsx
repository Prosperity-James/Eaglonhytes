import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes/api/contact.php?user_messages=true', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-amber-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Messages</h1>
          <p className="text-gray-600">View your contact messages and admin replies</p>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-4">
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <EnvelopeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No messages yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contact us from the Contact page
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-amber-500' : ''
                  } ${message.status === 'unread' ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">
                      {message.subject || 'No Subject'}
                    </h3>
                    {message.status === 'replied' ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {message.message?.substring(0, 60)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(message.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      message.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {message.status === 'replied' ? 'Replied' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 p-6 border-b-4 border-amber-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedMessage.subject || 'No Subject'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Sent on {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedMessage.status === 'replied' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMessage.status === 'replied' ? 'Replied' : 'Pending Reply'}
                    </span>
                  </div>
                </div>

                {/* Your Message */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {selectedMessage.name?.charAt(0) || 'Y'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{selectedMessage.name}</span>
                        <span className="text-sm text-gray-500">You</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Email: {selectedMessage.email}</p>
                        {selectedMessage.phone && <p>Phone: {selectedMessage.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Reply */}
                {selectedMessage.admin_reply ? (
                  <div className="p-6 bg-green-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">Eaglonhytes Admin</span>
                          <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
                            Official Reply
                          </span>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                          <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                        </div>
                        {selectedMessage.replied_at && (
                          <div className="mt-2 text-xs text-gray-500">
                            Replied on {new Date(selectedMessage.replied_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-yellow-50">
                    <div className="flex items-center space-x-3 text-yellow-800">
                      <ClockIcon className="w-6 h-6" />
                      <div>
                        <p className="font-semibold">Waiting for Admin Reply</p>
                        <p className="text-sm text-yellow-700">
                          Our team will respond to your message soon. Please check back later.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-12 text-center">
                <EnvelopeIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Message
                </h3>
                <p className="text-gray-600">
                  Choose a message from the list to view details and admin replies
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

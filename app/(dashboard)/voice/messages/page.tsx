import React, { useState } from 'react';

interface VoiceMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  company: string;
  role: string;
  content: string;
  timestamp: string;
  duration: string;
  isRead: boolean;
}

export default function VoiceMessagesPage() {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      senderAvatar: 'SJ',
      company: 'Google',
      role: 'Senior Recruiter',
      content: 'Hi Habib, I\'m Sarah from Google. We have a React role that might be perfect for you. Let\'s talk!',
      timestamp: '2 hours ago',
      duration: '0:45',
      isRead: false
    },
    {
      id: '2',
      sender: 'Michael Chen',
      senderAvatar: 'MC',
      company: 'Microsoft',
      role: 'Tech Lead',
      content: 'Your portfolio caught our attention. We\'d like to schedule a technical interview next week.',
      timestamp: '5 hours ago',
      duration: '1:22',
      isRead: true
    },
    {
      id: '3',
      sender: 'Emma Rodriguez',
      senderAvatar: 'ER',
      company: 'Amazon',
      role: 'Hiring Manager',
      content: 'Thanks for your interest in our frontend position. I\'d love to learn more about your experience with React.',
      timestamp: '1 day ago',
      duration: '0:58',
      isRead: true
    },
    {
      id: '4',
      sender: 'David Kim',
      senderAvatar: 'DK',
      company: 'StartupXYZ',
      role: 'CTO',
      content: 'We\'re a fast-growing startup looking for a full-stack developer. Your background looks promising!',
      timestamp: '2 days ago',
      duration: '2:15',
      isRead: true
    }
  ]);

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, isRead: true} : msg
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
          Voice Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage voice messages from recruiters and hiring managers
        </p>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inbox</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {messages.filter(m => !m.isRead).length} unread messages
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No voice messages yet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recruiters can leave voice messages on your portfolio. They&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-xl p-4 transition-all ${
                  message.isRead 
                    ? 'border-gray-200 dark:border-gray-700 bg-white/20' 
                    : 'border-[#FF6B35]/30 bg-[#FF6B35]/5'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold">
                      {message.senderAvatar}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{message.sender}</h3>
                        <p className="text-[#FF6B35] font-medium">{message.company} • {message.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{message.timestamp}</p>
                        <div className="flex justify-end space-x-2 mt-1">
                          <button 
                            onClick={() => markAsRead(message.id)}
                            className="text-gray-500 hover:text-[#FF6B35]"
                            title="Mark as read"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => deleteMessage(message.id)}
                            className="text-gray-500 hover:text-red-500"
                            title="Delete message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mt-2 mb-3">{message.content}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{message.duration}</span>
                      {!message.isRead && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35] text-white">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mb-3">
              <span className="text-[#FF6B35] font-bold">1</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Recruiters Visit Your Portfolio</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Hiring managers and recruiters discover your portfolio through search or referrals.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mb-3">
              <span className="text-[#FF6B35] font-bold">2</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">They Leave Voice Messages</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Recruiters can leave personalized voice messages directly on your portfolio.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mb-3">
              <span className="text-[#FF6B35] font-bold">3</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">You Respond</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Listen to messages and respond with your own voice or text to start conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
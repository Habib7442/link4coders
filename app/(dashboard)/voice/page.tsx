'use client';

import React, { useState } from 'react';

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState<Array<{role: string, content: string}>>([]);
  // Removed unused recognitionRef

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    
    // Simulate voice recognition
    setTimeout(() => {
      const sampleQuestions = [
        "Tell me about your most challenging project",
        "What technologies are you most experienced with?",
        "Why should we hire you for this position?",
        "What's your approach to problem-solving?"
      ];
      
      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setTranscript(randomQuestion);
      
      // Simulate AI response
      setTimeout(() => {
        const sampleResponses = [
          "I'd be happy to tell you about my experience. My most challenging project was building a real-time collaborative code editor that handled thousands of concurrent users. I used WebSockets for real-time communication and implemented operational transformation to handle conflicts.",
          "I specialize in React, TypeScript, and Node.js. I've also worked extensively with cloud technologies like AWS and have experience with databases like PostgreSQL and MongoDB.",
          "You should hire me because I bring both technical expertise and strong problem-solving skills. I've successfully led teams of developers and have a track record of delivering projects on time and under budget.",
          "My approach to problem-solving involves breaking down complex problems into smaller, manageable components. I also believe in researching multiple solutions before implementing the best one."
        ];
        
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        setResponses(prev => [
          ...prev,
          { role: 'user', content: randomQuestion },
          { role: 'assistant', content: randomResponse }
        ]);
        
        setIsListening(false);
      }, 2000);
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
          AI Voice Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice interviews and get real-time feedback from your AI assistant
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Voice Assistant Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voice Assistant</h2>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isListening ? 'Listening...' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Voice Visualization */}
            <div className="flex justify-center my-8">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full transition-all duration-300 ${isListening ? 'bg-[#FF6B35]/20 scale-110' : 'bg-[#FF6B35]/10'}`}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-24 h-24 rounded-full transition-all duration-300 ${isListening ? 'bg-[#FF6B35]/30 scale-105' : 'bg-[#FF6B35]/20'}`}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-[#FF6B35] animate-pulse' : 'bg-[#FF6B35]/50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="bg-white/50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-full hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Stop Listening
                </button>
              )}
            </div>
          </div>

          {/* Conversation History */}
          {responses.length > 0 && (
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conversation History</h3>
              <div className="space-y-4">
                {responses.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-[#FF6B35]/10' : 'bg-white/50'}`}>
                      <p className="text-gray-700 dark:text-gray-300">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interview Tips */}
        <div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interview Tips</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2"> STAR Method</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Structure your responses using Situation, Task, Action, and Result to provide clear, concise answers.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Technical Questions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Be prepared to explain your code, discuss trade-offs, and walk through your problem-solving process.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Behavioral Questions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Use specific examples from your experience to demonstrate your skills and cultural fit.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ask Questions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Prepare thoughtful questions about the company, team, and role to show your interest and engagement.
                </p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
              Practice Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
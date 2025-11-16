import React, { useState } from 'react';

interface VoiceWidgetProps {
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export default function VoiceWidget({ onTranscript, onResponse }: VoiceWidgetProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    
    // Simulate voice recognition
    setTimeout(() => {
      const sampleQuestions = [
        "Tell me about your experience",
        "What projects have you worked on?",
        "What are your strengths?",
        "Why should we hire you?"
      ];
      
      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setTranscript(randomQuestion);
      onTranscript?.(randomQuestion);
      
      // Simulate AI response
      setTimeout(() => {
        const sampleResponses = [
          "I'd be happy to tell you about my experience. I'm a full-stack developer with 5 years of experience building scalable web applications.",
          "I've worked on several projects including a real-time collaborative code editor and an AI-powered portfolio builder.",
          "My strengths include problem-solving, technical leadership, and building user-friendly interfaces with React and TypeScript.",
          "You should hire me because I bring both technical expertise and strong communication skills to any development team."
        ];
        
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        setResponse(randomResponse);
        onResponse?.(randomResponse);
        setIsListening(false);
      }, 2000);
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Voice Assistant</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Voice Visualization */}
      <div className="flex justify-center my-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full transition-all duration-300 ${isListening ? 'bg-[#FF6B35]/20 scale-110' : 'bg-[#FF6B35]/10'}`}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-[#FF6B35] animate-pulse' : 'bg-[#FF6B35]/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-white/50 rounded-lg p-3 mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">{transcript}</p>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="bg-[#FF6B35]/10 rounded-lg p-3 mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">{response}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center">
        {!isListening ? (
          <button
            onClick={startListening}
            className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-full hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Ask Me Anything
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Stop Listening
          </button>
        )}
      </div>
    </div>
  );
}
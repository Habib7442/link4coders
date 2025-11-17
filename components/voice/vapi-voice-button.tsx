'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Declare Vapi type
interface VapiInstance {
  start: (assistantId: string, options?: Record<string, unknown>) => Promise<unknown>;
  stop: () => void;
  on: (event: string, callback: (data?: unknown) => void) => void;
}

declare global {
  interface Window {
    vapiInstance?: VapiInstance;
  }
}

interface VapiVoiceButtonProps {
  userId: string;
  assistantId: string;
  publicKey: string;
  firstMessage?: string;
  onCallStart?: () => void;
  onCallEnd?: (data: { duration: number; cost?: number }) => void;
}

export function VapiVoiceButton({
  userId,
  assistantId,
  publicKey,
  firstMessage,
  onCallStart,
  onCallEnd
}: VapiVoiceButtonProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [vapiLoaded, setVapiLoaded] = useState(false);
  const vapiRef = useRef<unknown | null>(null);
  const callStartTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load VAPI SDK
  useEffect(() => {
    const loadVapi = async () => {
      try {
        // Dynamically import Vapi
        const { default: Vapi } = await import('@vapi-ai/web');
        
        // Initialize Vapi instance
        const vapi = new Vapi(publicKey) as unknown;
        vapiRef.current = vapi;
        window.vapiInstance = vapi as VapiInstance;

        // Set up event listeners
        (vapi as VapiInstance).on('call-start', () => {
          console.log('Call started');
          setIsConnecting(false);
          setIsCallActive(true);
          callStartTimeRef.current = Date.now();
          
          // Start duration counter
          durationIntervalRef.current = setInterval(() => {
            setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
          }, 1000);

          onCallStart?.();
        });

        (vapi as VapiInstance).on('call-end', () => {
          console.log('Call ended');
          const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          setIsConnecting(false);
          setIsCallActive(false);
          setIsSpeaking(false);
          setIsListening(false);
          setCallDuration(0);

          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
          }

          // Track conversation
          fetch('/api/track-voice-conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              conversationId: `call_${callStartTimeRef.current}`,
              duration,
              cost: 0
            })
          }).catch(err => console.error('Failed to track conversation:', err));

          onCallEnd?.({ duration });
        });

        (vapi as VapiInstance).on('speech-start', () => {
          console.log('Assistant speaking');
          setIsSpeaking(true);
          setIsListening(false);
        });

        (vapi as VapiInstance).on('speech-end', () => {
          console.log('Assistant stopped speaking');
          setIsSpeaking(false);
        });

        (vapi as VapiInstance).on('message', (message) => {
          console.log('Message:', message);
          
          if ((message as Record<string, unknown>)?.type === 'function-call') {
            console.log('Function call:', message);
          }
        });

        (vapi as VapiInstance).on('error', (error) => {
          console.error('Vapi error:', error);
          setIsConnecting(false);
          toast.error('Voice assistant error: ' + (error as Error).message);
        });

        setVapiLoaded(true);
      } catch (error) {
        console.error('Failed to load Vapi:', error);
        toast.error('Failed to initialize voice assistant');
      }
    };

    loadVapi();

    // Cleanup
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (vapiRef.current) {
        (vapiRef.current as VapiInstance).stop();
      }
    };
  }, [publicKey, onCallStart, onCallEnd]);

  const startCall = async () => {
    if (!vapiRef.current || !vapiLoaded) {
      toast.error('Voice assistant not ready');
      return;
    }

    setIsConnecting(true);
    try {
      await (vapiRef.current as VapiInstance).start(assistantId, {
        metadata: {
          userId,
          timestamp: new Date().toISOString()
        }
      });
      
      setIsListening(true);
      toast.success('Voice assistant connected!');
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsConnecting(false);
      toast.error('Failed to start voice call');
    }
  };

  const endCall = () => {
    if (!vapiRef.current) return;

    try {
      (vapiRef.current as VapiInstance).stop();
      toast.info('Voice call ended');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!vapiLoaded) {
    return (
      <Button
        disabled
        className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-white"
      >
        <Mic className="w-5 h-5 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Button */}
      <Button
        onClick={isCallActive ? endCall : startCall}
        disabled={isConnecting && !isCallActive}
        className={`relative overflow-hidden transition-all duration-300 ${
          isCallActive
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            : isConnecting
            ? 'bg-gradient-to-r from-[#29ADFF] to-[#54E0FF] cursor-wait'
            : 'bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF]'
        } text-white font-semibold px-6 py-3 rounded-full shadow-lg ${
          isCallActive ? 'scale-110' : ''
        }`}
      >
        {/* Pulse animation for active call */}
        {isCallActive && (
          <span className="absolute inset-0 rounded-full bg-white opacity-0 animate-ping" />
        )}
        
        <div className="relative flex items-center gap-2">
          {isCallActive ? (
            <>
              <PhoneOff className="w-5 h-5" />
              End Call
            </>
          ) : isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Talk to AI Assistant
            </>
          )}
        </div>
      </Button>

      {/* Call Status */}
      {isCallActive && (
        <div className="flex flex-col items-center gap-2">
          {/* Duration */}
          <div className="text-white font-mono text-lg">
            {formatDuration(callDuration)}
          </div>

          {/* Visual Indicator */}
          <div className="flex items-center gap-3">
            {/* Listening Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isListening ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'
            }`}>
              <Mic className={`w-4 h-4 ${isListening ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-xs text-white">
                {isListening ? 'Listening' : 'Idle'}
              </span>
            </div>

            {/* Speaking Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isSpeaking ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-gray-500/20 border border-gray-500/50'
            }`}>
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-500 animate-pulse' : 'text-gray-500'}`} />
              <span className="text-xs text-white">
                {isSpeaking ? 'Speaking' : 'Quiet'}
              </span>
            </div>
          </div>

          {/* Waveform visualization */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full ${
                    isSpeaking ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationName: 'pulse',
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* First Message Hint */}
      {!isCallActive && firstMessage && (
        <p className="text-sm text-gray-400 text-center max-w-xs italic">
          &quot;{firstMessage}&quot;
        </p>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}

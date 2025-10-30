import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { AIVoice, Plan } from '../types';
import { PhoneIcon, CaptionsIcon } from './Icons';

// --- Guideline-compliant Helper Functions ---

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};


const API_KEY = process.env.API_KEY;

type CallState = 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR' | 'ENDED';

interface Transcription {
    user: string;
    bot: string;
}

// FIX: Define props interface for LiveCallView component
interface LiveCallViewProps {
  plan: Plan;
  onClose: () => void;
  aiVoice: AIVoice;
  callType: 'audio' | 'video';
}

const LiveCallView: React.FC<LiveCallViewProps> = ({ plan, onClose, aiVoice, callType }) => {
  const [callState, setCallState] = useState<CallState>('CONNECTING');
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(true);
  const [transcription, setTranscription] = useState<Transcription>({ user: '', bot: '' });
  
  const [remainingTime, setRemainingTime] = useState(() => {
    if (plan === 'platinum') return Infinity;
    if (callType === 'video') return plan === 'basic' ? 60 : 1800;
    return plan === 'basic' ? 600 : Infinity;
  });
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const timerRef = useRef<number | null>(null);
  const speakingTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const handleEndCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    sessionPromiseRef.current?.then(session => session.close());
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!API_KEY) {
      console.error("API Key not found.");
      setCallState('ERROR');
      return;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    let nextStartTime = 0;
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const sources = new Set<AudioBufferSourceNode>();
    
    let mediaStream: MediaStream | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    
    const cleanup = () => {
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
        if (scriptProcessor) {
            scriptProcessor.disconnect();
            scriptProcessor.onaudioprocess = null;
        }
        if (sourceNode) sourceNode.disconnect();
        mediaStream?.getTracks().forEach(track => track.stop());
        if (inputAudioContext.state !== 'closed') inputAudioContext.close();
        if (outputAudioContext.state !== 'closed') outputAudioContext.close();
        sources.forEach(s => s.stop());
        sources.clear();
    };

    let currentInputTranscription = '';
    let currentOutputTranscription = '';

    sessionPromiseRef.current = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: async () => {
          setCallState('LISTENING');
          try {
            const constraints = { audio: true, video: callType === 'video' };
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (callType === 'video' && videoRef.current) videoRef.current.srcObject = mediaStream;

            sourceNode = inputAudioContext.createMediaStreamSource(mediaStream);
            scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            sourceNode.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            if (callType === 'video') {
                const videoEl = videoRef.current;
                const canvasEl = canvasRef.current;
                if (videoEl && canvasEl) {
                    const ctx = canvasEl.getContext('2d');
                    frameIntervalRef.current = window.setInterval(() => {
                        canvasEl.width = videoEl.videoWidth;
                        canvasEl.height = videoEl.videoHeight;
                        ctx?.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
                        canvasEl.toBlob(
                            async (blob) => {
                                if (blob) {
                                    const base64Data = await blobToBase64(blob);
                                    sessionPromiseRef.current?.then((session) => {
                                        session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                                    });
                                }
                            }, 'image/jpeg', 0.7 );
                    }, 1000 / 5); // 5fps
                }
            }
          } catch (error) {
            console.error('Error getting user media:', error);
            setCallState('ERROR');
            onClose();
          }
        },
        onmessage: async (message: LiveServerMessage) => {
          const content = message.serverContent;
          if (content?.outputTranscription) currentOutputTranscription += content.outputTranscription.text;
          if (content?.inputTranscription) currentInputTranscription += content.inputTranscription.text;
          setTranscription({ user: currentInputTranscription, bot: currentOutputTranscription });

          if (content?.turnComplete) {
              currentInputTranscription = '';
              currentOutputTranscription = '';
          }

          const base64Audio = content?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            setCallState('SPEAKING');
            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start(nextStartTime);
            const newEndTime = nextStartTime + audioBuffer.duration;
            nextStartTime = newEndTime;
            sources.add(source);
            source.addEventListener('ended', () => {
                sources.delete(source);
                if (sources.size === 0) setCallState('LISTENING');
            });
          }

          if (content?.interrupted) {
            sources.forEach(source => source.stop());
            sources.clear();
            nextStartTime = 0;
            setCallState('LISTENING');
          }
        },
        onerror: (e: ErrorEvent) => {
          console.error('Live session error:', e);
          setCallState('ERROR');
          cleanup();
        },
        onclose: (e: CloseEvent) => {
          setCallState('ENDED');
          cleanup();
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: aiVoice } } },
        systemInstruction: 'You are a friendly and helpful AI assistant named Dhozzi. You are on a video call with a user. You will receive a continuous stream of audio and video frames from them. Actively observe the video feed and comment on what you see when it is relevant. Be conversational and respond to both their speech and their actions.',
      },
    });

    return () => {
      sessionPromiseRef.current?.then(session => session.close());
      cleanup();
    };

  }, [aiVoice, onClose, callType]);

  useEffect(() => {
    if (remainingTime !== Infinity) {
      timerRef.current = window.setInterval(() => {
        setRemainingTime(prev => { if (prev <= 1) { handleEndCall(); return 0; } return prev - 1; });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [remainingTime, handleEndCall]);
  
  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-fade-in-fast">
        <div className="text-center">
            <div className="relative inline-block w-40 h-40">
                 <div className={`w-full h-full rounded-full bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] ${callState === 'LISTENING' ? 'animate-breathing' : ''}`}></div>
                 {callState === 'SPEAKING' && (<><div className="animate-sonar-wave"/><div className="animate-sonar-wave" style={{ animationDelay: '1s' }}/></>)}
                 <div className="absolute inset-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <PhoneIcon className="w-16 h-16 text-white" />
                 </div>
            </div>
            <h2 className="text-3xl font-bold mt-8 text-white capitalize">{callType} Call in Progress</h2>
            <p className="text-gray-300 mt-2 capitalize">{callState}...</p>
            {remainingTime !== Infinity && callState !== 'CONNECTING' && (
                <div className="mt-4 text-lg font-mono text-yellow-400 bg-yellow-900/30 border border-yellow-700/50 rounded-lg px-4 py-2 inline-block">
                    Time Remaining: {formatTime(remainingTime)}
                </div>
            )}
        </div>

        {isCaptionsEnabled && (
            <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 text-center pointer-events-none">
                {transcription.user && <p className="inline-block bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-lg text-gray-300 animate-fade-in-fast leading-relaxed mb-2">You: {transcription.user}</p>}
                <br/>
                {transcription.bot && <p className="inline-block bg-[--color-accent]/20 backdrop-blur-sm px-4 py-2 rounded-lg text-lg text-white animate-fade-in-fast leading-relaxed">AI: {transcription.bot}</p>}
            </div>
        )}

        {callType === 'video' && (
            <div className="absolute bottom-32 sm:bottom-16 right-4 sm:right-8 w-40 sm:w-60 h-32 sm:h-44 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
                <canvas ref={canvasRef} className="hidden" />
            </div>
        )}
        
        <button
            onClick={() => setIsCaptionsEnabled(prev => !prev)}
            className={`absolute bottom-8 sm:bottom-16 left-8 p-4 rounded-full transition-colors ${isCaptionsEnabled ? 'bg-white/20 text-white' : 'bg-black/30 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            aria-label="Toggle Captions" title="Toggle Captions">
            <CaptionsIcon className="w-6 h-6" />
        </button>

        <button 
            onClick={handleEndCall}
            className="absolute bottom-8 sm:bottom-16 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 transition-colors"
            aria-label="End call">
            <PhoneIcon className="w-6 h-6 transform rotate-[135deg]" /> End Call
        </button>
    </div>
  );
};

export default LiveCallView;
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Message, Plan } from '../types';
import { DhozziLogo, UserIcon, ImagenIcon, DownloadIcon, VeoIcon, GlobeIcon, XCircleIcon, SpeakerWaveIcon, StopCircleIcon, PencilIcon, MapPinIcon } from './Icons';
import { default as ReactMarkdown } from 'react-markdown';

const ImageEditorModal = lazy(() => import('./ImageEditorModal'));

interface ChatMessageProps {
  message: Message;
  onRetry?: (messageId: string) => void;
  plan: Plan;
  onUpdateMessage: (messageId: string, newContent: Partial<Message>) => void;
  speakingMessageId: string | null;
  onTtsToggle: (messageId: string, text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onRetry,
  plan,
  onUpdateMessage,
  speakingMessageId,
  onTtsToggle,
}) => {
  const isUser = message.sender === 'user';
  
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isBotGeneratedImage = !isUser && message.image && message.image !== 'loading';
  const isBotGeneratedVideo = !isUser && message.video && message.video !== 'loading';

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchAndSetVideo = async () => {
        if (isBotGeneratedVideo && message.video) {
            setVideoBlob(null);
            setVideoSrc(null);
            try {
                const response = await fetch(message.video);
                if (!response.ok) {
                    throw new Error(`Failed to fetch video: ${response.statusText}`);
                }
                const blob = await response.blob();
                setVideoBlob(blob);
                objectUrl = URL.createObjectURL(blob);
                setVideoSrc(objectUrl);
            } catch (error) {
                console.error("Error fetching video data:", error);
                setVideoSrc(null);
            }
        }
    };

    fetchAndSetVideo();

    return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    };
  }, [message.video, isBotGeneratedVideo]);

  const handleDownload = () => {
    if (isBotGeneratedImage && message.image) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${message.image}`;
      link.download = `dhozzi-creation-${message.id}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (videoBlob) {
        const url = window.URL.createObjectURL(videoBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dhozzi-video-${message.id}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
  };
  
  const handleSaveEdit = (newBase64: string) => {
      onUpdateMessage(message.id, { image: newBase64 });
      setIsEditing(false);
  };
  
  return (
    <>
      <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] flex items-center justify-center">
            <DhozziLogo className="w-5 h-5 text-white" />
          </div>
        )}
        
        <div className={`max-w-xl px-5 py-3 rounded-2xl ${isUser ? 'bg-[--color-user-message] text-white' : 'bg-gray-700/50'} ${message.isError ? 'border border-red-500/50 bg-red-900/20' : ''}`}>
          {message.isError && !isUser ? (
            <>
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm">An Error Occurred</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              {onRetry && (
                <div className="mt-3">
                  <button
                    onClick={() => onRetry(message.id)}
                    className="px-4 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Retry
                  </button>
                </div>
              )}
            </>
          ) : (
              <>
                  {message.image === 'loading' && !isUser && (
                    <div className="rounded-lg mb-2 w-64 h-64 bg-gray-600/50 flex items-center justify-center animate-pulse">
                      <ImagenIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}

                  {message.video === 'loading' && !isUser && (
                      <div className="rounded-lg mb-2 w-80 h-48 bg-gray-600/50 flex items-center justify-center animate-pulse">
                          <VeoIcon className="w-12 h-12 text-gray-500" />
                      </div>
                  )}

                  {isUser && message.image && (
                     <img 
                       src={`data:${message.imageMimeType};base64,${message.image}`} 
                       alt="User upload" 
                       className="rounded-lg mb-2 max-w-xs" 
                     />
                  )}

                   {isUser && message.uploadedVideo && (
                    <video 
                        src={`data:${message.uploadedVideo.mimeType};base64,${message.uploadedVideo.base64}`}
                        controls
                        className="rounded-lg mb-2 max-w-xs"
                    />
                   )}
                  
                   {isUser && message.uploadedAudio && (
                      <audio
                          src={`data:${message.uploadedAudio.mimeType};base64,${message.uploadedAudio.base64}`}
                          controls
                          className="mb-2 w-full max-w-xs"
                      />
                  )}
                  
                  {isBotGeneratedImage && (
                    <div className="relative group mb-2">
                      <img 
                        src={`data:image/jpeg;base64,${message.image}`} 
                        alt="Generated by Dhozzi" 
                        className="rounded-lg max-w-xs" 
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white enabled:hover:bg-black/80 transition-colors"
                            aria-label="Edit image"
                            title="Edit with AI"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handleDownload}
                            className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors"
                            aria-label="Download image"
                            title="Download image"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                  )}

                  {isBotGeneratedVideo && (
                      <div className="relative group mb-2 max-w-xs">
                           {videoSrc ? (
                              <>
                                  <video 
                                      src={videoSrc}
                                      controls 
                                      autoPlay 
                                      muted 
                                      loop
                                      className="rounded-lg w-full"
                                  />
                                  <DhozziLogo className="absolute bottom-2 right-2 w-8 h-8 opacity-70 pointer-events-none" />
                              </>
                           ) : (
                              <div className="rounded-lg w-full h-48 bg-gray-600/50 flex flex-col items-center justify-center">
                                  <VeoIcon className="w-12 h-12 text-gray-500 animate-pulse" />
                                  <p className="text-xs text-gray-400 mt-2">Preparing video for playback...</p>
                              </div>
                           )}
                          <button 
                              onClick={handleDownload}
                              disabled={!videoBlob}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Download video"
                              title="Download video"
                          >
                              <DownloadIcon className="w-4 h-4" />
                          </button>
                      </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <div className="prose prose-invert prose-sm max-w-none flex-1">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                    {!isUser && message.text && (
                      <button 
                        onClick={() => onTtsToggle(message.id, message.text)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label={speakingMessageId === message.id ? 'Stop speaking' : 'Read message aloud'}
                        title={speakingMessageId === message.id ? 'Stop speaking' : 'Read message aloud'}
                      >
                        {speakingMessageId === message.id ? <StopCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                      </button>
                    )}
                  </div>


                  {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                           {message.sources.some(s => s.web) && (
                              <div>
                                 <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2">
                                    <GlobeIcon className="w-3 h-3" />
                                    Sources
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {message.sources.map((source, index) => (
                                        source.web && (
                                            <a
                                                key={`web-${index}`}
                                                href={source.web.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors truncate max-w-[200px] block"
                                                title={source.web.title}
                                            >
                                                <span className="font-semibold">{index + 1}.</span> {source.web.title || source.web.uri}
                                            </a>
                                        )
                                    ))}
                                </div>
                              </div>
                           )}
                           {message.sources.some(s => s.maps) && (
                              <div>
                                 <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2">
                                    <MapPinIcon className="w-3 h-3" />
                                    Locations
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {message.sources.map((source, index) => (
                                        source.maps && (
                                            <a
                                                key={`map-${index}`}
                                                href={source.maps.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors truncate max-w-[200px] block"
                                                title={source.maps.title}
                                            >
                                               <MapPinIcon className="w-3 h-3 inline-block mr-1" /> {source.maps.title || "View on Map"}
                                            </a>
                                        )
                                    ))}
                                </div>
                              </div>
                           )}
                      </div>
                  )}
              </>
          )}
        </div>

        {isUser && (
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-300" />
          </div>
        )}
      </div>

      {isBotGeneratedImage && (
        <Suspense fallback={<></>}>
            <ImageEditorModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSaveEdit}
                baseImage={{
                    base64: message.image!,
                    mimeType: message.imageMimeType || 'image/jpeg'
                }}
                plan={plan}
            />
        </Suspense>
      )}
    </>
  );
};

export default React.memo(ChatMessage);
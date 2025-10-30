import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Plan, ModelType } from '../types';
import { generateText, generateImage, generateVideo } from '../services/geminiService';
import { PaperAirplaneIcon, PaperClipIcon, XCircleIcon, PhoneIcon, VideoCameraIcon } from './Icons';
import { getModelCategory } from '../models/modelData';
import { fileToBase64 } from '../utils/fileUtils';

import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import LoadingResponse from './LoadingResponse';
import ModelSwitcher from './ModelSwitcher';
import ModelSuggestionMessage from './ModelSuggestionMessage';

const simpleUUID = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

interface ChatInterfaceProps {
    plan: Plan;
    onStartLiveCall: (type: 'audio' | 'video') => void;
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
    messages: Message[];
    setMessages: (updater: ((prevMessages: Message[]) => Message[]) | Message[]) => void;
    speakingMessageId: string | null;
    onTtsToggle: (messageId: string, text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    plan,
    onStartLiveCall,
    selectedModel,
    onModelChange,
    messages,
    setMessages,
    speakingMessageId,
    onTtsToggle
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [suggestedModel, setSuggestedModel] = useState<ModelType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAttachedFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const removeAttachment = () => {
        setAttachedFile(null);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = useCallback(async (promptOverride?: string) => {
        const textToSend = promptOverride || inputValue;
        if (!textToSend.trim() && !attachedFile) return;

        setIsSending(true);
        setSuggestedModel(null);
        
        const userMessage: Message = {
            id: simpleUUID(),
            text: textToSend,
            sender: 'user',
        };

        if (attachedFile) {
            const base64 = await fileToBase64(attachedFile);
            if (attachedFile.type.startsWith('image/')) {
                userMessage.image = base64;
                userMessage.imageMimeType = attachedFile.type;
            } else if (attachedFile.type.startsWith('video/')) {
                userMessage.uploadedVideo = { base64, mimeType: attachedFile.type };
            } else if (attachedFile.type.startsWith('audio/')) {
                userMessage.uploadedAudio = { base64, mimeType: attachedFile.type };
            }
        }

        const botMessageId = simpleUUID();
        const botPlaceholder: Message = {
            id: botMessageId,
            text: '',
            sender: 'bot',
            image: getModelCategory(selectedModel) === 'Image Creation' ? 'loading' : undefined,
            video: getModelCategory(selectedModel) === 'Video Generation' ? 'loading' : undefined,
        };

        setMessages(prev => [...prev, userMessage, botPlaceholder]);
        setInputValue('');
        removeAttachment();

        try {
            const category = getModelCategory(selectedModel);
            let result: any;

            if (category === 'Image Creation') {
                result = await generateImage(textToSend);
                setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, sender: 'bot', text: result.error ? '' : `Here is your generated image for: "${textToSend}"`, image: result.image, isError: !!result.error } : m));
            } else if (category === 'Video Generation') {
                const imageAttachment = (attachedFile && attachedFile.type.startsWith('image/')) ? { base64: await fileToBase64(attachedFile), mimeType: attachedFile.type } : undefined;
                result = await generateVideo(textToSend, imageAttachment);
                 setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, sender: 'bot', text: result.error ? '' : `Here is your generated video for: "${textToSend}"`, video: result.videoUrl, isError: !!result.error } : m));
            } else {
                 const imageAttachment = (attachedFile && attachedFile.type.startsWith('image/')) ? { base64: await fileToBase64(attachedFile), mimeType: attachedFile.type } : undefined;
                result = await generateText(textToSend, selectedModel, messages, imageAttachment);
                 setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, sender: 'bot', text: result.text || result.error, sources: result.sources, isError: !!result.error } : m));
            }
            if(result.error) throw new Error(result.error);

        } catch (error: any) {
             setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: `Error: ${error.message}`, isError: true, image: undefined, video: undefined } : m));
        } finally {
            setIsSending(false);
        }
    }, [inputValue, attachedFile, selectedModel, messages, setMessages]);
    
    const handleRetry = (messageId: string) => {
        const messageToRetry = messages.find(m => m.id === messageId);
        const userMessage = messages[messages.findIndex(m => m.id === messageId) - 1];
        if (messageToRetry && userMessage) {
            setMessages(prev => prev.filter(m => m.id !== messageId));
            // A bit of a hack to resend.
            setInputValue(userMessage.text);
            // This is complex with attachments, for now just resend text.
            setTimeout(() => handleSend(userMessage.text), 100);
        }
    };

    const handlePromptClick = (prompt: string) => {
        setInputValue(prompt);
        // Heuristic to suggest a model based on prompt
        if (prompt.toLowerCase().includes('image of')) {
            setSuggestedModel('imagen-4.0-generate-001');
        } else if (prompt.toLowerCase().includes('python script')) {
            setSuggestedModel('dhozzi-code');
        } else {
            handleSend(prompt);
        }
    };
    
    return (
        <div className="flex-1 flex flex-col bg-gray-800/50 min-w-0 h-full">
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
                <ModelSwitcher selectedModel={selectedModel} onModelChange={onModelChange} plan={plan} />
                <div className="flex items-center gap-2">
                    <button onClick={() => onStartLiveCall('audio')} className="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors" title="Start Audio Call"><PhoneIcon className="w-5 h-5"/></button>
                    <button onClick={() => onStartLiveCall('video')} className="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors" title="Start Video Call"><VideoCameraIcon className="w-5 h-5"/></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && !isSending ? (
                     <WelcomeScreen onPromptClick={handlePromptClick} />
                ) : (
                    <div className="max-w-4xl mx-auto w-full">
                        {messages.map(msg => (
                           <ChatMessage 
                                key={msg.id} 
                                message={msg}
                                onRetry={handleRetry}
                                plan={plan}
                                onUpdateMessage={(messageId, content) => setMessages(prev => prev.map(m => m.id === messageId ? {...m, ...content} : m))}
                                speakingMessageId={speakingMessageId}
                                onTtsToggle={onTtsToggle}
                           />
                        ))}
                        {isSending && <LoadingResponse />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    {suggestedModel && (
                        <ModelSuggestionMessage 
                            recommendedModelId={suggestedModel}
                            onAccept={() => { onModelChange(suggestedModel); handleSend(); }}
                            onDecline={() => handleSend()}
                        />
                    )}
                    <div className="relative">
                        {filePreview && (
                             <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg">
                                <div className="relative group">
                                    {attachedFile?.type.startsWith('image/') ? (
                                        <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-20 h-20 flex flex-col items-center justify-center text-center p-1 bg-gray-700 rounded-md">
                                            <PaperClipIcon className="w-6 h-6 text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-400 truncate">{attachedFile?.name}</p>
                                        </div>
                                    )}
                                    <button onClick={removeAttachment} className="absolute -top-1.5 -right-1.5 bg-gray-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <textarea
                            rows={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a message or drop a file..."
                            className="w-full bg-gray-700/50 border border-white/20 rounded-xl p-4 pr-28 resize-none focus:outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent] transition-colors"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Attach file">
                                <PaperClipIcon className="w-6 h-6" />
                            </button>
                            <button onClick={() => handleSend()} disabled={isSending || (!inputValue.trim() && !attachedFile)} className="p-2 bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] text-white rounded-full transition-opacity disabled:opacity-50">
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatInterface;
import React, { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import { Plan, ModelType, HistoryItem, Message, AIVoice, DhozziUser } from './types';
import { applyTheme } from './utils/theme';
import { getAvailableModels } from './models/modelData';
import { generateSpeech } from './services/geminiService';
import { decode as decodeAudio, decodeAudioData } from './utils/audioUtils';
import * as auth from './utils/auth';
// FIX: Import simpleUUID to generate unique IDs for new chats.
import { simpleUUID } from './utils/helpers';

// Lazy load components
const SuspenseLoader = lazy(() => import('./components/SuspenseLoader'));
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const ChatInterface = lazy(() => import('./components/ChatInterface'));
const LiveCallView = lazy(() => import('./components/LiveCallView'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const PricingPlans = lazy(() => import('./components/PricingPlans'));
const DhozziGroupModal = lazy(() => import('./components/DhozziGroupModal'));
const Footer = lazy(() => import('./components/Footer'));


type AppState = 'app' | 'live-call' | 'plans';

const App: React.FC = () => {
    const [dhozziUser, setDhozziUser] = useState<DhozziUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-2.5-flash');
    const [appState, setAppState] = useState<AppState>('app');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDhozziGroupModalOpen, setIsDhozziGroupModalOpen] = useState(false);

    const [aiVoice] = useState<AIVoice>('Zephyr');
    const [callType, setCallType] = useState<'audio' | 'video'>('audio');
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    const plan = dhozziUser?.plan || 'basic';

    const handleLoginSuccess = useCallback(async (user: DhozziUser) => {
        const { user: updatedUser, needsUpdate } = auth.handleDailyLogin(user);
        if (needsUpdate) {
            await auth.updateDhozziUser(user.uid, updatedUser);
            setDhozziUser(updatedUser);
        } else {
            setDhozziUser(user);
        }
    }, []);

    useEffect(() => {
        const checkCurrentUser = async () => {
            const user = await auth.getCurrentUser();
            if (user) {
                await handleLoginSuccess(user);
            }
            setIsLoading(false);
        };
        checkCurrentUser();
    }, [handleLoginSuccess]);

    const saveHistory = useCallback((newHistory: HistoryItem[]) => {
        if (dhozziUser) {
            localStorage.setItem(`dhozzi_history_${dhozziUser.uid}`, JSON.stringify(newHistory));
        }
    }, [dhozziUser]);

    const handleNewChat = useCallback(async () => {
        const newChatId = simpleUUID();
        const newChatItem: HistoryItem = {
            id: newChatId, name: "New Chat", type: 'chat', messages: [],
            model: 'gemini-2.5-flash', date: new Date().toISOString()
        };
        const newHistory = [newChatItem, ...history];
        setHistory(newHistory);
        saveHistory(newHistory);
        setActiveChatId(newChatId);
    }, [history, saveHistory]);

    useEffect(() => {
        if (dhozziUser) {
            try {
                const storedHistory = localStorage.getItem(`dhozzi_history_${dhozziUser.uid}`);
                const parsedHistory: HistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];
                
                // Sort by date descending
                parsedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setHistory(parsedHistory);
                if (!activeChatId && parsedHistory.length > 0) {
                    setActiveChatId(parsedHistory[0].id);
                } else if (parsedHistory.length === 0) {
                    // If user has no chats, create one
                    handleNewChat();
                }
            } catch (error) {
                console.error("Failed to load or parse chat history:", error);
                setHistory([]);
            }
        } else {
            setHistory([]);
            setActiveChatId(null);
        }
    }, [dhozziUser, activeChatId, handleNewChat]);


    useEffect(() => {
        applyTheme(plan);
    }, [plan]);

    const handleLogout = async () => {
        await auth.signOutUser();
        setDhozziUser(null);
    };
    
    const handleUpdateUser = async (updatedUser: DhozziUser) => {
       if (!dhozziUser) return;
       await auth.updateDhozziUser(dhozziUser.uid, updatedUser);
       setDhozziUser(updatedUser);
    }

    const handleModelChange = async (model: ModelType) => {
        setSelectedModel(model);
        if (activeChatId) {
            const newHistory = history.map(item => 
                item.id === activeChatId ? { ...item, model } : item
            );
            setHistory(newHistory);
            saveHistory(newHistory);
        }
    };
    
    const handleRenameItem = async (itemId: string, newName: string) => {
        const newHistory = history.map(item => 
            item.id === itemId ? { ...item, name: newName } : item
        );
        setHistory(newHistory);
        saveHistory(newHistory);
    };
    
    const handleDeleteItem = async (itemToDelete: HistoryItem) => {
        const newHistory = history.filter(item => item.id !== itemToDelete.id);
        setHistory(newHistory);
        saveHistory(newHistory);
        
        if(activeChatId === itemToDelete.id) {
            setActiveChatId(newHistory.length > 0 ? newHistory[0].id : null);
        }
    };

    const activeChat = history.find(item => item.id === activeChatId && item.type === 'chat');

    const setMessagesForActiveChat = async (updater: ((prevMessages: Message[]) => Message[]) | Message[]) => {
        const newMessages = typeof updater === 'function' 
            ? updater(activeChat?.messages || []) 
            : updater;
        
        const newHistory = history.map(item => 
            item.id === activeChatId ? { ...item, messages: newMessages } : item
        );
        setHistory(newHistory);
        saveHistory(newHistory);
    };
    
    const handleStartLiveCall = (type: 'audio' | 'video') => {
        setCallType(type);
        setAppState('live-call');
    };
    
    const handleTtsToggle = useCallback(async (messageId: string, text: string) => {
        if (speakingMessageId === messageId) {
            audioSourceRef.current?.stop();
            audioSourceRef.current = null;
            setSpeakingMessageId(null);
            return;
        }

        setSpeakingMessageId(messageId);
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const result = await generateSpeech(text, aiVoice);
        if (result.audioBase64 && audioContextRef.current) {
            const audioBuffer = await decodeAudioData(decodeAudio(result.audioBase64), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            audioSourceRef.current = source;
            source.onended = () => {
                setSpeakingMessageId(null);
                audioSourceRef.current = null;
            };
        } else {
            setSpeakingMessageId(null);
        }
    }, [speakingMessageId, aiVoice]);

    const renderContent = () => {
        if (isLoading) return <SuspenseLoader />;
        if (!dhozziUser) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
        
        if (appState === 'live-call') return <LiveCallView plan={plan} onClose={() => setAppState('app')} aiVoice={aiVoice} callType={callType} />;
        if (appState === 'plans') return <PricingPlans user={dhozziUser} onUpdateUser={handleUpdateUser} onClose={() => setAppState('app')} />;
        
        const availableModels = getAvailableModels(plan);
        const currentModel = activeChat?.model || selectedModel;
        const modelToUse = availableModels.some(m => m.id === currentModel) ? currentModel : availableModels[0].id;
        
        return (
            <div className="flex h-full w-full pb-16">
                {isSidebarOpen && (
                    <Sidebar 
                        history={history}
                        activeChatId={activeChatId}
                        onChatSelect={setActiveChatId}
                        onToggle={() => setIsSidebarOpen(false)}
                        plan={plan}
                        selectedModel={modelToUse}
                        onModelChange={handleModelChange}
                        onNewChat={handleNewChat}
                        onRenameItem={handleRenameItem}
                        onDeleteItem={handleDeleteItem}
                        user={dhozziUser}
                        onLogout={handleLogout}
                        onSettingsClick={() => setIsSettingsOpen(true)}
                    />
                )}
                <main className="flex-1 flex flex-col min-w-0">
                   <ChatInterface 
                        plan={plan}
                        onStartLiveCall={handleStartLiveCall}
                        selectedModel={modelToUse}
                        onModelChange={handleModelChange}
                        messages={activeChat?.messages || []}
                        setMessages={setMessagesForActiveChat}
                        speakingMessageId={speakingMessageId}
                        onTtsToggle={handleTtsToggle}
                   />
                </main>
            </div>
        );
    }

    return (
        <Suspense fallback={<SuspenseLoader />}>
            <div className="h-full w-full relative">
                {renderContent()}
                <Footer onDhozziGroupClick={() => setIsDhozziGroupModalOpen(true)} />
            </div>
            {dhozziUser && (
                 <SettingsModal 
                    isOpen={isSettingsOpen} 
                    onClose={() => setIsSettingsOpen(false)}
                    onLogout={handleLogout}
                    onManagePlan={() => { setIsSettingsOpen(false); setAppState('plans'); }}
                 />
            )}
             {isDhozziGroupModalOpen && (
                <DhozziGroupModal onClose={() => setIsDhozziGroupModalOpen(false)} />
             )}
        </Suspense>
    );
};

export default App;
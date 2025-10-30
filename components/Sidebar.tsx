import React, { useState, useRef, useEffect } from 'react';
import { DhozziLogo, PlusIcon, FolderIcon, MessageSquareIcon, ChevronDownIcon, ChevronLeftIcon, MoreHorizontalIcon, LogOutIcon, SettingsIcon, StarIcon } from './Icons';
import { HistoryItem, ModelType, Plan, DhozziUser } from '../types';
import ModelSwitcher from './ModelSwitcher';
import ConfirmationModal from './ConfirmationModal';

interface UserStatusProps {
    user: DhozziUser;
    onLogout: () => void;
    onSettingsClick: () => void;
}

const UserStatus: React.FC<UserStatusProps> = ({ user, onLogout, onSettingsClick }) => {
    return (
        <div className="-mx-4 p-4 border-t border-white/10 bg-black/20">
            <div className='flex items-center justify-between'>
                <p className="font-semibold text-white truncate" title={user.email}>{user.email}</p>
                <div className='flex items-center gap-1'>
                    <button onClick={onSettingsClick} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10" title="Settings"><SettingsIcon className="w-4 h-4" /></button>
                    <button onClick={onLogout} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10" title="Logout"><LogOutIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                <div className="flex items-center gap-2" title="KrunX Balance">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="font-mono">{user.krxBalance.toLocaleString()} KRX</span>
                </div>
                 <div className="flex items-center gap-2" title={`${user.streak}-day streak`}>
                    <span className="font-mono">{user.streak}🔥</span>
                </div>
            </div>
        </div>
    );
};


interface SidebarProps {
    history: HistoryItem[];
    activeChatId: string | null;
    onChatSelect: (id: string) => void;
    onToggle: () => void;
    plan: Plan;
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
    onNewChat: () => void;
    onRenameItem: (itemId: string, newName: string) => void;
    onDeleteItem: (item: HistoryItem) => void;
    user: DhozziUser;
    onLogout: () => void;
    onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, activeChatId, onChatSelect, onToggle, plan, selectedModel, onModelChange, onNewChat, onRenameItem, onDeleteItem, user, onLogout, onSettingsClick }) => {
    const [internalHistory, setInternalHistory] = useState<HistoryItem[]>(history);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [deletingItem, setDeletingItem] = useState<HistoryItem | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInternalHistory(history);
    }, [history]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (renamingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [renamingId]);

    const toggleFolder = (folderId: string) => {
        setInternalHistory(prevHistory => 
            prevHistory.map(item => 
                item.id === folderId && item.type === 'folder' 
                    ? { ...item, isOpen: !item.isOpen } 
                    : item
            )
        );
    };

    const handleRenameSubmit = () => {
        if (renamingId && renameValue.trim()) {
            onRenameItem(renamingId, renameValue.trim());
        }
        setRenamingId(null);
    };
    
    const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setRenamingId(null);
        }
    };

    const handleDeleteConfirm = () => {
        if (deletingItem) {
            onDeleteItem(deletingItem);
            setDeletingItem(null);
        }
    };
    
    const renderHistoryList = (items: HistoryItem[], level = 0) => {
        return items.map(item => {
            if (item.type === 'folder') {
                return (
                    <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
                        <div className="relative group">
                            <button onClick={() => toggleFolder(item.id)} className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-white/10 text-gray-300">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <FolderIcon className="w-4 h-4" />
                                    {item.name}
                                </span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Folder actions can be added here if needed */}
                        </div>
                        {item.isOpen && (
                            <div className="mt-1 space-y-1">
                                {renderHistoryList(item.items || [], level + 1)}
                            </div>
                        )}
                    </div>
                );
            }
            
            return (
                 <div key={item.id} className="relative group" style={{ paddingLeft: `${level * 16}px` }}>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onChatSelect(item.id); }}
                        className={`flex items-center gap-2 p-2 pr-8 rounded-md text-sm truncate transition-colors w-full ${activeChatId === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <MessageSquareIcon className="w-4 h-4 flex-shrink-0" />
                        {renamingId === item.id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={handleRenameSubmit}
                                onKeyDown={handleRenameKeyDown}
                                className="bg-gray-900 text-white w-full focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="truncate">{item.name}</span>
                        )}
                    </a>
                    <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(item.id === openMenuId ? null : item.id); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label="More options"
                    >
                        <MoreHorizontalIcon className="w-4 h-4"/>
                    </button>

                    {openMenuId === item.id && (
                        <div ref={menuRef} className="absolute z-10 top-8 right-2 w-40 bg-gray-800 border border-white/20 rounded-lg shadow-2xl py-1.5 animate-fade-in-fast">
                            <button onClick={() => { setRenamingId(item.id); setRenameValue(item.name); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10">
                                Rename
                            </button>
                            <button onClick={() => { setDeletingItem(item); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20">
                                Delete
                            </button>
                             {/* Add "Move to folder" later */}
                        </div>
                    )}
                 </div>
            )
        });
    };
    
    return (
        <div className="w-72 bg-gray-900/80 backdrop-blur-md border-r border-white/10 flex flex-col p-4 animate-slide-in-left md:animate-fade-in-fast md:bg-black/30 md:backdrop-blur-none fixed inset-y-0 left-0 z-40 md:relative md:inset-auto md:z-auto md:flex-shrink-0">
            <div className="flex items-center justify-between gap-2 mb-6">
                 <div className="flex items-center gap-2">
                    <DhozziLogo className="w-8 h-8 text-white" />
                    <h1 className="text-xl font-bold">Dhozzi</h1>
                </div>
                <button 
                    onClick={onToggle}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Hide sidebar"
                    title="Hide sidebar"
                    >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            </div>
            <button
                onClick={onNewChat}
                className="flex items-center justify-center gap-2 w-full p-2.5 mb-4 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                <PlusIcon className="w-4 h-4" />
                New Chat
            </button>

            <div className="mb-4">
                <ModelSwitcher
                    selectedModel={selectedModel}
                    onModelChange={onModelChange}
                    plan={plan}
                    isSidebar={true}
                />
            </div>

            <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                <nav className="space-y-1">
                    {renderHistoryList(internalHistory)}
                </nav>
            </div>
            
            <UserStatus user={user} onLogout={onLogout} onSettingsClick={onSettingsClick} />

             <ConfirmationModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${deletingItem?.type === 'folder' ? 'Folder' : 'Chat'}`}
            >
                Are you sure you want to delete "{deletingItem?.name}"? 
                {deletingItem?.type === 'folder' && ' All chats within this folder will also be removed.'}
                <br />
                This action cannot be undone.
            </ConfirmationModal>
        </div>
    );
};

export default Sidebar;
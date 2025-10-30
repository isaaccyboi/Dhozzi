import React from 'react';
import { XIcon, LogOutIcon, StarIcon } from './Icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onManagePlan: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onLogout, onManagePlan }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-fast" 
            onClick={onClose}
        >
            <div 
                className="w-full max-w-md bg-gray-800/80 border border-white/20 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <button
                        onClick={onManagePlan}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <div>
                            <p className="font-semibold text-white">Manage Plan</p>
                            <p className="text-sm text-gray-400">View your KRX balance and activate plans.</p>
                        </div>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <LogOutIcon className="w-5 h-5 text-red-400" />
                        <div>
                            <p className="font-semibold text-red-400">Logout</p>
                            <p className="text-sm text-gray-400">Switch to another local profile.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XIcon, SparklesIcon } from './Icons';
import { Plan } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import LoadingResponse from './LoadingResponse';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64: string) => void;
  baseImage: { base64: string; mimeType: string };
  plan: Plan;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, onSave, baseImage, plan }) => {
    const [prompt, setPrompt] = useState('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const originalImageSrc = `data:${baseImage.mimeType};base64,${baseImage.base64}`;
    const editedImageSrc = editedImage ? `data:image/jpeg;base64,${editedImage}` : null;

    useEffect(() => {
        if (!isOpen) {
            // Reset state on close
            setPrompt('');
            setEditedImage(null);
            setIsLoading(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        const result = await editImageWithPrompt(baseImage.base64, baseImage.mimeType, prompt);

        if (result.image) {
            setEditedImage(result.image);
        } else {
            setError(result.error || 'Failed to generate image.');
        }
        setIsLoading(false);
    };

    const handleSave = () => {
        if (editedImage) {
            onSave(editedImage);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div 
                className="w-full max-w-4xl h-[90vh] bg-gray-800/80 border border-white/20 rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-cyan-400"/>
                        Edit with AI
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex flex-1 min-h-0">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20">
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Original</h3>
                            <div className="w-full h-full max-h-[calc(80vh-200px)] rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
                                <img src={originalImageSrc} alt="Original" className="max-w-full max-h-full object-contain" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                             <h3 className="text-sm font-semibold text-gray-400 mb-2">Result</h3>
                            <div className="w-full h-full max-h-[calc(80vh-200px)] rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
                                {isLoading && <div className="w-full h-full bg-gray-700/50 animate-pulse flex items-center justify-center"><SparklesIcon className="w-10 h-10 text-gray-500"/></div>}
                                {error && <div className="p-4 text-center text-red-400">{error}</div>}
                                {editedImageSrc && <img src={editedImageSrc} alt="Edited" className="max-w-full max-h-full object-contain" />}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-3">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., Add a retro filter, make the sky blue..."
                            className="flex-1 bg-gray-700/50 border border-white/20 rounded-lg p-3 focus:outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent] transition-colors"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-white/10 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={!editedImage} className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[--color-primary-start] to-[--color-primary-end] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;
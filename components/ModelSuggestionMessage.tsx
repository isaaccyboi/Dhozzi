import React from 'react';
import { ModelType } from '../types';
import { allModels } from '../models/modelData';
import { LightbulbIcon, CheckIcon, XIcon } from './Icons';

interface ModelSuggestionMessageProps {
    recommendedModelId: ModelType;
    onAccept: () => void;
    onDecline: () => void;
}

const ModelSuggestionMessage: React.FC<ModelSuggestionMessageProps> = ({ recommendedModelId, onAccept, onDecline }) => {
    const modelInfo = allModels.find(m => m.id === recommendedModelId);

    if (!modelInfo) return null;

    return (
        <div className="p-4 mb-4 bg-gray-800/50 border border-white/20 rounded-lg animate-fade-in text-sm">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-full mt-1 flex-shrink-0">
                    <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-white">Model Suggestion</h4>
                    <p className="text-gray-300 mt-1">
                        For this task, the <span className="font-semibold text-white">{modelInfo.name}</span> model might give you better results.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button 
                            onClick={onAccept}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-[--color-accent] text-white rounded-md hover:opacity-90 transition-opacity"
                        >
                            <CheckIcon className="w-4 h-4" />
                            Switch to {modelInfo.name}
                        </button>
                         <button 
                            onClick={onDecline}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-white/10 text-gray-200 rounded-md hover:bg-white/20 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                            No, Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelSuggestionMessage;
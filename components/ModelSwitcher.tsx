import React, { useState, useRef, useEffect } from 'react';
import { ModelType, Plan } from '../types';
import { getAvailableModels, ModelDefinition } from '../models/modelData';
import { ChevronDownIcon } from './Icons';

interface ModelSwitcherProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  plan: Plan;
  isSidebar?: boolean;
}

const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ selectedModel, onModelChange, plan, isSidebar = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const availableModels = getAvailableModels(plan);
  const selectedOption = availableModels.find(opt => opt.id === selectedModel) || availableModels[0];

  const groupedModels = availableModels.reduce((acc: Record<string, ModelDefinition[]>, model) => {
    if (!acc[model.category]) {
      acc[model.category] = [];
    }
    acc[model.category].push(model);
    return acc;
  }, {});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  useEffect(() => {
    if (!availableModels.some(m => m.id === selectedModel)) {
      onModelChange(availableModels[0].id);
    }
  }, [plan, availableModels, selectedModel, onModelChange]);


  const handleSelect = (model: ModelType) => {
    onModelChange(model);
    setIsOpen(false);
  }

  const buttonClasses = isSidebar
    ? "flex items-center justify-between w-full gap-2 pl-3 pr-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent focus:border-white/20 focus:outline-none transition-colors"
    : "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent focus:border-white/20 focus:outline-none transition-colors";

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className="flex items-center gap-3 truncate">
          <span className="flex-shrink-0">{selectedOption.icon}</span>
          <span className="font-semibold text-white truncate">{selectedOption.name}</span>
        </span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-72 bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl z-10 overflow-hidden ${isSidebar ? 'left-0' : 'right-0'}`}>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {Object.entries(groupedModels).map(([category, models]) => (
              <div key={category} className="mb-2">
                <h3 className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</h3>
                <ul>
                  {models.map(option => (
                    <li key={option.id}>
                      <button
                        onClick={() => handleSelect(option.id)}
                        className={`w-full flex items-start gap-3 p-2 text-left rounded-md transition-colors ${
                          selectedModel === option.id 
                          ? 'bg-cyan-500/20' 
                          : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="mt-0.5">{option.icon}</span>
                        <div>
                           <p className={`font-medium ${selectedModel === option.id ? 'text-cyan-300' : 'text-gray-200'}`}>{option.name}</p>
                           <p className="text-xs text-gray-400">{option.description}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;
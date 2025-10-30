import React from 'react';
// FIX: Corrected import from ImageIcon to ImagenIcon
import { DhozziLogo, LightbulbIcon, CodeIcon, ImagenIcon, GlobeIcon } from './Icons';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const examplePrompts = [
    {
        icon: <LightbulbIcon className="w-5 h-5 text-yellow-400" />,
        title: "Explain something",
        prompt: "Explain quantum computing in simple terms"
    },
    {
        icon: <CodeIcon className="w-5 h-5 text-cyan-400" />,
        title: "Write some code",
        prompt: "Write a python script to sort a list of numbers"
    },
    {
        // FIX: Corrected component from ImageIcon to ImagenIcon
        icon: <ImagenIcon className="w-5 h-5 text-fuchsia-400" />,
        title: "Create an image",
        prompt: "A photorealistic image of a cat wearing sunglasses on a beach"
    },
    {
        icon: <GlobeIcon className="w-5 h-5 text-green-400" />,
        title: "Find current info",
        prompt: "What's the weather like in London today?"
    }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] rounded-full blur-2xl opacity-50 animate-subtle-glow"></div>
        <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white/20">
          <DhozziLogo className="w-16 h-16 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">How can I help you today?</h1>

      <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {examplePrompts.map((item, index) => (
            <button 
              key={index}
              onClick={() => onPromptClick(item.prompt)}
              className="bg-gray-800/50 p-4 rounded-lg border border-transparent hover:border-white/20 transition-all text-left flex flex-col items-start hover:bg-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <h3 className="font-semibold text-gray-200">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-400">{item.prompt}</p>
            </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;

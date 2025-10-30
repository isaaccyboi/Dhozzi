import React from 'react';
import { XIcon, DhozziLogo, GalaIcon, CassiIcon, MicpocIcon, BookOpenIcon, DhollaPayIcon } from './Icons';

interface DhozziGroupModalProps {
    onClose: () => void;
}

const companies = [
    {
        name: 'Dhozzi AI',
        icon: <DhozziLogo className="h-10 w-10 text-white" />,
        description: "Australia and New Zealand's friendly AI engine for chat, creativity, and more.",
        url: 'https://dhozzi-773017360974.us-west1.run.app'
    },
    {
        name: 'Cassi',
        icon: <CassiIcon className="h-12 w-auto" />,
        description: "Your personal AI companion for fashion, style advice, and virtual try-ons.",
        url: 'https://cassi-773017360974.us-west1.run.app'
    },
    {
        name: 'MICPOC',
        icon: <MicpocIcon className="h-6 w-auto" />,
        description: "A vibrant platform for discovering and sharing micro-podcasts and audio stories.",
        url: 'https://micpoc-773017360974.us-west1.run.app'
    },
    {
        name: 'Gala',
        icon: <GalaIcon className="h-8 w-auto" />,
        description: "An AI-powered event planning assistant to make your gatherings unforgettable.",
        url: 'https://gala-773017360974.us-west1.run.app'
    },
    {
        name: 'DhollaPay',
        icon: <DhollaPayIcon className="h-10 w-10" />,
        description: "Secure and seamless digital payments, powered by the KrunX Dhozzi currency.",
        url: 'https://dhollapay-773017360974.us-west1.run.app'
    },
    {
        name: 'Biblicai',
        icon: <BookOpenIcon className="h-10 w-10 text-white" />,
        description: "Explore and chat with the King James Bible for insights and study.",
        url: 'https://biblicai-773017360974.us-west1.run.app'
    }
];

const DhozziGroupModal: React.FC<DhozziGroupModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-fast" 
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl bg-gray-800/80 border border-white/20 rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                       <DhozziLogo className="w-6 h-6" />
                       The Dhozzi Group
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <p className="text-center text-gray-300 mb-8">A family of innovative digital experiences, built on a foundation of cutting-edge AI.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {companies.map(company => (
                             <a 
                                key={company.name} 
                                href={company.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-gray-900/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                             >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                  {company.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{company.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{company.description}</p>
                                </div>
                             </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DhozziGroupModal;
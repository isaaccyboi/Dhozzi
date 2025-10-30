import React from 'react';
import { DhozziLogo } from './Icons';

interface FooterProps {
    onDhozziGroupClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onDhozziGroupClick }) => {
    return (
        <footer className="absolute bottom-0 left-0 right-0 p-4 flex justify-center z-10">
            <button
                onClick={onDhozziGroupClick}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full hover:text-white hover:bg-black/50 transition-colors"
                title="Learn more about the Dhozzi Group"
            >
                <DhozziLogo className="w-5 h-5" />
                <span>The Dhozzi Group</span>
            </button>
        </footer>
    );
};

export default Footer;
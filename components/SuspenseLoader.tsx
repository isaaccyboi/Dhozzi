
import React, { useState, useEffect } from 'react';
import { DhozziLogo } from './Icons';

const loadingMessages = [
  "Initializing Dhozzi...",
  "Connecting securely...",
  "Waking up the AI...",
  "Syncing your chats...",
  "Almost there...",
];

const SuspenseLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
      <div className="relative w-24 h-24 mb-6">
          {/* Sonar wave effect for activity */}
          <div className="animate-sonar-wave" />
          <div className="animate-sonar-wave" style={{ animationDelay: '1s' }} />
          
          {/* Pulsing logo container */}
          <div className="relative w-full h-full bg-gray-800 rounded-full flex items-center justify-center border-2 border-white/20 animate-breathing">
            <DhozziLogo className="w-16 h-16 text-white" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-300 tracking-wider">
          {loadingMessages[messageIndex]}
        </p>
    </div>
  );
};

export default SuspenseLoader;

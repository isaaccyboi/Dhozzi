

import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20"></div>
      <div 
        className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full blur-3xl opacity-30" 
        style={{ 
            backgroundImage: 'radial-gradient(ellipse at center, var(--glow-color-1) 0%, transparent 70%)',
            animation: 'pulse-slow 8s infinite alternate' 
        }}
      ></div>
      <div 
        className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-3xl opacity-40"
        style={{
            backgroundImage: 'radial-gradient(ellipse at center, var(--glow-color-2) 0%, transparent 70%)',
            animation: 'pulse-slow 12s infinite alternate-reverse' 
        }}
      ></div>
    </div>
  );
};

export default BackgroundEffects;
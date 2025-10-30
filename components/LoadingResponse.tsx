import React from 'react';
import { DhozziLogo } from './Icons';

const LoadingResponse: React.FC = () => {
  return (
    <div className="flex items-start gap-4 my-4">
      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] flex items-center justify-center">
        <DhozziLogo className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div className="max-w-xl w-full px-5 py-3 rounded-2xl bg-gray-700/50">
        <div className="space-y-2.5 animate-pulse">
            <div className="h-4 bg-gray-600/50 rounded-md w-3/4" style={{ filter: 'blur(1px)' }}></div>
            <div className="h-4 bg-gray-600/50 rounded-md w-full" style={{ filter: 'blur(1px)' }}></div>
            <div className="h-4 bg-gray-600/50 rounded-md w-5/6" style={{ filter: 'blur(1px)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingResponse;
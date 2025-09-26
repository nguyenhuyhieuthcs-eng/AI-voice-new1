
import React from 'react';
import TextIcon from './icons/TextIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
         <div className="p-3 bg-indigo-600/20 rounded-full border border-indigo-500/30">
            <TextIcon className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                AI Voice Suite
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Your complete solution for voice synthesis and recognition.
            </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

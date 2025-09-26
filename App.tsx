
import React, { useState, useCallback } from 'react';
import TextToSpeech from './components/TextToSpeech';
import SpeechToText from './components/SpeechToText';
import Header from './components/Header';
import TabButton from './components/TabButton';
import SoundIcon from './components/icons/SoundIcon';
import MicrophoneIcon from './components/icons/MicrophoneIcon';

enum ActiveTab {
  TTS = 'TTS',
  STT = 'STT',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TTS);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl">
        <Header />
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex border-b border-gray-700">
            <TabButton
              isActive={activeTab === ActiveTab.TTS}
              onClick={() => handleTabChange(ActiveTab.TTS)}
            >
              <SoundIcon className="w-5 h-5 mr-2" />
              Text-to-Speech
            </TabButton>
            <TabButton
              isActive={activeTab === ActiveTab.STT}
              onClick={() => handleTabChange(ActiveTab.STT)}
            >
              <MicrophoneIcon className="w-5 h-5 mr-2" />
              Speech-to-Text
            </TabButton>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === ActiveTab.TTS ? <TextToSpeech /> : <SpeechToText />}
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Voice Suite. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

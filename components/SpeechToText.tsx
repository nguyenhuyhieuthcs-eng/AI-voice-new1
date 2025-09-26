
import React, { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import MicrophoneIcon from './icons/MicrophoneIcon';
import StopIcon from './icons/StopIcon';

// A selection of common languages supported by Web Speech API
const supportedLanguages = [
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'fr-FR', name: 'Français (France)' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)' },
  { code: 'it-IT', name: 'Italiano (Italia)' },
  { code: 'ja-JP', name: '日本語 (日本)' },
  { code: 'ko-KR', name: '한국어 (대한민국)' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'ru-RU', name: 'Русский (Россия)' },
  { code: 'zh-CN', name: '中文 (中国大陆)' },
  { code: 'vi-VN', name: 'Tiếng Việt (Việt Nam)' },
];


const SpeechToText: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('en-US');
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();
  
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(selectedLang);
    }
  };

  if (!hasRecognitionSupport) {
    return (
      <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">
        <h3 className="font-bold text-lg">Unsupported Browser</h3>
        <p>Speech recognition is not supported by your browser. Please try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <label htmlFor="stt-language-select" className="block text-sm font-medium text-gray-300 mb-2 text-center">
          Spoken Language
        </label>
        <select
          id="stt-language-select"
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          disabled={isListening}
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="pt-4">
        <button
          onClick={handleToggleListening}
          className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50
            ${isListening 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400'}`}
        >
          {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
          {isListening ? (
            <StopIcon className="w-10 h-10 text-white" />
          ) : (
            <MicrophoneIcon className="w-10 h-10 text-white" />
          )}
        </button>
        <p className="text-center mt-4 text-gray-400 font-medium">
          {isListening ? 'Recording...' : 'Tap to start'}
        </p>
      </div>

      <div className="w-full pt-4">
        <label htmlFor="stt-transcript" className="block text-sm font-medium text-gray-300 mb-2">
          Transcript
        </label>
        <div
          id="stt-transcript"
          className="w-full p-4 min-h-[120px] bg-gray-900 border border-gray-600 rounded-lg"
        >
            {transcript ? transcript : <span className="text-gray-500">Your transcribed text will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;

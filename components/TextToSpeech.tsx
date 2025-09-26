import React, { useState, useMemo, useEffect } from 'react';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import PlayIcon from './icons/PlayIcon';
import StopIcon from './icons/StopIcon';
import DownloadIcon from './icons/DownloadIcon';

// Using a more reliable, public TTS API for downloads.
// Map language codes to supported voice names from the new service.
const SUPPORTED_DOWNLOAD_LANGS: Record<string, string> = {
  'en': 'Brian',    // English
  'es': 'Enrique',  // Spanish
  'fr': 'Mathieu',  // French
  'de': 'Hans',     // German
  'it': 'Giorgio',  // Italian
  'ja': 'Mizuki',   // Japanese
  'pt': 'Ricardo',  // Portuguese (Brazil)
  'ru': 'Maxim',    // Russian
  'ko': 'Seoyeon',  // Korean
  'zh': 'Zhiyu',    // Chinese (Mandarin)
  'pl': 'Jacek',    // Polish
  'nl': 'Ruben',    // Dutch
  'da': 'Mads',     // Danish
  'is': 'Karl',     // Icelandic
  'no': 'Liv',      // Norwegian
  'sv': 'Astrid',   // Swedish
  'tr': 'Filiz',    // Turkish
  'cy': 'Geraint',  // Welsh
};

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>("Hello, world! Welcome to the AI Voice Suite. Let's convert this text into natural speech.");
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const { voices, speak, cancel, speaking } = useSpeechSynthesis();

  const languages = useMemo(() => {
    return [...new Set(voices.map(voice => voice.lang))].sort();
  }, [voices]);

  const filteredVoices = useMemo(() => {
    return voices.filter(voice => voice.lang === selectedLang);
  }, [voices, selectedLang]);

  const langCode = useMemo(() => selectedLang.split('-')[0], [selectedLang]);
  const isDownloadable = useMemo(() => langCode in SUPPORTED_DOWNLOAD_LANGS, [langCode]);

  useEffect(() => {
    if (languages.length > 0 && !selectedLang) {
      const browserLang = navigator.language;
      if (languages.includes(browserLang)) {
        setSelectedLang(browserLang);
      } else {
        setSelectedLang(languages[0]);
      }
    }
  }, [languages, selectedLang]);

  useEffect(() => {
    if (filteredVoices.length > 0) {
      const defaultVoice = filteredVoices.find(v => v.default);
      setSelectedVoiceURI(defaultVoice ? defaultVoice.voiceURI : filteredVoices[0].voiceURI);
    }
  }, [filteredVoices]);

  useEffect(() => {
    if (selectedLang) {
      if (!isDownloadable) {
        setDownloadMessage("Download not available for the selected language.");
      } else {
        setDownloadMessage(null);
      }
    }
  }, [selectedLang, isDownloadable]);

  const handleSpeak = () => {
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      speak(text, selectedVoice);
    }
  };

  const handleDownload = async () => {
    if (!text || !isDownloadable) return;

    setIsDownloading(true);
    setDownloadMessage(null);
    try {
      const voice = SUPPORTED_DOWNLOAD_LANGS[langCode];
      const encodedText = encodeURIComponent(text);
      const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodedText}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = audioUrl;
      a.download = 'speech.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(audioUrl);

    } catch (error) {
      console.error("Audio generation failed:", error);
      setDownloadMessage("Audio generation failed. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadButtonTooltip = isDownloadable 
    ? "Download speech as MP3 file" 
    : `Download not supported for ${selectedLang}`;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="tts-text" className="block text-sm font-medium text-gray-300 mb-2">
          Text to Synthesize
        </label>
        <textarea
          id="tts-text"
          rows={5}
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language-select"
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={voices.length === 0}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-300 mb-2">
            Voice (for live preview)
          </label>
          <select
            id="voice-select"
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            disabled={filteredVoices.length === 0}
          >
            {filteredVoices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 px-2 -mt-2">
        Note: Downloaded audio may use a different voice from the live preview.
      </div>

      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          {speaking ? (
            <button
              onClick={cancel}
              className="flex items-center justify-center w-full sm:w-40 h-14 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <StopIcon className="w-6 h-6 mr-2" />
              Stop
            </button>
          ) : (
            <button
              onClick={handleSpeak}
              disabled={!text || !selectedVoiceURI || isDownloading}
              className="flex items-center justify-center w-full sm:w-40 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              <PlayIcon className="w-6 h-6 mr-2" />
              Speak
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={!text || speaking || isDownloading || !isDownloadable}
            className="flex items-center justify-center w-full sm:w-48 h-14 bg-green-600 hover:bg-green-700 disabled:bg-green-900/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
            aria-label={downloadButtonTooltip}
            title={downloadButtonTooltip}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <DownloadIcon className="w-6 h-6 mr-2" />
                <span>Download MP3</span>
              </>
            )}
          </button>
        </div>

        {downloadMessage && (
          <p className="text-center text-yellow-400 mt-4 text-sm">{downloadMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;

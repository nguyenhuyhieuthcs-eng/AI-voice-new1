
import { useState, useEffect, useCallback } from 'react';

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const synth = window.speechSynthesis;

  const populateVoiceList = useCallback(() => {
    const newVoices = synth.getVoices();
    setVoices(newVoices);
  }, [synth]);

  useEffect(() => {
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [populateVoiceList, synth]);

  const speak = useCallback((text: string, voice: SpeechSynthesisVoice) => {
    if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    if (text !== '') {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.onend = () => {
        setSpeaking(false);
      };
      utterThis.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setSpeaking(false);
      };
      utterThis.voice = voice;
      setSpeaking(true);
      synth.speak(utterThis);
    }
  }, [synth]);

  const cancel = useCallback(() => {
    synth.cancel();
    setSpeaking(false);
  }, [synth]);

  return { voices, speak, speaking, cancel };
};

export default useSpeechSynthesis;

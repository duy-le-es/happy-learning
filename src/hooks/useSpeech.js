import { useCallback, useRef } from 'react';
import { preloadNaturalVoice, synthesizeNaturalVoice } from '../utils/edgeTts';
import { playAudioSrc } from '../utils/audioPlayer';
import { speakVietnamese, stopBrowserTts } from '../utils/browserTts';
import { unlockAudio } from '../utils/audioUnlock';

export function useSpeech() {
  const activeAudioRef = useRef(null);

  const stop = useCallback(() => {
    stopBrowserTts();
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
  }, []);

  const speak = useCallback(async (text, { audioSrc } = {}) => {
    if (!text) return;

    await unlockAudio();
    stop();

    if (audioSrc) {
      try {
        await playAudioSrc(audioSrc);
        return;
      } catch {
        /* file MP3 không có */
      }
    }

    try {
      const blobUrl = await synthesizeNaturalVoice(text);
      await playAudioSrc(blobUrl);
      return;
    } catch {
      /* thử giọng trình duyệt */
    }

    await speakVietnamese(text);
  }, [stop]);

  const preload = useCallback((entries) => {
    entries.forEach((entry) => {
      if (typeof entry === 'string') {
        if (entry.startsWith('/sounds/')) {
          const audio = new Audio(entry);
          audio.preload = 'auto';
        } else {
          preloadNaturalVoice(entry);
        }
      } else if (entry?.text) {
        preloadNaturalVoice(entry.text);
      }
    });
  }, []);

  return { speak, stop, preload };
}

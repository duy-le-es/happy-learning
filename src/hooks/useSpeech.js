import { useCallback } from 'react';
import { playAudioSrc } from '../utils/audioPlayer';
import { speakVietnamese, stopBrowserTts } from '../utils/browserTts';
import { unlockAudio } from '../utils/audioUnlock';

export function useSpeech() {
  const stop = useCallback(() => {
    stopBrowserTts();
  }, []);

  const speak = useCallback(async (text, { audioSrc, rate } = {}) => {
    if (!text) return;

    await unlockAudio();
    stop();

    if (audioSrc && rate == null) {
      try {
        await playAudioSrc(audioSrc);
        return;
      } catch {
        /* thử giọng trình duyệt */
      }
    }

    await speakVietnamese(text, { rate });
  }, [stop]);

  const preload = useCallback((entries) => {
    entries.forEach((entry) => {
      if (typeof entry === 'string' && entry.startsWith('/sounds/')) {
        const audio = new Audio(entry);
        audio.preload = 'auto';
      }
    });
  }, []);

  return { speak, stop, preload };
}

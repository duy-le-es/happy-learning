import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { getSharedAudioContext, unlockAudio } from '../utils/audioUnlock';

async function getAudioContext() {
  await unlockAudio();
  const shared = getSharedAudioContext();
  if (shared && shared.state !== 'closed') return shared;
  return new AudioContext();
}

async function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  const ctx = await getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);

}

function playApplause() {
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => { playTone(freq, 0.15, 'triangle', 0.2); }, i * 80);
  });
}

function playTryAgain() {
  playTone(330, 0.3, 'sine', 0.25);
  setTimeout(() => { playTone(294, 0.4, 'sine', 0.25); }, 200);
}

function playVictory() {
  const melody = [523, 659, 784, 1047];
  melody.forEach((freq, i) => {
    setTimeout(() => { playTone(freq, 0.25, 'triangle', 0.25); }, i * 120);
  });
}

export function useSound() {
  const howlsRef = useRef({});

  const getHowl = useCallback((src) => {
    if (!howlsRef.current[src]) {
      howlsRef.current[src] = new Howl({ src: [src], volume: 0.8 });
    }
    return howlsRef.current[src];
  }, []);

  const playCorrect = useCallback(async () => {
    await unlockAudio();
    playApplause();
    playVictory();
  }, []);

  const playWrong = useCallback(async () => {
    await unlockAudio();
    playTryAgain();
  }, []);

  const playTap = useCallback(async () => {
    await unlockAudio();
    playTone(440, 0.08, 'sine', 0.15);
  }, []);

  const playFile = useCallback(
    (src) => {
      try {
        getHowl(src).play();
      } catch {
        /* fallback silently */
      }
    },
    [getHowl],
  );

  return { playCorrect, playWrong, playTap, playFile };
}

import { useCallback, useState } from 'react';
import { FEEDBACK } from '../data/voice';
import { useSpeech } from './useSpeech';
import { useSound } from './useSound';

export function useGameFeedback() {
  const { speak, stop, preload } = useSpeech();
  const { playCorrect, playWrong, playTap } = useSound();
  const [showCelebration, setShowCelebration] = useState(false);
  const [locked, setLocked] = useState(false);

  const celebrate = useCallback(async () => {
    setShowCelebration(true);
    playCorrect();
    await speak(FEEDBACK.correct.text, { audioSrc: FEEDBACK.correct.audio });
    setTimeout(() => setShowCelebration(false), 600);
  }, [playCorrect, speak]);

  const tryAgain = useCallback(async () => {
    playWrong();
    await speak(FEEDBACK.tryAgain.text, { audioSrc: FEEDBACK.tryAgain.audio });
  }, [playWrong, speak]);

  const handleCorrect = useCallback(async (onAdvance) => {
    setLocked(true);
    await celebrate();
    setTimeout(() => {
      onAdvance?.();
      setLocked(false);
    }, 1200);
  }, [celebrate]);

  const handleWrong = useCallback(async (onReset) => {
    setLocked(true);
    await tryAgain();
    setTimeout(() => {
      onReset?.();
      setLocked(false);
    }, 600);
  }, [tryAgain]);

  return {
    speak,
    stop,
    preload,
    playTap,
    showCelebration,
    locked,
    setLocked,
    celebrate,
    tryAgain,
    handleCorrect,
    handleWrong,
  };
}

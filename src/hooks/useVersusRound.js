import { useCallback, useState } from 'react';
import { FEEDBACK } from '../data/voice';
import { useGameFeedback } from './useGameFeedback';

export const VERSUS_ROUNDS = 8;

export function useVersusRound({ totalRounds = VERSUS_ROUNDS, onRoundStart }) {
  const { speak, playTap, playCorrect, playWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [roundLocked, setRoundLocked] = useState(false);
  const [playerDisabled, setPlayerDisabled] = useState({ 1: false, 2: false });
  const [playerStates, setPlayerStates] = useState({ 1: {}, 2: {} });
  const [roundWinner, setRoundWinner] = useState(null);

  const resetRoundUI = useCallback(() => {
    setRoundLocked(false);
    setPlayerDisabled({ 1: false, 2: false });
    setPlayerStates({ 1: {}, 2: {} });
    setRoundWinner(null);
  }, []);

  const startRound = useCallback(() => {
    resetRoundUI();
    onRoundStart?.();
  }, [resetRoundUI, onRoundStart]);

  const nextRound = useCallback(() => {
    if (roundIndex + 1 >= totalRounds) {
      setIsFinished(true);
    } else {
      setRoundIndex((i) => i + 1);
    }
  }, [roundIndex, totalRounds]);

  const handleWin = useCallback(async (player, stateKey) => {
    setRoundLocked(true);
    setPlayerStates((s) => ({ ...s, [player]: { [stateKey]: 'correct' } }));
    setScores((s) => ({ ...s, [player]: s[player] + 1 }));
    setRoundWinner(player);
    playCorrect();
    await speak(`Bé ${player} nhanh hơn!`, { audioSrc: FEEDBACK.correct.audio });
    setTimeout(nextRound, 1400);
  }, [nextRound, playCorrect, speak]);

  const handleMiss = useCallback(async (player, stateKey) => {
    setPlayerStates((s) => ({ ...s, [player]: { [stateKey]: 'wrong' } }));
    setPlayerDisabled((s) => ({ ...s, [player]: true }));
    playWrong();
    await speak(FEEDBACK.tryAgain.text, { audioSrc: FEEDBACK.tryAgain.audio });
    setTimeout(() => {
      setPlayerDisabled((s) => ({ ...s, [player]: false }));
      setPlayerStates((s) => ({ ...s, [player]: {} }));
    }, 700);
  }, [playWrong, speak]);

  const tryAnswer = useCallback(async (player, stateKey, isCorrect) => {
    if (roundLocked || playerDisabled[player]) return false;
    playTap();
    if (isCorrect) {
      await handleWin(player, stateKey);
    } else {
      await handleMiss(player, stateKey);
    }
    return true;
  }, [roundLocked, playerDisabled, playTap, handleWin, handleMiss]);

  const replay = useCallback(() => {
    setRoundIndex(0);
    setScores({ 1: 0, 2: 0 });
    setReplayKey((k) => k + 1);
    setIsFinished(false);
    resetRoundUI();
  }, [resetRoundUI]);

  return {
    replayKey,
    roundIndex,
    scores,
    isFinished,
    roundLocked,
    playerDisabled,
    playerStates,
    roundWinner,
    totalRounds,
    tryAnswer,
    startRound,
    replay,
  };
}

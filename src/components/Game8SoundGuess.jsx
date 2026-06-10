import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { FEEDBACK, questionAudio } from '../data/voice';
import { pickOptions, shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';
import OptionButton from './OptionButton';

export default function Game8SoundGuess({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop, preload, playTap, showCelebration, locked, setLocked, celebrate, tryAgain } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [optionStates, setOptionStates] = useState({});

  const questions = useMemo(
    () => shuffle(topic.items).slice(0, DEFAULT_ROUNDS),
    [topic.items, replayKey],
  );
  const currentItem = questions[roundIndex];
  const options = useMemo(
    () => pickOptions(currentItem, topic.items, 3),
    [currentItem, topic.items],
  );

  const playSound = useCallback(() => {
    speak(currentItem.question, { audioSrc: questionAudio(currentItem.id) });
  }, [speak, currentItem]);

  useEffect(() => {
    preload([
      ...topic.items.map((item) => questionAudio(item.id)),
      FEEDBACK.correct.audio,
      FEEDBACK.tryAgain.audio,
    ]);
  }, [topic.items, preload]);

  useEffect(() => {
    setOptionStates({});
    setLocked(false);
    const timer = setTimeout(playSound, 500);
    return () => { clearTimeout(timer); stop(); };
  }, [roundIndex, playSound, stop, setLocked]);

  const handleSelect = async (item) => {
    if (locked) return;
    playTap();
    setLocked(true);

    if (item.id === currentItem.id) {
      setOptionStates({ [item.id]: 'correct' });
      await celebrate();
      setTimeout(() => {
        if (roundIndex + 1 >= questions.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
        setLocked(false);
      }, 1200);
    } else {
      setOptionStates({ [item.id]: 'wrong' });
      await tryAgain();
      await playSound();
      setTimeout(() => { setOptionStates({}); setLocked(false); }, 600);
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message="Bé nghe giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-sound" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Nghe đoán`} progress={`${roundIndex + 1}/${questions.length}`} />
      <p className="game-hint">Nghe và chọn hình đúng!</p>
      <div className="game-sound__listen">
        <button type="button" className="sound-button sound-button--big" onClick={playSound} aria-label="Nghe tiếng">
          <span className="sound-button__icon">🔊</span>
        </button>
        <p className="game-sound__label">Bấm nghe nhé!</p>
      </div>
      <div className="game-quiz__options-row">
        {options.map((item) => (
          <OptionButton
            key={item.id}
            item={item}
            onSelect={handleSelect}
            disabled={locked}
            state={optionStates[item.id] ?? null}
          />
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

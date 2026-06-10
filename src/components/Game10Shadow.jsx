import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { FEEDBACK, questionAudio } from '../data/voice';
import { pickOptions, shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';
import ItemDisplay from './ItemDisplay';
import OptionButton from './OptionButton';

export default function Game10Shadow({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, setLocked, celebrate, tryAgain } = useGameFeedback();
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

  const readQuestion = useCallback(() => {
    speak('Bóng này là hình gì?', { audioSrc: questionAudio(currentItem.id) });
  }, [speak, currentItem]);

  useEffect(() => {
    preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]);
  }, [preload]);

  useEffect(() => {
    setOptionStates({});
    setLocked(false);
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion, setLocked]);

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
      setTimeout(() => { setOptionStates({}); setLocked(false); }, 600);
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message="Bé đoán bóng giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-shadow" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Bóng đâu`} progress={`${roundIndex + 1}/${questions.length}`} />
      <p className="game-hint">Bóng này là gì?</p>
      <div className="game-shadow__display">
        <div className="shadow-silhouette">
          <ItemDisplay item={currentItem} size="large" />
        </div>
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

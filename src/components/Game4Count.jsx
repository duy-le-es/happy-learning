import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';
import ItemDisplay from './ItemDisplay';

const NUMBERS = [1, 2, 3, 4, 5];

function buildRounds(items, count) {
  return shuffle(items)
    .slice(0, count)
    .map((item) => ({
      item,
      answer: Math.floor(Math.random() * 5) + 1,
    }));
}

export default function Game4Count({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [picked, setPicked] = useState(null);

  const rounds = useMemo(
    () => buildRounds(topic.items, DEFAULT_ROUNDS),
    [topic.items, replayKey],
  );
  const round = rounds[roundIndex];

  const readQuestion = useCallback(() => {
    speak('Có mấy cái? Đếm nhé!');
  }, [speak]);

  useEffect(() => {
    preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]);
  }, [preload]);

  useEffect(() => {
    setPicked(null);
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handlePick = async (num) => {
    if (locked) return;
    playTap();
    setPicked(num);

    if (num === round.answer) {
      await handleCorrect(() => {
        if (roundIndex + 1 >= rounds.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
      });
    } else {
      await handleWrong(() => setPicked(null));
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message={`Bé đếm giỏi chủ đề ${topic.name}!`}
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-count" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader
        onBack={onBack}
        title={`${topic.emoji} Đếm số`}
        progress={`${roundIndex + 1}/${rounds.length}`}
      />
      <p className="game-hint">Có mấy cái?</p>
      <button type="button" className="sound-button" onClick={readQuestion} aria-label="Nghe lại">
        <span className="sound-button__icon">🔊</span>
      </button>
      <div className="game-count__items">
        {Array.from({ length: round.answer }, (_, i) => (
          <div key={i} className="game-count__item">
            <ItemDisplay item={round.item} size="medium" />
          </div>
        ))}
      </div>
      <div className="game-count__numbers">
        {NUMBERS.map((num) => (
          <button
            key={num}
            type="button"
            className={`number-btn ${picked === num ? (num === round.answer ? 'number-btn--correct' : 'number-btn--wrong') : ''}`}
            onClick={() => handlePick(num)}
            disabled={locked}
          >
            {num}
          </button>
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

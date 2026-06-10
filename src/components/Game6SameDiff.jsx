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

function buildRounds(items, count) {
  const shuffled = shuffle(items);
  return Array.from({ length: count }, (_, i) => {
    const isSame = Math.random() > 0.5;
    const first = shuffled[i % shuffled.length];
    let second = first;
    if (!isSame) {
      const others = shuffled.filter((item) => item.id !== first.id);
      second = others[i % others.length] ?? shuffled[(i + 1) % shuffled.length];
    }
    return { left: first, right: second, isSame: first.id === second.id };
  });
}

export default function Game6SameDiff({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const rounds = useMemo(() => buildRounds(topic.items, DEFAULT_ROUNDS), [topic.items, replayKey]);
  const round = rounds[roundIndex];

  const readQuestion = useCallback(() => speak('Hai hình giống hay khác nhau?'), [speak]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handlePick = async (answerSame) => {
    if (locked) return;
    playTap();
    const correct = answerSame === round.isSame;

    if (correct) {
      await handleCorrect(() => {
        if (roundIndex + 1 >= rounds.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
      });
    } else {
      await handleWrong();
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message="Bé phân biệt giống khác giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-samediff" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Giống khác`} progress={`${roundIndex + 1}/${rounds.length}`} />
      <p className="game-hint">Giống hay khác?</p>
      <div className="game-samediff__pair">
        <div className="game-samediff__item"><ItemDisplay item={round.left} size="large" /></div>
        <div className="game-samediff__item"><ItemDisplay item={round.right} size="large" /></div>
      </div>
      <div className="game-samediff__choices">
        <button type="button" className="choice-btn choice-btn--same" onClick={() => handlePick(true)} disabled={locked}>
          <span className="choice-btn__emoji">😊</span>
          <span className="choice-btn__label">Giống</span>
        </button>
        <button type="button" className="choice-btn choice-btn--diff" onClick={() => handlePick(false)} disabled={locked}>
          <span className="choice-btn__emoji">🤔</span>
          <span className="choice-btn__label">Khác</span>
        </button>
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

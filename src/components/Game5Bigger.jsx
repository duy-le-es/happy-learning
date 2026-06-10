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
  return shuffle(items).slice(0, count).map((item) => ({
    item,
    bigSide: Math.random() > 0.5 ? 'left' : 'right',
  }));
}

export default function Game5Bigger({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [picked, setPicked] = useState(null);

  const rounds = useMemo(() => buildRounds(topic.items, DEFAULT_ROUNDS), [topic.items, replayKey]);
  const round = rounds[roundIndex];

  const readQuestion = useCallback(() => speak('Cái nào to hơn?'), [speak]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    setPicked(null);
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handlePick = async (side) => {
    if (locked) return;
    playTap();
    setPicked(side);
    const correct = side === round.bigSide;

    if (correct) {
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
        message="Bé biết so sánh lớn nhỏ rồi!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  const leftSize = round.bigSide === 'left' ? 'large' : 'small';
  const rightSize = round.bigSide === 'right' ? 'large' : 'small';

  return (
    <div className="screen game-bigger" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Lớn nhỏ`} progress={`${roundIndex + 1}/${rounds.length}`} />
      <p className="game-hint">Cái nào to hơn?</p>
      <button type="button" className="sound-button" onClick={readQuestion} aria-label="Nghe lại">
        <span className="sound-button__icon">🔊</span>
      </button>
      <div className="game-bigger__compare">
        <button
          type="button"
          className={`compare-btn compare-btn--${leftSize} ${picked === 'left' ? (leftSize === 'large' ? 'compare-btn--correct' : 'compare-btn--wrong') : ''}`}
          onClick={() => handlePick('left')}
          disabled={locked}
        >
          <ItemDisplay item={round.item} size={leftSize === 'large' ? 'large' : 'small'} />
        </button>
        <button
          type="button"
          className={`compare-btn compare-btn--${rightSize} ${picked === 'right' ? (rightSize === 'large' ? 'compare-btn--correct' : 'compare-btn--wrong') : ''}`}
          onClick={() => handlePick('right')}
          disabled={locked}
        >
          <ItemDisplay item={round.item} size={rightSize === 'large' ? 'large' : 'small'} />
        </button>
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

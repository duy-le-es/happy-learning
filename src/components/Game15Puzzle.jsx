import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { emojiImageUrl } from '../utils/emojiImage';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

function PuzzlePiece({ emoji, pieceIndex }) {
  const col = pieceIndex % 2;
  const row = Math.floor(pieceIndex / 2);

  return (
    <div className="puzzle-piece">
      <img
        src={emojiImageUrl(emoji)}
        alt=""
        className="puzzle-piece__img"
        style={{
          '--piece-col': col,
          '--piece-row': row,
        }}
        draggable={false}
      />
    </div>
  );
}

export default function Game15Puzzle({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, handleCorrect } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [selected, setSelected] = useState(null);

  const items = useMemo(
    () => shuffle(topic.items.filter((i) => i.emoji)).slice(0, DEFAULT_ROUNDS),
    [topic.items, replayKey],
  );
  const item = items[roundIndex];
  const refSrc = emojiImageUrl(item.emoji);

  const initPuzzle = useCallback(() => {
    let shuffled = shuffle([0, 1, 2, 3]);
    while (shuffled.every((v, i) => v === i)) {
      shuffled = shuffle([0, 1, 2, 3]);
    }
    setOrder(shuffled);
    setSelected(null);
  }, []);

  useEffect(() => { preload([FEEDBACK.correct.audio]); }, [preload]);
  useEffect(() => {
    initPuzzle();
    const timer = setTimeout(() => speak('Ghép hình lại nhé!'), 400);
    return () => clearTimeout(timer);
  }, [roundIndex, speak, initPuzzle]);

  const handleTileTap = async (idx) => {
    if (locked) return;
    playTap();

    if (selected == null) {
      setSelected(idx);
      return;
    }

    if (selected === idx) {
      setSelected(null);
      return;
    }

    const newOrder = [...order];
    [newOrder[selected], newOrder[idx]] = [newOrder[idx], newOrder[selected]];
    setOrder(newOrder);
    setSelected(null);

    const solved = newOrder.every((v, i) => v === i);
    if (solved) {
      await handleCorrect(() => {
        if (roundIndex + 1 >= items.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
      });
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message="Bé ghép hình giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-puzzle" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Ghép hình`} progress={`${roundIndex + 1}/${items.length}`} />
      <p className="game-hint">Chạm 2 ô để đổi chỗ!</p>
      <div className="game-puzzle__reference">
        <p className="game-puzzle__ref-label">Hình mẫu</p>
        <img src={refSrc} alt="" className="game-puzzle__ref-img" draggable={false} />
      </div>
      <div className="game-puzzle__grid">
        {order.map((pieceIdx, gridIdx) => (
          <button
            key={gridIdx}
            type="button"
            className={`puzzle-tile ${selected === gridIdx ? 'puzzle-tile--selected' : ''}`}
            onClick={() => handleTileTap(gridIdx)}
            disabled={locked}
          >
            <PuzzlePiece emoji={item.emoji} pieceIndex={pieceIdx} />
          </button>
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getTopicById } from '../data/topics';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';
import ItemDisplay from './ItemDisplay';

const TARGET_COUNT = 5;
const SPAWN_MS = 1800;
const FALL_DURATION = 5500;

export default function Game13Catch({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, celebrate, tryAgain } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [caught, setCaught] = useState(0);
  const [falling, setFalling] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const targetItem = useMemo(
    () => topic.items[Math.floor(Math.random() * topic.items.length)],
    [topic.items, replayKey],
  );
  const distractors = useMemo(
    () => shuffle(topic.items.filter((i) => i.id !== targetItem.id)).slice(0, 3),
    [topic.items, targetItem, replayKey],
  );
  const idRef = useRef(0);
  const caughtRef = useRef(0);

  const readQuestion = useCallback(() => {
    speak(`Chạm vào ${targetItem.name} rơi xuống nhé!`);
  }, [speak, targetItem]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    caughtRef.current = 0;
    setCaught(0);
    setFalling([]);
    setWrongId(null);
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [replayKey, readQuestion]);

  useEffect(() => {
    if (isFinished) return undefined;

    const spawn = () => {
      const isTarget = Math.random() > 0.35;
      const item = isTarget
        ? targetItem
        : distractors[Math.floor(Math.random() * distractors.length)];
      const id = idRef.current + 1;
      idRef.current = id;
      const x = 5 + Math.random() * 62;

      setFalling((prev) => [...prev, { id, item, x, isTarget }]);
      setTimeout(() => {
        setFalling((prev) => prev.filter((f) => f.id !== id));
      }, FALL_DURATION);
    };

    const startDelay = setTimeout(spawn, 1200);
    const interval = setInterval(spawn, SPAWN_MS);
    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, [isFinished, targetItem, distractors]);

  const handleCatch = async (fallItem) => {
    playTap();

    if (fallItem.isTarget) {
      setFalling((prev) => prev.filter((f) => f.id !== fallItem.id));
      const next = caughtRef.current + 1;
      caughtRef.current = next;
      setCaught(next);
      await celebrate();

      if (next >= TARGET_COUNT) {
        setTimeout(() => setIsFinished(true), 800);
      }
      return;
    }

    setWrongId(fallItem.id);
    await tryAgain();
    setTimeout(() => setWrongId(null), 500);
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message={`Bé bắt được ${TARGET_COUNT} ${targetItem.name}!`}
        onReplay={() => { setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-catch" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Bắt hình`} progress={`${caught}/${TARGET_COUNT}`} />

      <div className="game-catch__guide">
        <button type="button" className="sound-button sound-button--small" onClick={readQuestion} aria-label="Nghe hướng dẫn">
          <span className="sound-button__icon">🔊</span>
        </button>
        <div className="game-catch__target-card">
          <p className="game-catch__target-label">Bắt hình này!</p>
          <div className="game-catch__target-icon">
            <ItemDisplay item={targetItem} size="large" />
          </div>
          <p className="game-catch__target-name">{targetItem.name}</p>
        </div>
        <div className="game-catch__arrow" aria-hidden="true">👇</div>
      </div>

      <p className="game-catch__hint">Chạm vào hình <strong>{targetItem.name}</strong> khi rơi xuống!</p>

      <div className="game-catch__arena">
        {falling.length === 0 && (
          <p className="game-catch__waiting">Đang rơi xuống...</p>
        )}
        {falling.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`falling-item ${f.isTarget ? 'falling-item--target' : 'falling-item--other'} ${wrongId === f.id ? 'falling-item--wrong' : ''}`}
            style={{
              left: `${f.x}%`,
              animationDuration: `${FALL_DURATION}ms`,
            }}
            onClick={() => handleCatch(f)}
          >
            <ItemDisplay item={f.item} size={f.isTarget ? 'large' : 'medium'} />
          </button>
        ))}
      </div>

      <Celebration show={showCelebration} />
    </div>
  );
}

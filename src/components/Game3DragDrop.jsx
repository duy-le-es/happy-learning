import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getTopicById } from '../data/topics';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { unlockAudio } from '../utils/audioUnlock';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import ItemDisplay from './ItemDisplay';
import Celebration from './Celebration';
import FinishScreen from './FinishScreen';

const ITEMS_PER_ROUND = 6;

function findZoneAtPoint(x, y, refs) {
  for (const [id, el] of Object.entries(refs)) {
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return id;
    }
  }
  return null;
}

export default function Game3DragDrop({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload } = useSpeech();
  const { playCorrect, playWrong } = useSound();

  const [replayKey, setReplayKey] = useState(0);
  const [placed, setPlaced] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongZone, setWrongZone] = useState(null);

  const zoneRefs = useRef({});

  const roundItems = useMemo(
    () => shuffle(topic.items).slice(0, ITEMS_PER_ROUND),
    [topic.items, replayKey],
  );

  const remaining = roundItems.filter((item) => !placed[item.id]);

  const setZoneRef = useCallback((id) => (el) => {
    if (el) zoneRefs.current[id] = el;
    else delete zoneRefs.current[id];
  }, []);

  useEffect(() => {
    preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]);
  }, [preload]);

  const handleCorrectDrop = async () => {
    await unlockAudio();
    setShowCelebration(true);
    playCorrect();
    await new Promise((resolve) => { setTimeout(resolve, 350); });
    await speak(FEEDBACK.correct.text, { audioSrc: FEEDBACK.correct.audio });
    setTimeout(() => setShowCelebration(false), 600);
  };

  const handleDragEnd = async (item, event, info) => {
    setDraggingId(null);
    const x = info.point.x;
    const y = info.point.y;
    const zoneId = findZoneAtPoint(x, y, zoneRefs.current);

    if (!zoneId) return;

    if (zoneId === item.id) {
      setPlaced((p) => ({ ...p, [item.id]: true }));
      await handleCorrectDrop();

      if (Object.keys(placed).length + 1 >= roundItems.length) {
        setTimeout(() => setIsFinished(true), 800);
      }
    } else {
      await unlockAudio();
      playWrong();
      setWrongZone(zoneId);
      await speak(FEEDBACK.tryAgain.text, { audioSrc: FEEDBACK.tryAgain.audio });
      setTimeout(() => setWrongZone(null), 600);
    }
  };

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    setPlaced({});
    setIsFinished(false);
    zoneRefs.current = {};
  };

  if (isFinished) {
    return (
      <FinishScreen
        topic={topic}
        message={`Bé đã kéo thả đúng hết ${topic.name}!`}
        onReplay={handleReplay}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  const placedCount = Object.keys(placed).length;

  return (
    <div className="screen game-drag" style={{ '--screen-bg': topic.bgGradient }}>
      <header className="screen-header screen-header--light">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <span className="screen-header__topic">{topic.emoji} Kéo thả</span>
        <span className="screen-header__progress">
          {placedCount}/{roundItems.length}
        </span>
      </header>

      <p className="game-drag__hint">Kéo hình vào đúng chỗ nhé!</p>

      <div className="game-drag__zones">
        {roundItems.map((item) => {
          const isPlaced = placed[item.id];
          const isWrong = wrongZone === item.id;

          return (
            <div
              key={item.id}
              ref={setZoneRef(item.id)}
              className={`drop-zone ${isPlaced ? 'drop-zone--filled' : ''} ${isWrong ? 'drop-zone--wrong' : ''}`}
              aria-label={item.name}
            >
              <div className="drop-zone__hint">
                <ItemDisplay item={item} size="small" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="game-drag__items">
        {remaining.map((item) => (
          <motion.div
            key={item.id}
            className={`drag-item ${draggingId === item.id ? 'drag-item--dragging' : ''}`}
            drag
            dragSnapToOrigin
            dragElastic={0.1}
            whileDrag={{ scale: 1.12, zIndex: 50 }}
            onDragStart={() => {
              unlockAudio();
              setDraggingId(item.id);
            }}
            onDragEnd={(e, info) => handleDragEnd(item, e, info)}
          >
            <ItemDisplay item={item} size="medium" />
          </motion.div>
        ))}
      </div>

      <Celebration show={showCelebration} />
    </div>
  );
}

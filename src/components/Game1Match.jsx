import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getTopicById } from '../data/topics';
import { FEEDBACK } from '../data/voice';
import { buildMatchDeck, getMatchGridCols } from '../utils/matchDeck';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import ItemDisplay from './ItemDisplay';
import Celebration from './Celebration';
import FinishScreen from './FinishScreen';

export default function Game1Match({ topicId, pairCount, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak } = useSpeech();
  const { playCorrect, playWrong, playTap } = useSound();

  const [replayKey, setReplayKey] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shaking, setShaking] = useState([]);

  const cards = useMemo(
    () => buildMatchDeck(topic.items, pairCount),
    [topic.items, pairCount, replayKey],
  );

  const cols = getMatchGridCols(cards.length);
  const matchedCount = matched.length / 2;
  const totalPairs = pairCount;

  const handleCardTap = useCallback(async (card) => {
    if (locked) return;
    if (matched.includes(card.cardId)) return;
    if (flipped.includes(card.cardId)) return;

    playTap();
    const nextFlipped = [...flipped, card.cardId];
    setFlipped(nextFlipped);

    if (nextFlipped.length < 2) return;

    setLocked(true);
    const [firstId, secondId] = nextFlipped;
    const first = cards.find((c) => c.cardId === firstId);
    const second = cards.find((c) => c.cardId === secondId);

    if (first.itemId === second.itemId) {
      setShowCelebration(true);
      playCorrect();
      await speak(FEEDBACK.correct.text, { audioSrc: FEEDBACK.correct.audio });

      setTimeout(() => {
        setMatched((m) => [...m, firstId, secondId]);
        setFlipped([]);
        setLocked(false);
        setShowCelebration(false);

        if (matchedCount + 1 >= totalPairs) {
          setIsFinished(true);
        }
      }, 1200);
    } else {
      playWrong();
      setShaking(nextFlipped);
      await speak(FEEDBACK.tryAgain.text, { audioSrc: FEEDBACK.tryAgain.audio });

      setTimeout(() => {
        setFlipped([]);
        setShaking([]);
        setLocked(false);
      }, 900);
    }
  }, [
    locked, matched, flipped, cards, playTap, playCorrect, playWrong, speak,
    matchedCount, totalPairs,
  ]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <FinishScreen
        topic={topic}
        message={`Bé đã tìm hết ${totalPairs} cặp ${topic.name}!`}
        onReplay={handleReplay}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-match" style={{ '--screen-bg': topic.bgGradient }}>
      <header className="screen-header screen-header--light">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <span className="screen-header__topic">{topic.emoji} Tìm cặp</span>
        <span className="screen-header__progress">
          {matchedCount}/{totalPairs}
        </span>
      </header>

      <p className="game-match__hint">Chạm 2 hình giống nhau nhé!</p>

      <div
        className="game-match__grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        <AnimatePresence>
          {cards.map((card) => {
            const isMatched = matched.includes(card.cardId);
            const isFlipped = flipped.includes(card.cardId) || isMatched;

            if (isMatched) return null;

            return (
              <motion.button
                key={card.cardId}
                type="button"
                className={`match-card ${isFlipped ? 'match-card--flipped' : ''} ${shaking.includes(card.cardId) ? 'match-card--shake' : ''}`}
                onClick={() => handleCardTap(card)}
                layout
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.92 }}
              >
                <span className="match-card__inner">
                  {isFlipped ? (
                    <ItemDisplay item={card.item} size="medium" />
                  ) : (
                    <span className="match-card__back">❓</span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <Celebration show={showCelebration} />
    </div>
  );
}

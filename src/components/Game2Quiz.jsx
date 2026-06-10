import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getTopicById } from '../data/topics';
import { FEEDBACK, questionAudio } from '../data/voice';
import { pickOptions, shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import OptionButton from './OptionButton';
import Celebration from './Celebration';
import FinishScreen from './FinishScreen';

export default function Game2Quiz({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop, preload } = useSpeech();
  const { playCorrect, playWrong, playTap } = useSound();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [optionStates, setOptionStates] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const questions = useMemo(
    () => shuffle(topic.items),
    [topic.items, replayKey],
  );

  const currentItem = questions[questionIndex];

  const options = useMemo(
    () => pickOptions(currentItem, topic.items, 3),
    [currentItem, topic.items],
  );

  const readQuestion = useCallback(() => {
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
    setShowCelebration(false);

    const timer = setTimeout(readQuestion, 400);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [questionIndex, readQuestion, stop]);

  const handleSelect = async (item) => {
    if (locked) return;

    playTap();
    setLocked(true);

    if (item.id === currentItem.id) {
      setOptionStates({ [item.id]: 'correct' });
      setShowCelebration(true);
      playCorrect();
      await speak(FEEDBACK.correct.text, { audioSrc: FEEDBACK.correct.audio });

      setTimeout(() => {
        if (questionIndex + 1 >= questions.length) {
          setIsFinished(true);
        } else {
          setQuestionIndex((i) => i + 1);
        }
      }, 1800);
    } else {
      setOptionStates({ [item.id]: 'wrong' });
      playWrong();
      await speak(FEEDBACK.tryAgain.text, { audioSrc: FEEDBACK.tryAgain.audio });
      await speak(currentItem.question, { audioSrc: questionAudio(currentItem.id) });

      setTimeout(() => {
        setOptionStates({});
        setLocked(false);
      }, 800);
    }
  };

  if (isFinished) {
    return (
      <FinishScreen
        topic={topic}
        onReplay={() => {
          setQuestionIndex(0);
          setReplayKey((k) => k + 1);
          setIsFinished(false);
        }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-quiz" style={{ background: topic.bgGradient }}>
      <header className="screen-header screen-header--light">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <span className="screen-header__topic">{topic.emoji} {topic.name}</span>
        <span className="screen-header__progress">
          {questionIndex + 1}/{questions.length}
        </span>
      </header>

      <div className="game-quiz__question-area">
        <motion.button
          type="button"
          className="sound-button"
          onClick={readQuestion}
          whileTap={{ scale: 0.9 }}
          aria-label="Nghe lại câu hỏi"
        >
          <span className="sound-button__icon">🔊</span>
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h2
            key={currentItem.id}
            className="game-quiz__question"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {currentItem.question}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="game-quiz__options">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            className="game-quiz__options-row"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 250 }}
          >
            {options.map((item) => (
              <OptionButton
                key={item.id}
                item={item}
                onSelect={handleSelect}
                disabled={locked}
                state={optionStates[item.id] ?? null}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <Celebration show={showCelebration} />
    </div>
  );
}

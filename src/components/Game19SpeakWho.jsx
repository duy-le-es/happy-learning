import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { getRepeatPhrase, SPEAK_PROMPTS, SPEAK_ROUNDS } from '../data/gameData';
import { repeatAudio } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import SpeakPracticeLayout from './SpeakPracticeLayout';

export default function Game19SpeakWho({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop } = useSpeech();
  const [replayKey, setReplayKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const items = useMemo(
    () => shuffle(topic.items).slice(0, SPEAK_ROUNDS),
    [topic.items, replayKey],
  );
  const item = items[index];
  const phrase = getRepeatPhrase(item);

  const readWho = useCallback(() => {
    speak(phrase, { audioSrc: repeatAudio(item.id) });
  }, [speak, phrase, item]);

  useEffect(() => {
    setRevealed(false);
  }, [index, replayKey]);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(readWho, 300);
  };

  const advance = () => {
    if (index + 1 >= items.length) setIsFinished(true);
    else setIndex((i) => i + 1);
  };

  useEffect(() => () => stop(), [stop]);

  return (
    <SpeakPracticeLayout
      topicId={topicId}
      topic={topic}
      title="Ai đây"
      hint={SPEAK_PROMPTS.who}
      promptText={phrase}
      item={item}
      index={index}
      total={items.length}
      phase={revealed ? 'visible' : 'hidden'}
      onListen={readWho}
      onSpeakTry={advance}
      onReveal={handleReveal}
      onBack={onBack}
      onHome={onHome}
      isFinished={isFinished}
      onReplay={() => {
        setIndex(0);
        setReplayKey((k) => k + 1);
        setIsFinished(false);
      }}
      finishMessage="Bé nhận ra và nói tên giỏi lắm!"
    />
  );
}

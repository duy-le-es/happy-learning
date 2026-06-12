import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { SPEAK_PROMPTS, SPEAK_ROUNDS } from '../data/gameData';
import { shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import SpeakPracticeLayout from './SpeakPracticeLayout';

const SLOW_RATE = 0.55;

export default function Game20SpeakSlow({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop } = useSpeech();
  const [replayKey, setReplayKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const items = useMemo(
    () => shuffle(topic.items).slice(0, SPEAK_ROUNDS),
    [topic.items, replayKey],
  );
  const item = items[index];

  const readSlow = useCallback(() => {
    const text = `${item.name}. ${item.name}.`;
    speak(text, { rate: SLOW_RATE });
  }, [speak, item]);

  useEffect(() => {
    const timer = setTimeout(readSlow, 800);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [index, replayKey, readSlow, stop]);

  const advance = () => {
    if (index + 1 >= items.length) setIsFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <SpeakPracticeLayout
      topicId={topicId}
      topic={topic}
      title="Nói chậm"
      hint={SPEAK_PROMPTS.slow}
      promptText={item.name}
      item={item}
      index={index}
      total={items.length}
      phase="visible"
      onListen={readSlow}
      onSpeakTry={advance}
      onBack={onBack}
      onHome={onHome}
      isFinished={isFinished}
      onReplay={() => {
        setIndex(0);
        setReplayKey((k) => k + 1);
        setIsFinished(false);
      }}
      finishMessage="Bé nói chậm rõ ràng rồi!"
    />
  );
}

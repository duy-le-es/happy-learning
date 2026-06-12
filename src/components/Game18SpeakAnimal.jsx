import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { getAnimalSound, SPEAK_PROMPTS, SPEAK_ROUNDS } from '../data/gameData';
import { shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import SpeakPracticeLayout from './SpeakPracticeLayout';

export default function Game18SpeakAnimal({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop } = useSpeech();
  const [replayKey, setReplayKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const items = useMemo(() => {
    const withSound = topic.items.filter((i) => getAnimalSound(i.id));
    const pool = withSound.length >= 4 ? withSound : topic.items;
    return shuffle(pool).slice(0, SPEAK_ROUNDS);
  }, [topic.items, replayKey]);

  const item = items[index];
  const soundText = getAnimalSound(item.id) ?? item.name;

  const readSound = useCallback(() => {
    speak(`${item.name} kêu: ${soundText}`);
  }, [speak, item, soundText]);

  useEffect(() => {
    const timer = setTimeout(readSound, 600);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [index, replayKey, readSound, stop]);

  const advance = () => {
    if (index + 1 >= items.length) setIsFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <SpeakPracticeLayout
      topicId={topicId}
      topic={topic}
      title="Con vật kêu"
      hint={SPEAK_PROMPTS.animal}
      promptText={soundText}
      item={item}
      index={index}
      total={items.length}
      phase="visible"
      onListen={readSound}
      onSpeakTry={advance}
      onBack={onBack}
      onHome={onHome}
      isFinished={isFinished}
      onReplay={() => {
        setIndex(0);
        setReplayKey((k) => k + 1);
        setIsFinished(false);
      }}
      finishMessage="Bé bắt chước tiếng kêu giỏi lắm!"
    />
  );
}

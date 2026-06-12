import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { getRepeatPhrase, SPEAK_PROMPTS, SPEAK_ROUNDS } from '../data/gameData';
import { repeatAudio } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import SpeakPracticeLayout from './SpeakPracticeLayout';

export default function Game17SpeakRepeat({ topicId, onBack, onHome }) {
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
  const phrase = getRepeatPhrase(item);

  const readWord = useCallback(() => {
    speak(phrase, { audioSrc: repeatAudio(item.id) });
  }, [speak, phrase, item]);

  useEffect(() => {
    const timer = setTimeout(readWord, 600);
    return () => clearTimeout(timer);
  }, [index, replayKey, readWord]);

  useEffect(() => {
    return () => stop();
  }, [index, replayKey, stop]);

  const advance = () => {
    if (index + 1 >= items.length) setIsFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <SpeakPracticeLayout
      topicId={topicId}
      topic={topic}
      title="Nói theo"
      hint={SPEAK_PROMPTS.repeat}
      promptText={phrase}
      item={item}
      index={index}
      total={items.length}
      phase="visible"
      onListen={readWord}
      onSpeakTry={advance}
      onBack={onBack}
      onHome={onHome}
      isFinished={isFinished}
      onReplay={() => {
        setIndex(0);
        setReplayKey((k) => k + 1);
        setIsFinished(false);
      }}
      finishMessage={`Bé đã luyện nói ${items.length} từ!`}
    />
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { SPEAK_PROMPTS, SPEAK_ROUNDS } from '../data/gameData';
import { questionAudio } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { useSpeech } from '../hooks/useSpeech';
import SpeakPracticeLayout from './SpeakPracticeLayout';

export default function Game21SpeakSentence({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, stop } = useSpeech();
  const [replayKey, setReplayKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const items = useMemo(
    () => shuffle(topic.items.filter((i) => i.question)).slice(0, SPEAK_ROUNDS),
    [topic.items, replayKey],
  );
  const item = items[index];

  const readSentence = useCallback(() => {
    speak(item.question, { audioSrc: questionAudio(item.id) });
  }, [speak, item]);

  useEffect(() => {
    const timer = setTimeout(readSentence, 600);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [index, replayKey, readSentence, stop]);

  const advance = () => {
    if (index + 1 >= items.length) setIsFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <SpeakPracticeLayout
      topicId={topicId}
      topic={topic}
      title="Nói câu ngắn"
      hint={SPEAK_PROMPTS.sentence}
      promptText={item.question}
      item={item}
      index={index}
      total={items.length}
      phase="visible"
      onListen={readSentence}
      onSpeakTry={advance}
      onBack={onBack}
      onHome={onHome}
      isFinished={isFinished}
      onReplay={() => {
        setIndex(0);
        setReplayKey((k) => k + 1);
        setIsFinished(false);
      }}
      finishMessage="Bé nói câu hay lắm!"
    />
  );
}

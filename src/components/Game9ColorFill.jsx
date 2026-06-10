import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTopicById } from '../data/topics';
import { BASIC_COLORS, COLORING_SHAPES } from '../data/gameData';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

export default function Game9ColorFill({ topicId, onBack, onHome }) {
  const topic = getTopicById(topicId);
  const { speak, preload, playTap, showCelebration, locked, handleCorrect } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [fillColor, setFillColor] = useState('#FFFFFF');

  const shapes = useMemo(
    () => shuffle(COLORING_SHAPES).slice(0, DEFAULT_ROUNDS),
    [replayKey],
  );
  const shape = shapes[roundIndex];
  const palette = useMemo(() => shuffle(BASIC_COLORS).slice(0, 6), [roundIndex]);

  const readQuestion = useCallback(() => speak('Chọn màu tô hình nhé!'), [speak]);

  useEffect(() => { preload([FEEDBACK.correct.audio]); }, [preload]);
  useEffect(() => {
    setFillColor('#FFFFFF');
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handleColor = async (color) => {
    if (locked) return;
    playTap();
    setFillColor(color.color);
    await handleCorrect(() => {
      if (roundIndex + 1 >= shapes.length) setIsFinished(true);
      else setRoundIndex((i) => i + 1);
    });
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message="Bé tô màu đẹp lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-colorfill" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader onBack={onBack} title={`${topic.emoji} Tô màu`} progress={`${roundIndex + 1}/${shapes.length}`} />
      <p className="game-hint">Chọn màu tô nhé!</p>
      <div className="game-colorfill__canvas" style={{ backgroundColor: fillColor }}>
        <span className="game-colorfill__emoji">{shape.emoji}</span>
      </div>
      <div className="game-colorfill__palette">
        {palette.map((c) => (
          <button
            key={c.id}
            type="button"
            className="color-swatch"
            style={{ backgroundColor: c.color }}
            onClick={() => handleColor(c)}
            disabled={locked}
            aria-label={c.name}
          />
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

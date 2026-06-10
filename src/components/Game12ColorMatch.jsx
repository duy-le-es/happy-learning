import { useCallback, useEffect, useMemo, useState } from 'react';
import { BASIC_COLORS } from '../data/gameData';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

const BG = 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)';

function buildRounds() {
  return shuffle(BASIC_COLORS).slice(0, DEFAULT_ROUNDS).map((target) => {
    const others = shuffle(BASIC_COLORS.filter((c) => c.id !== target.id)).slice(0, 3);
    return { target, options: shuffle([target, ...others]) };
  });
}

export default function Game12ColorMatch({ onBack, onHome }) {
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const rounds = useMemo(() => buildRounds(), [replayKey]);
  const round = rounds[roundIndex];

  const readQuestion = useCallback(() => speak('Chọn đúng màu nhé!'), [speak]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handlePick = async (color) => {
    if (locked) return;
    playTap();

    if (color.id === round.target.id) {
      await handleCorrect(() => {
        if (roundIndex + 1 >= rounds.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
      });
    } else {
      await handleWrong();
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        bgGradient={BG}
        color="#6C5CE7"
        message="Bé nhận màu giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-colormatch" style={{ '--screen-bg': BG }}>
      <GameHeader onBack={onBack} title="🌈 Chọn màu" progress={`${roundIndex + 1}/${rounds.length}`} />
      <p className="game-hint">Chọn màu giống nhé!</p>
      <div className="game-colormatch__target" style={{ backgroundColor: round.target.color }} />
      <div className="game-colormatch__options">
        {round.options.map((c) => (
          <button
            key={c.id}
            type="button"
            className="color-swatch color-swatch--large"
            style={{ backgroundColor: c.color }}
            onClick={() => handlePick(c)}
            disabled={locked}
            aria-label={c.name}
          />
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

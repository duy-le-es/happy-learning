import { useCallback, useEffect, useMemo, useState } from 'react';
import { EMOTIONS } from '../data/gameData';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

const BG = 'linear-gradient(135deg, #FDCB6E 0%, #F39C12 100%)';

function buildRounds() {
  return shuffle(EMOTIONS).slice(0, DEFAULT_ROUNDS).map((emotion) => {
    const others = shuffle(EMOTIONS.filter((e) => e.id !== emotion.id)).slice(0, 2);
    return { emotion, options: shuffle([emotion, ...others]) };
  });
}

export default function Game14Emotion({ onBack, onHome }) {
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const rounds = useMemo(() => buildRounds(), [replayKey]);
  const round = rounds[roundIndex];

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    const timer = setTimeout(() => speak(round.emotion.question), 400);
    return () => clearTimeout(timer);
  }, [roundIndex, round, speak]);

  const handlePick = async (emotion) => {
    if (locked) return;
    playTap();

    if (emotion.id === round.emotion.id) {
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
        color="#F39C12"
        message="Bé hiểu cảm xúc giỏi lắm!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-emotion" style={{ '--screen-bg': BG }}>
      <GameHeader onBack={onBack} title="😊 Cảm xúc" progress={`${roundIndex + 1}/${rounds.length}`} />
      <p className="game-hint">{round.emotion.question}</p>
      <div className="game-emotion__display">
        <span className="game-emotion__face">{round.emotion.emoji}</span>
      </div>
      <div className="game-emotion__options">
        {round.options.map((e) => (
          <button
            key={e.id}
            type="button"
            className="emotion-btn"
            onClick={() => handlePick(e)}
            disabled={locked}
          >
            <span className="emotion-btn__emoji">{e.emoji}</span>
            <span className="emotion-btn__label">{e.label}</span>
          </button>
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

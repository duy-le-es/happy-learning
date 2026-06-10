import { useCallback, useEffect, useMemo, useState } from 'react';
import { FEEDBACK } from '../data/voice';
import { FEEDING_ROUNDS } from '../data/gameData';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

const BG = 'linear-gradient(135deg, #D35400 0%, #F39C12 100%)';

export default function Game11Feed({ onBack, onHome }) {
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const rounds = useMemo(
    () => shuffle(FEEDING_ROUNDS).slice(0, DEFAULT_ROUNDS),
    [replayKey],
  );
  const round = rounds[roundIndex];

  const readQuestion = useCallback(() => {
    speak(`${round.animalName} ăn gì nhỉ?`);
  }, [speak, round]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    setSelectedFood(null);
    const timer = setTimeout(readQuestion, 400);
    return () => clearTimeout(timer);
  }, [roundIndex, readQuestion]);

  const handleFoodTap = (food) => {
    if (locked) return;
    playTap();
    setSelectedFood(food);
  };

  const handleAnimalTap = async () => {
    if (locked || !selectedFood) return;
    playTap();

    if (selectedFood === round.correct) {
      await handleCorrect(() => {
        if (roundIndex + 1 >= rounds.length) setIsFinished(true);
        else setRoundIndex((i) => i + 1);
      });
    } else {
      await handleWrong(() => setSelectedFood(null));
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        bgGradient={BG}
        color="#D35400"
        message="Bé biết cho thú ăn rồi!"
        onReplay={() => { setRoundIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-feed" style={{ '--screen-bg': BG }}>
      <GameHeader onBack={onBack} title="🍽️ Ai ăn gì" progress={`${roundIndex + 1}/${rounds.length}`} />
      <p className="game-hint">Chọn thức ăn, rồi chạm con vật!</p>
      <button
        type="button"
        className={`feed-animal ${selectedFood ? 'feed-animal--ready' : ''}`}
        onClick={handleAnimalTap}
        disabled={locked || !selectedFood}
      >
        <span className="feed-animal__emoji">{round.animal}</span>
        <span className="feed-animal__name">{round.animalName}</span>
      </button>
      <div className="game-feed__foods">
        {round.options.map((food) => (
          <button
            key={food}
            type="button"
            className={`feed-food ${selectedFood === food ? 'feed-food--selected' : ''}`}
            onClick={() => handleFoodTap(food)}
            disabled={locked}
          >
            {food}
          </button>
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

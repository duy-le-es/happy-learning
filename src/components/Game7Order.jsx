import { useCallback, useEffect, useMemo, useState } from 'react';
import { FEEDBACK } from '../data/voice';
import { ORDER_SEQUENCES } from '../data/gameData';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

const BG = 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)';

export default function Game7Order({ onBack, onHome }) {
  const { speak, preload, playTap, showCelebration, locked, handleCorrect, handleWrong } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [seqIndex, setSeqIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [slots, setSlots] = useState([null, null, null]);
  const [pool, setPool] = useState([]);
  const [selected, setSelected] = useState(null);

  const sequences = useMemo(
    () => shuffle(ORDER_SEQUENCES).slice(0, DEFAULT_ROUNDS),
    [replayKey],
  );
  const seq = sequences[seqIndex];

  const initRound = useCallback(() => {
    const indices = seq.emojis.map((_, i) => i);
    setSlots([null, null, null]);
    setPool(shuffle(indices));
    setSelected(null);
  }, [seq]);

  useEffect(() => { preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]); }, [preload]);
  useEffect(() => {
    initRound();
    const timer = setTimeout(() => speak(seq.question), 400);
    return () => clearTimeout(timer);
  }, [seqIndex, seq, speak, initRound]);

  const checkWin = async (newSlots) => {
    const won = newSlots.every((s, i) => s === i);
    if (won) {
      await handleCorrect(() => {
        if (seqIndex + 1 >= sequences.length) setIsFinished(true);
        else setSeqIndex((i) => i + 1);
      });
    }
  };

  const handlePoolTap = (idx) => {
    if (locked) return;
    playTap();
    setSelected(idx);
  };

  const handleSlotTap = async (slotIdx) => {
    if (locked || selected == null) return;
    playTap();
    const newSlots = [...slots];
    newSlots[slotIdx] = selected;
    const newPool = pool.filter((p) => p !== selected);
    setSlots(newSlots);
    setPool(newPool);
    setSelected(null);

    if (newPool.length === 0) {
      const correct = newSlots.every((s, i) => s === i);
      if (correct) await checkWin(newSlots);
      else await handleWrong(() => initRound());
    }
  };

  if (isFinished) {
    return (
      <GameFinish
        bgGradient={BG}
        color="#27AE60"
        message="Bé xếp thứ tự giỏi lắm!"
        onReplay={() => { setSeqIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-order" style={{ '--screen-bg': BG }}>
      <GameHeader onBack={onBack} title={`🔀 ${seq.title}`} progress={`${seqIndex + 1}/${sequences.length}`} />
      <p className="game-hint">{seq.question}</p>
      <div className="game-order__slots">
        {slots.map((slot, i) => (
          <button
            key={i}
            type="button"
            className={`order-slot ${slot != null ? 'order-slot--filled' : ''}`}
            onClick={() => handleSlotTap(i)}
            disabled={locked || selected == null}
          >
            {slot != null ? <span className="order-slot__emoji">{seq.emojis[slot]}</span> : <span className="order-slot__num">{i + 1}</span>}
          </button>
        ))}
      </div>
      <div className="game-order__pool">
        {pool.map((idx) => (
          <button
            key={idx}
            type="button"
            className={`order-piece ${selected === idx ? 'order-piece--selected' : ''}`}
            onClick={() => handlePoolTap(idx)}
            disabled={locked}
          >
            <span className="order-piece__emoji">{seq.emojis[idx]}</span>
          </button>
        ))}
      </div>
      <Celebration show={showCelebration} />
    </div>
  );
}

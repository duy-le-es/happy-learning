import { useEffect } from 'react';
import { FEEDBACK } from '../data/voice';
import GameHeader from './GameHeader';
import GameFinish from './GameFinish';
import ItemDisplay from './ItemDisplay';
import Celebration from './Celebration';
import { useGameFeedback } from '../hooks/useGameFeedback';

export default function SpeakPracticeLayout({
  topicId,
  topic,
  title,
  hint,
  promptText,
  item,
  index,
  total,
  phase,
  onListen,
  onSpeakTry,
  onReveal,
  onBack,
  onHome,
  isFinished,
  onReplay,
  finishMessage,
  children,
}) {
  const { preload, showCelebration, celebrate } = useGameFeedback();

  useEffect(() => {
    preload([FEEDBACK.correct.audio]);
  }, [preload]);

  const handleSpeakTry = async () => {
    await celebrate();
    onSpeakTry();
  };

  if (isFinished) {
    return (
      <GameFinish
        topicId={topicId}
        message={finishMessage ?? 'Bé luyện nói giỏi lắm!'}
        onReplay={onReplay}
        onBack={onBack}
        onHome={onHome}
        replayLabel="Luyện lại"
      />
    );
  }

  return (
    <div className="screen game-speak" style={{ '--screen-bg': topic.bgGradient }}>
      <GameHeader
        onBack={onBack}
        title={`${topic.emoji} ${title}`}
        progress={`${index + 1}/${total}`}
      />

      <p className="game-hint">{hint}</p>

      <div className="speak-card">
        {children ?? (
          <>
            <div className={`speak-card__visual ${phase === 'hidden' ? 'speak-card__visual--hidden' : ''}`}>
              {phase === 'hidden' ? (
                <span className="speak-card__mystery">❓</span>
              ) : (
                <ItemDisplay item={item} size="large" />
              )}
            </div>
            {phase !== 'hidden' && (
              <p className="speak-card__label">{promptText ?? item?.name}</p>
            )}
          </>
        )}
      </div>

      <div className="speak-actions">
        {phase === 'hidden' ? (
          <button type="button" className="speak-btn speak-btn--reveal" onClick={onReveal}>
            <span className="speak-btn__emoji">👀</span>
            <span className="speak-btn__label">Mở ra!</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              className="speak-btn speak-btn--listen"
              onClick={() => onListen?.()}
            >
              <span className="speak-btn__emoji">🔊</span>
              <span className="speak-btn__label">Nghe lại</span>
            </button>
            <button type="button" className="speak-btn speak-btn--try" onClick={handleSpeakTry}>
              <span className="speak-btn__emoji">🎤</span>
              <span className="speak-btn__label">Bé nói thử!</span>
            </button>
          </>
        )}
      </div>

      <p className="speak-tip">💡 Bố mẹ ngồi cạnh, khuyến khích bé nói to nhé!</p>

      <Celebration show={showCelebration} />
    </div>
  );
}

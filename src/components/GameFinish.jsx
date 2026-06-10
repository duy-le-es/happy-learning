import FinishScreen from './FinishScreen';
import { getTopicById } from '../data/topics';

const DEFAULT_GRADIENT = 'linear-gradient(160deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

export default function GameFinish({
  topicId,
  bgGradient = DEFAULT_GRADIENT,
  color = '#6C63FF',
  message,
  onReplay,
  onBack,
  onHome,
  replayLabel,
}) {
  const topic = topicId ? getTopicById(topicId) : null;

  if (topic) {
    return (
      <FinishScreen
        topic={topic}
        message={message}
        onReplay={onReplay}
        onBack={onBack}
        onHome={onHome}
        replayLabel={replayLabel}
      />
    );
  }

  return (
    <div className="screen finish-screen" style={{ '--screen-bg': bgGradient }}>
      <div className="finish-screen__content">
        <span className="finish-screen__emoji">🏆</span>
        <h2 className="finish-screen__title">Giỏi quá!</h2>
        <p className="finish-screen__text">{message ?? 'Bé chơi giỏi lắm!'}</p>
        <div className="finish-screen__actions">
          <button
            type="button"
            className="big-button"
            style={{ '--btn-color': color }}
            onClick={onReplay}
          >
            <span className="big-button__emoji">🔄</span>
            <span className="big-button__label">{replayLabel ?? 'Chơi lại'}</span>
          </button>
          <button
            type="button"
            className="big-button"
            style={{ '--btn-color': '#6C63FF' }}
            onClick={onBack}
          >
            <span className="big-button__emoji">📚</span>
            <span className="big-button__label">Chọn trò khác</span>
          </button>
          <button
            type="button"
            className="big-button"
            style={{ '--btn-color': '#00B894' }}
            onClick={onHome}
          >
            <span className="big-button__emoji">🏠</span>
            <span className="big-button__label">Về trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

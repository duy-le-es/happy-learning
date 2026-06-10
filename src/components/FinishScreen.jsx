import BigButton from './BigButton';

export default function FinishScreen({
  topic,
  message,
  onReplay,
  onBack,
  onHome,
  replayLabel = 'Chơi lại',
}) {
  return (
    <div className="screen finish-screen" style={{ '--screen-bg': topic.bgGradient }}>
      <div className="finish-screen__content">
        <span className="finish-screen__emoji">🏆</span>
        <h2 className="finish-screen__title">Giỏi quá!</h2>
        <p className="finish-screen__text">
          {message ?? `Bé đã hoàn thành chủ đề ${topic.name}!`}
        </p>
        <div className="finish-screen__actions">
          <BigButton emoji="🔄" color={topic.color} onClick={onReplay}>
            {replayLabel}
          </BigButton>
          <BigButton emoji="📚" color="#6C63FF" onClick={onBack}>
            Chọn chủ đề khác
          </BigButton>
          <BigButton emoji="🏠" color="#00B894" onClick={onHome}>
            Về trang chủ
          </BigButton>
        </div>
      </div>
    </div>
  );
}

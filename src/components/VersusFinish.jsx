import BigButton from './BigButton';

export default function VersusFinish({
  scores,
  topic,
  bgGradient = 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  onReplay,
  onBack,
  onHome,
}) {
  const gradient = topic?.bgGradient ?? bgGradient;
  const accent = topic?.color ?? '#6C5CE7';
  const p1 = scores[1];
  const p2 = scores[2];
  let message;
  let emoji;

  if (p1 > p2) {
    message = `Bé 1 thắng ${p1} – ${p2}!`;
    emoji = '🥇';
  } else if (p2 > p1) {
    message = `Bé 2 thắng ${p2} – ${p1}!`;
    emoji = '🥇';
  } else {
    message = `Hòa nhau ${p1} – ${p2}!`;
    emoji = '🤝';
  }

  return (
    <div className="screen versus-finish" style={{ '--screen-bg': gradient }}>
      <div className="versus-finish__content">
        <span className="versus-finish__emoji">{emoji}</span>
        <h2 className="versus-finish__title">Hết trận!</h2>
        <p className="versus-finish__message">{message}</p>
        <div className="versus-finish__scores">
          <div className="versus-finish__player versus-finish__player--p1">
            <span>Bé 1</span>
            <strong>{p1}</strong>
          </div>
          <span className="versus-finish__vs">VS</span>
          <div className="versus-finish__player versus-finish__player--p2">
            <span>Bé 2</span>
            <strong>{p2}</strong>
          </div>
        </div>
        <div className="finish-screen__actions">
          <BigButton emoji="🔄" color={accent} onClick={onReplay}>
            Chơi lại
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

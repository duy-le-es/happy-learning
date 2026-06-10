export function VersusPlayerHeader({ playerId, score }) {
  const colorClass = playerId === 1 ? 'versus-panel--p1' : 'versus-panel--p2';
  return (
    <div className={`versus-panel__header ${colorClass}`}>
      <span className="versus-panel__name">Bé {playerId}</span>
      <span className="versus-panel__score">{score} điểm</span>
    </div>
  );
}

export default function VersusShell({
  title,
  roundLabel,
  scores,
  roundWinner,
  onBack,
  center,
  panelTop,
  panelBottom,
  bgGradient,
}) {
  return (
    <div className="screen game-versus" style={{ '--screen-bg': bgGradient }}>
      <div className="versus-topbar">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <span className="versus-topbar__title">{title}</span>
        <span className="versus-topbar__round">{roundLabel}</span>
      </div>

      <div className="versus-panel versus-panel--p2 versus-panel--rotated">
        <VersusPlayerHeader playerId={2} score={scores[2]} />
        <div className="versus-panel__body">{panelTop}</div>
      </div>

      <div className="versus-center">
        {roundWinner && (
          <p className="versus-center__flash">⚡ Bé {roundWinner} nhanh hơn!</p>
        )}
        {center}
        <div className="versus-center__scores">
          <span className="versus-center__p1">{scores[1]}</span>
          <span className="versus-center__vs">VS</span>
          <span className="versus-center__p2">{scores[2]}</span>
        </div>
      </div>

      <div className="versus-panel versus-panel--p1">
        <VersusPlayerHeader playerId={1} score={scores[1]} />
        <div className="versus-panel__body">{panelBottom}</div>
      </div>
    </div>
  );
}

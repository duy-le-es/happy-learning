export default function GameHeader({ onBack, title, progress, light = true }) {
  return (
    <header className={`screen-header ${light ? 'screen-header--light' : ''}`}>
      <button
        type="button"
        className={`back-button ${light ? 'back-button--light' : ''}`}
        onClick={onBack}
        aria-label="Quay lại"
      >
        ⬅️
      </button>
      <span className="screen-header__topic">{title}</span>
      {progress != null && (
        <span className="screen-header__progress">{progress}</span>
      )}
    </header>
  );
}

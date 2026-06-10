import { unlockAudio } from '../utils/audioUnlock';

export default function BigButton({ children, onClick, color, emoji, subtitle, disabled, size = 'large' }) {
  const handleClick = (event) => {
    unlockAudio();
    onClick?.(event);
  };

  return (
    <button
      type="button"
      className={`big-button big-button--${size}`}
      style={{ '--btn-color': color }}
      onClick={handleClick}
      disabled={disabled}
    >
      {emoji && <span className="big-button__emoji">{emoji}</span>}
      <span className="big-button__label">{children}</span>
      {subtitle && <span className="big-button__subtitle">{subtitle}</span>}
    </button>
  );
}

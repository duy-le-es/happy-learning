export default function BigButton({ children, onClick, color, emoji, subtitle, disabled, size = 'large' }) {
  return (
    <button
      type="button"
      className={`big-button big-button--${size}`}
      style={{ '--btn-color': color }}
      onClick={onClick}
      disabled={disabled}
    >
      {emoji && <span className="big-button__emoji">{emoji}</span>}
      <span className="big-button__label">{children}</span>
      {subtitle && <span className="big-button__subtitle">{subtitle}</span>}
    </button>
  );
}

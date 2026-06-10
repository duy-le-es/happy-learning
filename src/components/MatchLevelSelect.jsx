import BigButton from './BigButton';

export const MATCH_LEVELS = [
  { id: 1, pairs: 4, label: 'Dễ', emoji: '🌱', subtitle: '4 cặp' },
  { id: 2, pairs: 6, label: 'Vừa', emoji: '🌿', subtitle: '6 cặp' },
  { id: 3, pairs: 8, label: 'Khó', emoji: '🌳', subtitle: '8 cặp' },
];

export default function MatchLevelSelect({ topic, onSelectLevel, onBack }) {
  return (
    <div className="screen level-select" style={{ '--screen-bg': topic.bgGradient }}>
      <header className="screen-header screen-header--light">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <h2 className="screen-header__title">{topic.emoji} Chọn mức</h2>
      </header>

      <div className="level-select__options">
        {MATCH_LEVELS.map((level) => (
          <BigButton
            key={level.id}
            emoji={level.emoji}
            color={topic.color}
            subtitle={level.subtitle}
            onClick={() => onSelectLevel(level.pairs)}
          >
            {level.label}
          </BigButton>
        ))}
      </div>
    </div>
  );
}

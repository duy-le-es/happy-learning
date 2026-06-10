import { topics } from '../data/topics';
import BigButton from './BigButton';

export default function TopicSelect({ gameTitle, onSelectTopic, onBack }) {
  return (
    <div className="screen topic-select">
      <header className="screen-header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <div className="screen-header__titles">
          <h2 className="screen-header__title">Chọn chủ đề</h2>
          {gameTitle && <p className="screen-header__game">{gameTitle}</p>}
        </div>
      </header>

      <div className="topic-select__grid">
        {topics.map((topic) => (
          <div key={topic.id}>
            <BigButton
              emoji={topic.emoji}
              color={topic.color}
              size="medium"
              onClick={() => onSelectTopic(topic.id)}
            >
              {topic.name}
            </BigButton>
          </div>
        ))}
      </div>
    </div>
  );
}

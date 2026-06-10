import BigButton from './BigButton';
import { PLAYER_MODES } from '../constants/games';

export default function ModeSelect({ onSelectMode }) {
  return (
    <div className="screen home-screen mode-select">
      <div className="home-screen__header">
        <span className="home-screen__logo">🌈</span>
        <h1 className="home-screen__title">Bé Học Thông Minh</h1>
        <p className="home-screen__subtitle">Chọn cách chơi nhé!</p>
      </div>

      <div className="mode-select__options">
        <BigButton
          emoji="🧒"
          color="#6C63FF"
          onClick={() => onSelectMode(PLAYER_MODES.SINGLE)}
        >
          1 người chơi
        </BigButton>
        <BigButton
          emoji="👫"
          color="#E74C3C"
          onClick={() => onSelectMode(PLAYER_MODES.MULTI)}
        >
          2 người chơi
        </BigButton>
      </div>
    </div>
  );
}

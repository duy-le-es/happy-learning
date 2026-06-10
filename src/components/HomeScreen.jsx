import BigButton from './BigButton';
import { GAMES } from '../constants/games';

export default function HomeScreen({ onSelectGame }) {
  return (
    <div className="screen home-screen">
      <div className="home-screen__header">
        <span className="home-screen__logo">🌈</span>
        <h1 className="home-screen__title">Bé Học Thông Minh</h1>
        <p className="home-screen__subtitle">Chọn trò chơi nhé!</p>
      </div>

      <div className="home-screen__games">
        <BigButton
          emoji="👆"
          color="#6C63FF"
          onClick={() => onSelectGame(GAMES.QUIZ)}
        >
          Chọn hình đúng
        </BigButton>

        <BigButton
          emoji="🃏"
          color="#FF6B6B"
          onClick={() => onSelectGame(GAMES.MATCH)}
        >
          Tìm cặp giống nhau
        </BigButton>

        <BigButton
          emoji="🎯"
          color="#00B894"
          onClick={() => onSelectGame(GAMES.DRAG)}
        >
          Kéo thả đúng chỗ
        </BigButton>
      </div>
    </div>
  );
}

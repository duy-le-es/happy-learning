import BigButton from './BigButton';
import { GAME_LIST, GAME_TITLES } from '../constants/games';

export default function HomeScreen({ onSelectGame }) {
  return (
    <div className="screen home-screen">
      <div className="home-screen__header">
        <span className="home-screen__logo">🌈</span>
        <h1 className="home-screen__title">Bé Học Thông Minh</h1>
        <p className="home-screen__subtitle">Chọn trò chơi nhé!</p>
      </div>

      <div className="home-screen__games">
        {GAME_LIST.map((game) => (
          <BigButton
            key={game.id}
            emoji={game.emoji}
            color={game.color}
            onClick={() => onSelectGame(game.id)}
          >
            {GAME_TITLES[game.id]}
          </BigButton>
        ))}
      </div>
    </div>
  );
}

import BigButton from './BigButton';
import {
  GAME_TITLES,
  MULTI_PLAYER_LIST,
  PLAYER_MODES,
  SINGLE_PLAYER_LIST,
} from '../constants/games';

export default function GameListScreen({ playerMode, onSelectGame, onBack }) {
  const games = playerMode === PLAYER_MODES.MULTI ? MULTI_PLAYER_LIST : SINGLE_PLAYER_LIST;
  const subtitle = playerMode === PLAYER_MODES.MULTI
    ? 'Ai nhanh hơn sẽ thắng!'
    : 'Chọn trò chơi nhé!';

  return (
    <div className="screen home-screen">
      <header className="game-list__header">
        <button type="button" className="back-button back-button--light" onClick={onBack} aria-label="Quay lại">
          ⬅️
        </button>
        <div className="game-list__titles">
          <h2 className="game-list__title">
            {playerMode === PLAYER_MODES.MULTI ? '👫 2 người' : '🧒 1 người'}
          </h2>
          <p className="game-list__subtitle">{subtitle}</p>
        </div>
      </header>

      <div className="home-screen__games">
        {games.map((game) => (
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

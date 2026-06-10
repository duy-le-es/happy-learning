import { useState } from 'react';
import { getTopicById } from './data/topics';
import { GAMES, GAME_TITLES } from './constants/games';
import { unlockAudio } from './utils/audioUnlock';
import { enterFullscreen } from './utils/fullscreen';
import HomeScreen from './components/HomeScreen';
import TopicSelect from './components/TopicSelect';
import MatchLevelSelect from './components/MatchLevelSelect';
import Game2Quiz from './components/Game2Quiz';
import Game1Match from './components/Game1Match';
import Game3DragDrop from './components/Game3DragDrop';

const SCREENS = {
  HOME: 'home',
  TOPICS: 'topics',
  MATCH_LEVEL: 'matchLevel',
  PLAY: 'play',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [matchPairCount, setMatchPairCount] = useState(4);

  const goHome = () => {
    setScreen(SCREENS.HOME);
    setSelectedGame(null);
    setSelectedTopic(null);
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setScreen(SCREENS.TOPICS);
  };

  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
    if (selectedGame === GAMES.MATCH) {
      setScreen(SCREENS.MATCH_LEVEL);
    } else {
      setScreen(SCREENS.PLAY);
    }
  };

  const handleSelectMatchLevel = (pairs) => {
    setMatchPairCount(pairs);
    setScreen(SCREENS.PLAY);
  };

  const handleBackFromPlay = () => {
    if (selectedGame === GAMES.MATCH) {
      setScreen(SCREENS.MATCH_LEVEL);
    } else {
      setScreen(SCREENS.TOPICS);
    }
  };

  const handleBackFromLevel = () => {
    setScreen(SCREENS.TOPICS);
  };

  const handlePointerDown = () => {
    unlockAudio();
    enterFullscreen();
  };

  const topic = selectedTopic ? getTopicById(selectedTopic) : null;

  return (
    <div className="app" onPointerDown={handlePointerDown}>
      {screen === SCREENS.HOME && (
        <HomeScreen onSelectGame={handleSelectGame} />
      )}
      {screen === SCREENS.TOPICS && selectedGame && (
        <TopicSelect
          gameTitle={GAME_TITLES[selectedGame]}
          onSelectTopic={handleSelectTopic}
          onBack={goHome}
        />
      )}
      {screen === SCREENS.MATCH_LEVEL && topic && (
        <MatchLevelSelect
          topic={topic}
          onSelectLevel={handleSelectMatchLevel}
          onBack={handleBackFromLevel}
        />
      )}
      {screen === SCREENS.PLAY && selectedTopic && selectedGame === GAMES.QUIZ && (
        <Game2Quiz
          topicId={selectedTopic}
          onBack={() => setScreen(SCREENS.TOPICS)}
          onHome={goHome}
        />
      )}
      {screen === SCREENS.PLAY && selectedTopic && selectedGame === GAMES.MATCH && (
        <Game1Match
          topicId={selectedTopic}
          pairCount={matchPairCount}
          onBack={handleBackFromPlay}
          onHome={goHome}
        />
      )}
      {screen === SCREENS.PLAY && selectedTopic && selectedGame === GAMES.DRAG && (
        <Game3DragDrop
          topicId={selectedTopic}
          onBack={() => setScreen(SCREENS.TOPICS)}
          onHome={goHome}
        />
      )}
    </div>
  );
}

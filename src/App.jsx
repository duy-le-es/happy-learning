import { useState } from 'react';
import { getTopicById } from './data/topics';
import {
  GAMES,
  GAME_TITLES,
  STANDALONE_GAMES,
  MATCH_LEVEL_GAMES,
} from './constants/games';
import HomeScreen from './components/HomeScreen';
import TopicSelect from './components/TopicSelect';
import MatchLevelSelect from './components/MatchLevelSelect';
import Game2Quiz from './components/Game2Quiz';
import Game1Match from './components/Game1Match';
import Game3DragDrop from './components/Game3DragDrop';
import Game4Count from './components/Game4Count';
import Game5Bigger from './components/Game5Bigger';
import Game6SameDiff from './components/Game6SameDiff';
import Game7Order from './components/Game7Order';
import Game8SoundGuess from './components/Game8SoundGuess';
import Game9ColorFill from './components/Game9ColorFill';
import Game10Shadow from './components/Game10Shadow';
import Game11Feed from './components/Game11Feed';
import Game12ColorMatch from './components/Game12ColorMatch';
import Game13Catch from './components/Game13Catch';
import Game14Emotion from './components/Game14Emotion';
import Game15Puzzle from './components/Game15Puzzle';
import Game16Trace from './components/Game16Trace';

const SCREENS = {
  HOME: 'home',
  TOPICS: 'topics',
  MATCH_LEVEL: 'matchLevel',
  PLAY: 'play',
};

const TOPIC_GAMES = {
  [GAMES.QUIZ]: Game2Quiz,
  [GAMES.MATCH]: Game1Match,
  [GAMES.DRAG]: Game3DragDrop,
  [GAMES.COUNT]: Game4Count,
  [GAMES.BIGGER]: Game5Bigger,
  [GAMES.SAME_DIFF]: Game6SameDiff,
  [GAMES.SOUND_GUESS]: Game8SoundGuess,
  [GAMES.COLOR_FILL]: Game9ColorFill,
  [GAMES.SHADOW]: Game10Shadow,
  [GAMES.CATCH]: Game13Catch,
  [GAMES.PUZZLE]: Game15Puzzle,
};

const STANDALONE_COMPONENTS = {
  [GAMES.ORDER]: Game7Order,
  [GAMES.FEED]: Game11Feed,
  [GAMES.COLOR_MATCH]: Game12ColorMatch,
  [GAMES.EMOTION]: Game14Emotion,
  [GAMES.TRACE]: Game16Trace,
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

  const backToTopics = () => setScreen(SCREENS.TOPICS);

  const backFromPlay = () => {
    if (STANDALONE_GAMES.has(selectedGame)) {
      goHome();
    } else if (MATCH_LEVEL_GAMES.has(selectedGame)) {
      setScreen(SCREENS.MATCH_LEVEL);
    } else {
      setScreen(SCREENS.TOPICS);
    }
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    if (STANDALONE_GAMES.has(game)) {
      setScreen(SCREENS.PLAY);
    } else {
      setScreen(SCREENS.TOPICS);
    }
  };

  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
    if (MATCH_LEVEL_GAMES.has(selectedGame)) {
      setScreen(SCREENS.MATCH_LEVEL);
    } else {
      setScreen(SCREENS.PLAY);
    }
  };

  const handleSelectMatchLevel = (pairs) => {
    setMatchPairCount(pairs);
    setScreen(SCREENS.PLAY);
  };

  const topic = selectedTopic ? getTopicById(selectedTopic) : null;

  const renderPlayScreen = () => {
    if (!selectedGame) return null;

    const commonProps = {
      onBack: backFromPlay,
      onHome: goHome,
    };

    if (STANDALONE_COMPONENTS[selectedGame]) {
      const Standalone = STANDALONE_COMPONENTS[selectedGame];
      return <Standalone {...commonProps} />;
    }

    if (!selectedTopic) return null;

    if (selectedGame === GAMES.MATCH) {
      return (
        <Game1Match
          topicId={selectedTopic}
          pairCount={matchPairCount}
          onBack={backFromPlay}
          onHome={goHome}
        />
      );
    }

    const TopicGame = TOPIC_GAMES[selectedGame];
    if (!TopicGame) return null;

    return <TopicGame topicId={selectedTopic} {...commonProps} />;
  };

  return (
    <div className="app">
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
          onBack={backToTopics}
        />
      )}
      {screen === SCREENS.PLAY && renderPlayScreen()}
    </div>
  );
}

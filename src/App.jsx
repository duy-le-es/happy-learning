import { useState } from 'react';
import { getTopicById } from './data/topics';
import {
  GAME_TITLES,
  isVersusGame,
  MATCH_LEVEL_GAMES,
  needsTopic,
  PLAYER_MODES,
  STANDALONE_GAMES,
  VERSUS_STANDALONE,
} from './constants/games';
import ModeSelect from './components/ModeSelect';
import GameListScreen from './components/GameListScreen';
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
import Game17SpeakRepeat from './components/Game17SpeakRepeat';
import Game18SpeakAnimal from './components/Game18SpeakAnimal';
import Game19SpeakWho from './components/Game19SpeakWho';
import Game20SpeakSlow from './components/Game20SpeakSlow';
import Game21SpeakSentence from './components/Game21SpeakSentence';
import GameVersus from './components/GameVersus';

const SCREENS = {
  HOME: 'home',
  GAMES: 'games',
  TOPICS: 'topics',
  MATCH_LEVEL: 'matchLevel',
  PLAY: 'play',
};

const TOPIC_GAMES = {
  quiz: Game2Quiz,
  match: Game1Match,
  drag: Game3DragDrop,
  count: Game4Count,
  bigger: Game5Bigger,
  sameDiff: Game6SameDiff,
  soundGuess: Game8SoundGuess,
  colorFill: Game9ColorFill,
  shadow: Game10Shadow,
  catch: Game13Catch,
  puzzle: Game15Puzzle,
  speakRepeat: Game17SpeakRepeat,
  speakAnimal: Game18SpeakAnimal,
  speakWho: Game19SpeakWho,
  speakSlow: Game20SpeakSlow,
  speakSentence: Game21SpeakSentence,
};

const STANDALONE_COMPONENTS = {
  order: Game7Order,
  feed: Game11Feed,
  colorMatch: Game12ColorMatch,
  emotion: Game14Emotion,
  trace: Game16Trace,
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [playerMode, setPlayerMode] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [matchPairCount, setMatchPairCount] = useState(4);

  const goHome = () => {
    setScreen(SCREENS.HOME);
    setPlayerMode(null);
    setSelectedGame(null);
    setSelectedTopic(null);
  };

  const backToGameList = () => {
    setScreen(SCREENS.GAMES);
    setSelectedGame(null);
    setSelectedTopic(null);
  };

  const backToTopics = () => setScreen(SCREENS.TOPICS);

  const backFromPlay = () => {
    if (isVersusGame(selectedGame)) {
      if (VERSUS_STANDALONE.has(selectedGame)) backToGameList();
      else backToTopics();
      return;
    }
    if (STANDALONE_GAMES.has(selectedGame)) {
      backToGameList();
    } else if (MATCH_LEVEL_GAMES.has(selectedGame)) {
      setScreen(SCREENS.MATCH_LEVEL);
    } else {
      setScreen(SCREENS.TOPICS);
    }
  };

  const handleSelectMode = (mode) => {
    setPlayerMode(mode);
    setScreen(SCREENS.GAMES);
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    if (needsTopic(game)) {
      setScreen(SCREENS.TOPICS);
    } else {
      setScreen(SCREENS.PLAY);
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

    if (isVersusGame(selectedGame)) {
      return (
        <GameVersus
          mode={selectedGame}
          topicId={selectedTopic}
          {...commonProps}
        />
      );
    }

    if (STANDALONE_COMPONENTS[selectedGame]) {
      const Standalone = STANDALONE_COMPONENTS[selectedGame];
      return <Standalone {...commonProps} />;
    }

    if (!selectedTopic) return null;

    if (selectedGame === 'match') {
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
        <ModeSelect onSelectMode={handleSelectMode} />
      )}
      {screen === SCREENS.GAMES && playerMode && (
        <GameListScreen
          playerMode={playerMode}
          onSelectGame={handleSelectGame}
          onBack={goHome}
        />
      )}
      {screen === SCREENS.TOPICS && selectedGame && (
        <TopicSelect
          gameTitle={GAME_TITLES[selectedGame]}
          onSelectTopic={handleSelectTopic}
          onBack={backToGameList}
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

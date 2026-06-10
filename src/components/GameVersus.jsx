import { useCallback, useEffect, useMemo } from 'react';
import { getTopicById } from '../data/topics';
import { BASIC_COLORS } from '../data/gameData';
import { FEEDBACK, questionAudio } from '../data/voice';
import { VERSUS_GAMES } from '../constants/games';
import { pickOptions, shuffle } from '../utils/shuffle';
import { useGameFeedback } from '../hooks/useGameFeedback';
import { useVersusRound, VERSUS_ROUNDS } from '../hooks/useVersusRound';
import ItemDisplay from './ItemDisplay';
import VersusShell from './VersusShell';
import VersusFinish from './VersusFinish';

const NUMBERS = [1, 2, 3, 4, 5];
const COLOR_BG = 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)';

function OptionGrid({ options, player, states, disabled, onSelect }) {
  return (
    <div className="versus-panel__options">
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`versus-option ${states[item.id] ? `versus-option--${states[item.id]}` : ''}`}
          onClick={() => onSelect(player, item)}
          disabled={disabled}
        >
          <ItemDisplay item={item} size="medium" />
        </button>
      ))}
    </div>
  );
}

function NumberGrid({ player, states, disabled, onSelect }) {
  return (
    <div className="versus-panel__numbers">
      {NUMBERS.map((num) => (
        <button
          key={num}
          type="button"
          className={`versus-num ${states[num] ? `versus-num--${states[num]}` : ''}`}
          onClick={() => onSelect(player, num)}
          disabled={disabled}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

function BiggerGrid({ item, player, states, disabled, bigSide, onSelect }) {
  const leftSize = bigSide === 'left' ? 'large' : 'small';
  const rightSize = bigSide === 'right' ? 'large' : 'small';

  return (
    <div className="versus-panel__bigger">
      <button
        type="button"
        className={`versus-bigger-btn ${states.left ? `versus-bigger-btn--${states.left}` : ''}`}
        onClick={() => onSelect(player, 'left')}
        disabled={disabled}
      >
        <ItemDisplay item={item} size={leftSize} />
      </button>
      <button
        type="button"
        className={`versus-bigger-btn ${states.right ? `versus-bigger-btn--${states.right}` : ''}`}
        onClick={() => onSelect(player, 'right')}
        disabled={disabled}
      >
        <ItemDisplay item={item} size={rightSize} />
      </button>
    </div>
  );
}

function ColorGrid({ options, player, states, disabled, onSelect }) {
  return (
    <div className="versus-panel__colors">
      {options.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`color-swatch color-swatch--versus ${states[c.id] ? `versus-color--${states[c.id]}` : ''}`}
          style={{ backgroundColor: c.color }}
          onClick={() => onSelect(player, c)}
          disabled={disabled}
          aria-label={c.name}
        />
      ))}
    </div>
  );
}

function buildCountRounds(items) {
  return shuffle(items).slice(0, VERSUS_ROUNDS).map((item) => ({
    item,
    answer: Math.floor(Math.random() * 5) + 1,
  }));
}

function buildBiggerRounds(items) {
  return shuffle(items).slice(0, VERSUS_ROUNDS).map((item) => ({
    item,
    bigSide: Math.random() > 0.5 ? 'left' : 'right',
  }));
}

function buildColorRounds() {
  return shuffle(BASIC_COLORS).slice(0, VERSUS_ROUNDS).map((target) => {
    const others = shuffle(BASIC_COLORS.filter((c) => c.id !== target.id)).slice(0, 3);
    return { target, options: shuffle([target, ...others]) };
  });
}

export default function GameVersus({ mode, topicId, onBack, onHome }) {
  const topic = topicId ? getTopicById(topicId) : null;
  const { speak, stop, preload } = useGameFeedback();
  const bgGradient = topic?.bgGradient ?? COLOR_BG;

  const versus = useVersusRound({ totalRounds: VERSUS_ROUNDS });

  const roundsData = useMemo(() => {
    if (mode === VERSUS_GAMES.COLOR) return buildColorRounds();
    if (!topic) return [];
    if (mode === VERSUS_GAMES.COUNT) return buildCountRounds(topic.items);
    if (mode === VERSUS_GAMES.BIGGER) return buildBiggerRounds(topic.items);
    return shuffle(topic.items).slice(0, VERSUS_ROUNDS);
  }, [mode, topic, versus.replayKey]);

  const round = roundsData[versus.roundIndex];
  const currentItem = mode === VERSUS_GAMES.COUNT || mode === VERSUS_GAMES.BIGGER
    ? round?.item
    : mode === VERSUS_GAMES.COLOR
      ? null
      : round;

  const options = useMemo(() => {
    if (!currentItem || !topic) return [];
    if (mode === VERSUS_GAMES.QUIZ || mode === VERSUS_GAMES.SOUND || mode === VERSUS_GAMES.SHADOW) {
      return pickOptions(currentItem, topic.items, 3);
    }
    return [];
  }, [currentItem, topic, mode]);

  const colorRound = mode === VERSUS_GAMES.COLOR ? round : null;
  const countRound = mode === VERSUS_GAMES.COUNT ? round : null;
  const biggerRound = mode === VERSUS_GAMES.BIGGER ? round : null;

  const readQuestion = useCallback(() => {
    if (mode === VERSUS_GAMES.COLOR) {
      speak('Chọn đúng màu nhé!');
      return;
    }
    if (mode === VERSUS_GAMES.COUNT) {
      speak('Có mấy cái? Đếm nhé!');
      return;
    }
    if (mode === VERSUS_GAMES.BIGGER) {
      speak('Cái nào to hơn?');
      return;
    }
    if (currentItem) {
      speak(currentItem.question, { audioSrc: questionAudio(currentItem.id) });
    }
  }, [speak, mode, currentItem]);

  useEffect(() => {
    if (topic) {
      preload([
        ...topic.items.map((item) => questionAudio(item.id)),
        FEEDBACK.correct.audio,
        FEEDBACK.tryAgain.audio,
      ]);
    } else {
      preload([FEEDBACK.correct.audio, FEEDBACK.tryAgain.audio]);
    }
  }, [topic, preload]);

  useEffect(() => {
    versus.startRound();
    const timer = setTimeout(readQuestion, 500);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [versus.roundIndex, versus.replayKey, readQuestion, stop]);

  const handleItemAnswer = (player, item) => {
    versus.tryAnswer(player, item.id, item.id === currentItem?.id);
  };

  const handleNumberAnswer = (player, num) => {
    versus.tryAnswer(player, num, num === countRound?.answer);
  };

  const handleBiggerAnswer = (player, side) => {
    versus.tryAnswer(player, side, side === biggerRound?.bigSide);
  };

  const handleColorAnswer = (player, color) => {
    versus.tryAnswer(player, color.id, color.id === colorRound?.target.id);
  };

  const renderPanel = (player) => {
    const disabled = versus.roundLocked || versus.playerDisabled[player];
    const states = versus.playerStates[player];

    if (mode === VERSUS_GAMES.COUNT) {
      return (
        <NumberGrid
          player={player}
          states={states}
          disabled={disabled}
          onSelect={handleNumberAnswer}
        />
      );
    }
    if (mode === VERSUS_GAMES.BIGGER && biggerRound) {
      return (
        <BiggerGrid
          item={biggerRound.item}
          player={player}
          states={states}
          disabled={disabled}
          bigSide={biggerRound.bigSide}
          onSelect={handleBiggerAnswer}
        />
      );
    }
    if (mode === VERSUS_GAMES.COLOR) {
      return (
        <ColorGrid
          options={colorRound?.options ?? []}
          player={player}
          states={states}
          disabled={disabled}
          onSelect={handleColorAnswer}
        />
      );
    }
    return (
      <OptionGrid
        options={options}
        player={player}
        states={states}
        disabled={disabled}
        onSelect={handleItemAnswer}
      />
    );
  };

  if (versus.isFinished) {
    return (
      <VersusFinish
        scores={versus.scores}
        topic={topic}
        bgGradient={bgGradient}
        onReplay={versus.replay}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  const title = topic ? `${topic.emoji} 2 người đua` : '🌈 2 người đua';

  const center = (
    <>
      <button type="button" className="sound-button sound-button--small" onClick={readQuestion} aria-label="Nghe">
        <span className="sound-button__icon">🔊</span>
      </button>

      {mode === VERSUS_GAMES.COUNT && countRound && (
        <div className="versus-center__count">
          {Array.from({ length: countRound.answer }, (_, i) => (
            <div key={i} className="versus-center__count-item">
              <ItemDisplay item={countRound.item} size="small" />
            </div>
          ))}
        </div>
      )}

      {mode === VERSUS_GAMES.BIGGER && biggerRound && (
        <div className="versus-center__bigger-demo">
          <ItemDisplay item={biggerRound.item} size="medium" />
        </div>
      )}

      {mode === VERSUS_GAMES.SHADOW && currentItem && (
        <div className="versus-center__shadow">
          <div className="shadow-silhouette shadow-silhouette--small">
            <ItemDisplay item={currentItem} size="medium" />
          </div>
        </div>
      )}

      {mode === VERSUS_GAMES.COLOR && colorRound && (
        <div
          className="versus-center__color-target"
          style={{ backgroundColor: colorRound.target.color }}
        />
      )}

      <p className="versus-center__question">
        {mode === VERSUS_GAMES.SOUND && '👂 Nghe và chọn nhanh!'}
        {mode === VERSUS_GAMES.QUIZ && currentItem?.question}
        {mode === VERSUS_GAMES.SHADOW && 'Bóng này là gì?'}
        {mode === VERSUS_GAMES.COUNT && 'Có mấy cái?'}
        {mode === VERSUS_GAMES.BIGGER && 'Cái nào to hơn?'}
        {mode === VERSUS_GAMES.COLOR && 'Chọn đúng màu!'}
      </p>
    </>
  );

  return (
    <VersusShell
      title={title}
      roundLabel={`${versus.roundIndex + 1}/${VERSUS_ROUNDS}`}
      scores={versus.scores}
      roundWinner={versus.roundWinner}
      onBack={onBack}
      bgGradient={bgGradient}
      center={center}
      panelTop={renderPanel(2)}
      panelBottom={renderPanel(1)}
    />
  );
}

export const PLAYER_MODES = {
  SINGLE: 'single',
  MULTI: 'multi',
};

export const GAMES = {
  QUIZ: 'quiz',
  MATCH: 'match',
  DRAG: 'drag',
  COUNT: 'count',
  BIGGER: 'bigger',
  SAME_DIFF: 'sameDiff',
  ORDER: 'order',
  SOUND_GUESS: 'soundGuess',
  COLOR_FILL: 'colorFill',
  SHADOW: 'shadow',
  FEED: 'feed',
  COLOR_MATCH: 'colorMatch',
  CATCH: 'catch',
  EMOTION: 'emotion',
  PUZZLE: 'puzzle',
  TRACE: 'trace',
  SPEAK_REPEAT: 'speakRepeat',
  SPEAK_ANIMAL: 'speakAnimal',
  SPEAK_WHO: 'speakWho',
  SPEAK_SLOW: 'speakSlow',
  SPEAK_SENTENCE: 'speakSentence',
};

export const VERSUS_GAMES = {
  QUIZ: 'versusQuiz',
  SOUND: 'versusSound',
  COUNT: 'versusCount',
  BIGGER: 'versusBigger',
  SHADOW: 'versusShadow',
  COLOR: 'versusColor',
};

export const GAME_TITLES = {
  [GAMES.QUIZ]: 'Chọn hình đúng',
  [GAMES.MATCH]: 'Tìm cặp giống nhau',
  [GAMES.DRAG]: 'Kéo thả đúng chỗ',
  [GAMES.COUNT]: 'Đếm số',
  [GAMES.BIGGER]: 'Lớn hay nhỏ',
  [GAMES.SAME_DIFF]: 'Giống hay khác',
  [GAMES.ORDER]: 'Xếp thứ tự',
  [GAMES.SOUND_GUESS]: 'Nghe tiếng đoán',
  [GAMES.COLOR_FILL]: 'Tô màu',
  [GAMES.SHADOW]: 'Bóng đâu',
  [GAMES.FEED]: 'Ai ăn gì',
  [GAMES.COLOR_MATCH]: 'Chọn đúng màu',
  [GAMES.CATCH]: 'Bắt hình',
  [GAMES.EMOTION]: 'Cảm xúc',
  [GAMES.PUZZLE]: 'Ghép hình',
  [GAMES.TRACE]: 'Vẽ theo nét',
  [GAMES.SPEAK_REPEAT]: 'Nói theo',
  [GAMES.SPEAK_ANIMAL]: 'Con vật kêu',
  [GAMES.SPEAK_WHO]: 'Ai đây',
  [GAMES.SPEAK_SLOW]: 'Nói chậm',
  [GAMES.SPEAK_SENTENCE]: 'Nói câu ngắn',
  [VERSUS_GAMES.QUIZ]: 'Chọn hình đúng',
  [VERSUS_GAMES.SOUND]: 'Nghe tiếng đoán',
  [VERSUS_GAMES.COUNT]: 'Đếm số',
  [VERSUS_GAMES.BIGGER]: 'Lớn hay nhỏ',
  [VERSUS_GAMES.SHADOW]: 'Bóng đâu',
  [VERSUS_GAMES.COLOR]: 'Chọn đúng màu',
};

export const STANDALONE_GAMES = new Set([
  GAMES.ORDER,
  GAMES.FEED,
  GAMES.COLOR_MATCH,
  GAMES.EMOTION,
  GAMES.TRACE,
]);

export const VERSUS_STANDALONE = new Set([VERSUS_GAMES.COLOR]);

export const MATCH_LEVEL_GAMES = new Set([GAMES.MATCH]);

export const DEFAULT_ROUNDS = 6;

export const SINGLE_PLAYER_LIST = [
  { id: GAMES.SPEAK_REPEAT, emoji: '🎤', color: '#E84393' },
  { id: GAMES.SPEAK_ANIMAL, emoji: '🐶', color: '#FF6B6B' },
  { id: GAMES.SPEAK_WHO, emoji: '❓', color: '#6C5CE7' },
  { id: GAMES.SPEAK_SLOW, emoji: '🐢', color: '#00B894' },
  { id: GAMES.SPEAK_SENTENCE, emoji: '💬', color: '#F39C12' },
  { id: GAMES.QUIZ, emoji: '👆', color: '#6C63FF' },
  { id: GAMES.MATCH, emoji: '🃏', color: '#FF6B6B' },
  { id: GAMES.DRAG, emoji: '🎯', color: '#00B894' },
  { id: GAMES.COUNT, emoji: '🔢', color: '#F39C12' },
  { id: GAMES.BIGGER, emoji: '📏', color: '#9B59B6' },
  { id: GAMES.SAME_DIFF, emoji: '👯', color: '#3498DB' },
  { id: GAMES.ORDER, emoji: '🔀', color: '#27AE60' },
  { id: GAMES.SOUND_GUESS, emoji: '👂', color: '#E67E22' },
  { id: GAMES.COLOR_FILL, emoji: '🎨', color: '#E84393' },
  { id: GAMES.SHADOW, emoji: '👤', color: '#636E72' },
  { id: GAMES.FEED, emoji: '🍽️', color: '#D35400' },
  { id: GAMES.COLOR_MATCH, emoji: '🌈', color: '#6C5CE7' },
  { id: GAMES.CATCH, emoji: '🎈', color: '#00CEC9' },
  { id: GAMES.EMOTION, emoji: '😊', color: '#FDCB6E' },
  { id: GAMES.PUZZLE, emoji: '🧩', color: '#0984E3' },
  { id: GAMES.TRACE, emoji: '✏️', color: '#A29BFE' },
];

export const MULTI_PLAYER_LIST = [
  { id: VERSUS_GAMES.QUIZ, emoji: '👆', color: '#6C63FF' },
  { id: VERSUS_GAMES.SOUND, emoji: '👂', color: '#E67E22' },
  { id: VERSUS_GAMES.COUNT, emoji: '🔢', color: '#F39C12' },
  { id: VERSUS_GAMES.BIGGER, emoji: '📏', color: '#9B59B6' },
  { id: VERSUS_GAMES.SHADOW, emoji: '👤', color: '#636E72' },
  { id: VERSUS_GAMES.COLOR, emoji: '🌈', color: '#6C5CE7' },
];

const ALL_VERSUS = new Set(Object.values(VERSUS_GAMES));

export function isVersusGame(gameId) {
  return ALL_VERSUS.has(gameId);
}

export function needsTopic(gameId) {
  if (isVersusGame(gameId)) return !VERSUS_STANDALONE.has(gameId);
  return !STANDALONE_GAMES.has(gameId);
}

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
};

/** Trò chơi không cần chọn chủ đề */
export const STANDALONE_GAMES = new Set([
  GAMES.ORDER,
  GAMES.FEED,
  GAMES.COLOR_MATCH,
  GAMES.EMOTION,
  GAMES.TRACE,
]);

export const MATCH_LEVEL_GAMES = new Set([GAMES.MATCH]);

export const DEFAULT_ROUNDS = 6;

export const GAME_LIST = [
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

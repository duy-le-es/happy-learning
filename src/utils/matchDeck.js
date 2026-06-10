import { shuffle } from './shuffle';

export function buildMatchDeck(items, pairCount) {
  const selected = shuffle(items).slice(0, pairCount);
  const cards = selected.flatMap((item) => [
    { cardId: `${item.id}-a`, itemId: item.id, item },
    { cardId: `${item.id}-b`, itemId: item.id, item },
  ]);
  return shuffle(cards);
}

export function getMatchGridCols(cardCount) {
  if (cardCount <= 8) return 4;
  if (cardCount <= 12) return 4;
  return 4;
}

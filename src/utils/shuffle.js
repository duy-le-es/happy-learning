export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickOptions(correctItem, allItems, count = 3) {
  const others = shuffle(allItems.filter((item) => item.id !== correctItem.id));
  const wrongCount = count - 1;
  const wrongItems = others.slice(0, wrongCount);
  return shuffle([correctItem, ...wrongItems]);
}

export const FEEDBACK = {
  correct: {
    text: 'Giỏi lắm!',
    audio: '/sounds/voice/feedback/correct.mp3',
  },
  tryAgain: {
    text: 'Thử lại nhé!',
    audio: '/sounds/voice/feedback/try-again.mp3',
  },
};

export function questionAudio(itemId) {
  return `/sounds/voice/questions/${itemId}.mp3`;
}

export function repeatAudio(itemId) {
  return `/sounds/voice/repeat/${itemId}.mp3`;
}

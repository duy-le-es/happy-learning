import { unlockAudio } from './audioUnlock';

export async function playAudioSrc(src) {
  await unlockAudio();

  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.volume = 1;

    const cleanup = () => {
      audio.onended = null;
      audio.onerror = null;
    };

    audio.onended = () => {
      cleanup();
      resolve();
    };

    audio.onerror = () => {
      cleanup();
      reject(new Error(`Cannot play ${src}`));
    };

    audio.play().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

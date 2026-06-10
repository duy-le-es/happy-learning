import { synthesizeVietnameseAudio } from './vietnameseTts';

const audioCache = new Map();
const pending = new Map();

export async function synthesizeNaturalVoice(text) {
  if (!text) return null;

  if (audioCache.has(text)) {
    return audioCache.get(text);
  }

  if (pending.has(text)) {
    return pending.get(text);
  }

  const promise = (async () => {
    const blob = await synthesizeVietnameseAudio(text);
    const url = URL.createObjectURL(blob);
    audioCache.set(text, url);
    pending.delete(text);
    return url;
  })();

  pending.set(text, promise);

  try {
    return await promise;
  } catch (err) {
    pending.delete(text);
    throw err;
  }
}

export function preloadNaturalVoice(text) {
  synthesizeNaturalVoice(text).catch(() => {});
}

export function clearVoiceCache() {
  audioCache.forEach((url) => URL.revokeObjectURL(url));
  audioCache.clear();
}

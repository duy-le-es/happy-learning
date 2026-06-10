import { getSpeechVoices, onVoicesChanged } from './speechVoices';

const TTS_RATE = 0.82;
const TTS_PITCH = 1.0;

function pickVietnameseVoice(voices) {
  const preferred = [
    'Google Tiếng Việt',
    'Microsoft HoaiMy Online',
    'Microsoft HoaiMy',
    'Microsoft An Online',
    'Microsoft An',
    'vi-VN',
  ];

  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name) || v.lang === name);
    if (match) return match;
  }

  return voices.find((v) => v.lang === 'vi-VN' || v.lang.startsWith('vi')) ?? null;
}

function waitForVoices(timeoutMs = 2500) {
  return new Promise((resolve) => {
    const voices = getSpeechVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(getSpeechVoices());
    };

    const cleanup = onVoicesChanged(finish);
    setTimeout(finish, timeoutMs);
  });
}

export async function speakVietnamese(text) {
  if (!window.speechSynthesis || !text) return false;

  const voices = await waitForVoices();
  const voice = pickVietnameseVoice(voices);
  if (!voice) return false;

  return new Promise((resolve) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.voice = voice;
    utterance.rate = TTS_RATE;
    utterance.pitch = TTS_PITCH;
    utterance.volume = 1;

    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

export function stopBrowserTts() {
  window.speechSynthesis?.cancel();
}

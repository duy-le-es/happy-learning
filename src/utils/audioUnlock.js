let unlocked = false;
let sharedContext = null;

export function isAudioUnlocked() {
  return unlocked;
}

export async function unlockAudio() {
  if (unlocked) return;

  try {
    sharedContext = new AudioContext();
    if (sharedContext.state === 'suspended') {
      await sharedContext.resume();
    }
    const buffer = sharedContext.createBuffer(1, 1, 22050);
    const source = sharedContext.createBufferSource();
    source.buffer = buffer;
    source.connect(sharedContext.destination);
    source.start(0);
    unlocked = true;
  } catch {
    /* ignore */
  }
}

export function getSharedAudioContext() {
  return sharedContext;
}

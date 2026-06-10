/** Safari iOS không hỗ trợ speechSynthesis.addEventListener — dùng onvoiceschanged. */
export function onVoicesChanged(callback) {
  const synth = window.speechSynthesis
  if (!synth) return () => {}

  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', callback)
    return () => synth.removeEventListener('voiceschanged', callback)
  }

  const previous = synth.onvoiceschanged
  synth.onvoiceschanged = () => {
    if (typeof previous === 'function') previous()
    callback()
  }

  return () => {
    synth.onvoiceschanged = previous ?? null
  }
}

export function getSpeechVoices() {
  try {
    return window.speechSynthesis?.getVoices() ?? []
  } catch {
    return []
  }
}

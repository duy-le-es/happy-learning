let requested = false;

export async function enterFullscreen() {
  if (requested || document.fullscreenElement) return;

  const el = document.documentElement;
  const request =
    el.requestFullscreen?.bind(el) ??
    el.webkitRequestFullscreen?.bind(el) ??
    el.msRequestFullscreen?.bind(el);

  if (!request) return;

  try {
    await request();
    requested = true;
  } catch {
    /* trình duyệt từ chối hoặc không hỗ trợ */
  }
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

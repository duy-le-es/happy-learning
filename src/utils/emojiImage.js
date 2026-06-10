/** Ảnh SVG Twemoji — sắc nét hơn emoji font khi scale/crop */
export function emojiImageUrl(emoji) {
  if (!emoji) return '';
  const codepoint = [...emoji]
    .map((char) => char.codePointAt(0).toString(16))
    .filter(Boolean)
    .join('-');
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;
}

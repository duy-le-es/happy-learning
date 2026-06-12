import { EdgeTTS } from 'edge-tts-universal';
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { topics } from '../src/data/topics.js';
import { getRepeatPhrase } from '../src/data/gameData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VOICE = 'vi-VN-HoaiMyNeural';
const RATE = '-10%';

const FEEDBACK = [
  { file: 'feedback/correct.mp3', text: 'Giỏi lắm!' },
  { file: 'feedback/try-again.mp3', text: 'Thử lại nhé!' },
];

async function synthesizeVietnameseAudio(text) {
  const tts = new EdgeTTS(text, VOICE, { rate: RATE });
  const result = await tts.synthesize();
  const arrayBuffer = await result.audio.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function isValidFile(path) {
  try {
    return statSync(path).size > 500;
  } catch {
    return false;
  }
}

async function generate(text, relativePath) {
  const output = join(ROOT, 'public/sounds/voice', relativePath);
  mkdirSync(dirname(output), { recursive: true });

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const buffer = await synthesizeVietnameseAudio(text);
      if (buffer.length < 500) throw new Error('Audio too small');
      writeFileSync(output, buffer);
      console.log(`  done  ${relativePath}`);
      return;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

async function main() {
  console.log(`Generating Vietnamese voices (${VOICE})...\n`);

  for (const topic of topics) {
    console.log(`Topic: ${topic.name}`);
    for (const item of topic.items) {
      const rel = `questions/${item.id}.mp3`;
      const output = join(ROOT, 'public/sounds/voice', rel);
      if (isValidFile(output)) {
        console.log(`  skip  ${rel}`);
      } else {
        await generate(item.question, rel);
        await new Promise((r) => setTimeout(r, 400));
      }

      const repeatRel = `repeat/${item.id}.mp3`;
      const repeatOutput = join(ROOT, 'public/sounds/voice', repeatRel);
      if (isValidFile(repeatOutput)) {
        console.log(`  skip  ${repeatRel}`);
      } else {
        await generate(getRepeatPhrase(item), repeatRel);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  console.log('\nFeedback:');
  for (const { file, text } of FEEDBACK) {
    const output = join(ROOT, 'public/sounds/voice', file);
    if (isValidFile(output)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    await generate(text, file);
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('\nAll voice files ready.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { IsomorphicDRM as DRM } from 'edge-tts-universal';
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';
import { topics } from '../src/data/topics.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const WSS_URL =
  'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const SEC_MS_GEC_VERSION = '1-143.0.3650.75';
const VOICE = 'Microsoft Server Speech Text to Speech Voice (vi-VN, HoaiMyNeural)';
const LANG = 'vi-VN';
const RATE = '-10%';

const FEEDBACK = [
  { file: 'feedback/correct.mp3', text: 'Giỏi lắm!' },
  { file: 'feedback/try-again.mp3', text: 'Thử lại nhé!' },
];

function connectId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }).replace(/-/g, '');
}

function timestamp() {
  return new Date().toUTCString().replace('GMT', 'GMT+0000 (Coordinated Universal Time)');
}

function escapeXml(text) {
  return text.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}

function buildSsml(text) {
  const escaped = escapeXml(text);
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${LANG}'><voice name='${VOICE}'><prosody pitch='+0Hz' rate='${RATE}' volume='+0%'>${escaped}</prosody></voice></speak>`;
}

function parseBinaryMessage(message) {
  const headerLength = (message[0] << 8) | message[1];
  const headerText = message.slice(2, headerLength + 2).toString();
  const headers = {};
  headerText.split('\r\n').forEach((line) => {
    const [key, value] = line.split(':', 2);
    if (key && value) headers[key] = value.trim();
  });
  return [headers, message.slice(headerLength + 2)];
}

async function synthesizeVietnameseAudio(text) {
  const secMsGec = await DRM.generateSecMsGec();
  const url = `${WSS_URL}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connectId()}`;
  const ssml = buildSsml(text);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const audioChunks = [];
    let audioReceived = false;
    let settled = false;

    const finish = (err, buffer) => {
      if (settled) return;
      settled = true;
      ws.close();
      if (err) reject(err);
      else resolve(buffer);
    };

    ws.on('open', () => {
      ws.send(
        `X-Timestamp:${timestamp()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`,
      );
      ws.send(
        `X-RequestId:${connectId()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${timestamp()}Z\r\nPath:ssml\r\n\r\n${ssml}`,
      );
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        if (data.toString().includes('Path:turn.end')) {
          if (!audioReceived) finish(new Error('No audio received'));
          else finish(null, Buffer.concat(audioChunks));
        }
        return;
      }

      const [headers, audioData] = parseBinaryMessage(data);
      if (headers.Path === 'audio' && headers['Content-Type'] === 'audio/mpeg' && audioData.length > 0) {
        audioReceived = true;
        audioChunks.push(audioData);
      }
    });

    ws.on('error', () => finish(new Error('TTS connection failed')));
    ws.on('close', () => {
      if (!settled && audioReceived) finish(null, Buffer.concat(audioChunks));
      else if (!settled) finish(new Error('TTS connection closed'));
    });

    setTimeout(() => {
      if (!settled) finish(new Error('TTS timeout'));
    }, 15000);
  });
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
  console.log(`Generating Vietnamese voices (${VOICE}, xml:lang=${LANG})...\n`);

  for (const topic of topics) {
    console.log(`Topic: ${topic.name}`);
    for (const item of topic.items) {
      const rel = `questions/${item.id}.mp3`;
      const output = join(ROOT, 'public/sounds/voice', rel);
      if (isValidFile(output)) {
        console.log(`  skip  ${rel}`);
        continue;
      }
      await generate(item.question, rel);
      await new Promise((r) => setTimeout(r, 400));
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

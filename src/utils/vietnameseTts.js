import { DRM } from 'edge-tts-universal/browser';

const WSS_URL =
  'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const SEC_MS_GEC_VERSION = '1-143.0.3650.75';
const VOICE = 'Microsoft Server Speech Text to Speech Voice (vi-VN, HoaiMyNeural)';
const LANG = 'vi-VN';
const RATE = '-10%';

function connectId() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  const hex = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}${hex.slice(8, 12)}${hex.slice(12, 16)}${hex.slice(16, 20)}${hex.slice(20, 32)}`;
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
  const headerBytes = message.slice(2, headerLength + 2);
  const headerText = new TextDecoder().decode(headerBytes);
  const headers = {};
  headerText.split('\r\n').forEach((line) => {
    const [key, value] = line.split(':', 2);
    if (key && value) headers[key] = value.trim();
  });
  return [headers, message.slice(headerLength + 2)];
}

export async function synthesizeVietnameseAudio(text) {
  const secMsGec = await DRM.generateSecMsGec();
  const url = `${WSS_URL}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connectId()}`;
  const ssml = buildSsml(text);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const audioChunks = [];
    let audioReceived = false;
    let settled = false;

    const finish = (err, blob) => {
      if (settled) return;
      settled = true;
      ws.close();
      if (err) reject(err);
      else resolve(blob);
    };

    ws.onopen = () => {
      ws.send(
        `X-Timestamp:${timestamp()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`,
      );
      ws.send(
        `X-RequestId:${connectId()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${timestamp()}Z\r\nPath:ssml\r\n\r\n${ssml}`,
      );
    };

    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        if (event.data.includes('Path:turn.end')) {
          if (!audioReceived) finish(new Error('No audio received'));
          else finish(null, new Blob(audioChunks, { type: 'audio/mpeg' }));
        }
        return;
      }

      const processBuffer = (buffer) => {
        const data = new Uint8Array(buffer);
        if (data.length < 2) return;
        const [headers, audioData] = parseBinaryMessage(data);
        if (headers.Path === 'audio' && headers['Content-Type'] === 'audio/mpeg' && audioData.length > 0) {
          audioReceived = true;
          audioChunks.push(audioData);
        }
      };

      if (event.data instanceof ArrayBuffer) {
        processBuffer(event.data);
      } else if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(processBuffer).catch(() => finish(new Error('Audio parse failed')));
      }
    };

    ws.onerror = () => finish(new Error('TTS connection failed'));
    ws.onclose = () => {
      if (settled) return;
      if (audioReceived) {
        finish(null, new Blob(audioChunks, { type: 'audio/mpeg' }));
      }
    };

    setTimeout(() => {
      if (!settled) finish(new Error('TTS timeout'));
    }, 4000);
  });
}

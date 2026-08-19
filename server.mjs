import { createServer as createHttpServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(ROOT, 'dist');
const UPLOADS_DIR = join(ROOT, 'uploads');
const HLS_DIR = join(ROOT, '.runtime', 'hls');
const CLIPS_DIR = join(ROOT, '.runtime', 'clips');
const PLAYLIST = join(HLS_DIR, 'camera.m3u8');
const development = process.argv.includes('--dev');

function loadEnv(filename) {
  if (!existsSync(filename)) return;
  for (const rawLine of readFileSync(filename, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const equals = line.indexOf('=');
    if (equals < 1) continue;
    const key = line.slice(0, equals).trim();
    let value = line.slice(equals + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv(join(ROOT, '.env'));

const config = {
  host: process.env.CAMERA_HOST || '192.168.1.5',
  port: Number(process.env.CAMERA_PORT || 554),
  user: process.env.CAMERA_USER || '',
  password: process.env.CAMERA_PASSWORD || '',
  rtspPath: process.env.CAMERA_RTSP_PATH || '/stream1',
  transcode: process.env.CAMERA_TRANSCODE === '1',
  httpPort: Number(process.env.PORT || 8080)
};

const COMMON_RTSP_PATHS = [
  '/cam/realmonitor?channel=1&subtype=0',
  '/Streaming/Channels/101',
  '/stream1',
  '/h264Preview_01_main',
  '/live/ch00_0',
  '/live',
  '/11',
  '/axis-media/media.amp'
];
const rtspPaths = config.rtspPath.toLowerCase() === 'auto' ? COMMON_RTSP_PATHS : [config.rtspPath];
let rtspPathIndex = 0;

function activeRtspPath() {
  return rtspPaths[rtspPathIndex % rtspPaths.length];
}

function cameraUrl() {
  const auth = config.user
    ? `${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@`
    : '';
  const selectedPath = activeRtspPath();
  const cameraPath = selectedPath.startsWith('/') ? selectedPath : `/${selectedPath}`;
  return `rtsp://${auth}${config.host}:${config.port}${cameraPath}`;
}

mkdirSync(HLS_DIR, { recursive: true });
mkdirSync(CLIPS_DIR, { recursive: true });

function clearHlsFiles() {
  for (const name of readdirSync(HLS_DIR)) {
    if (/^camera(?:_\d+)?\.(?:m3u8|ts)$/.test(name)) unlinkSync(join(HLS_DIR, name));
  }
}

let ffmpeg = null;
let restartTimer = null;
let startedAt = null;
let lastError = '';

function safeError(message) {
  return String(message)
    .replace(/rtsp:\/\/[^@\s]+@/gi, 'rtsp://***:***@')
    .trim()
    .slice(-500);
}

function startCameraBridge() {
  clearTimeout(restartTimer);
  clearHlsFiles();
  startedAt = new Date().toISOString();
  lastError = '';

  const videoArgs = config.transcode
    ? ['-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency', '-pix_fmt', 'yuv420p', '-g', '30']
    : ['-c:v', 'copy'];

  const args = [
    '-hide_banner', '-loglevel', 'warning',
    '-rtsp_transport', 'tcp', '-timeout', '5000000',
    '-i', cameraUrl(),
    '-map', '0:v:0', '-map', '0:a:0?',
    ...videoArgs,
    '-c:a', 'aac', '-ar', '44100', '-b:a', '96k',
    '-f', 'hls', '-hls_time', '1', '-hls_list_size', '6',
    '-hls_flags', 'delete_segments+append_list+omit_endlist+independent_segments',
    '-hls_segment_filename', join(HLS_DIR, 'camera_%06d.ts'),
    PLAYLIST
  ];

  ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
  ffmpeg.stderr.setEncoding('utf8');
  ffmpeg.stderr.on('data', chunk => { lastError = safeError(chunk); });
  ffmpeg.on('error', error => { lastError = safeError(error.message); });
  ffmpeg.on('exit', () => {
    let producedStream = false;
    try { producedStream = existsSync(PLAYLIST) && statSync(PLAYLIST).size > 0; } catch {}
    if (!producedStream && rtspPaths.length > 1) rtspPathIndex = (rtspPathIndex + 1) % rtspPaths.length;
    ffmpeg = null;
    restartTimer = setTimeout(startCameraBridge, 5000);
  });
}

function bridgeStatus() {
  let playlistFresh = false;
  try {
    playlistFresh = Date.now() - statSync(PLAYLIST).mtimeMs < 15000;
  } catch {}

  return {
    status: playlistFresh ? 'online' : (ffmpeg ? 'connecting' : 'offline'),
    playlist: playlistFresh ? '/hls/camera.m3u8' : null,
    camera: config.host,
    startedAt,
    message: playlistFresh ? 'Camera transmitindo' : 'Aguardando o sinal RTSP'
  };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, {
    'Content-Type': MIME_TYPES['.json'],
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(value));
}

function serveFile(request, response, baseDirectory, relativePath, noCache = false) {
  const filePath = resolve(baseDirectory, relativePath);
  if (filePath !== baseDirectory && !filePath.startsWith(baseDirectory + sep)) {
    sendJson(response, 403, { error: 'Acesso negado' });
    return;
  }

  try {
    const data = readFileSync(filePath);
    const extension = extname(filePath).toLowerCase();
    const range = request.headers.range;
    const baseHeaders = {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': noCache || development || extension === '.html' ? 'no-store' : 'public, max-age=3600',
      'Accept-Ranges': 'bytes'
    };

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        response.writeHead(416, { ...baseHeaders, 'Content-Range': `bytes */${data.length}` });
        response.end();
        return;
      }
      const start = match[1] ? Number(match[1]) : 0;
      const requestedEnd = match[2] ? Number(match[2]) : data.length - 1;
      const end = Math.min(requestedEnd, data.length - 1);
      if (start > end || start >= data.length) {
        response.writeHead(416, { ...baseHeaders, 'Content-Range': `bytes */${data.length}` });
        response.end();
        return;
      }
      const chunk = data.subarray(start, end + 1);
      response.writeHead(206, {
        ...baseHeaders,
        'Content-Range': `bytes ${start}-${end}/${data.length}`,
        'Content-Length': chunk.length
      });
      response.end(chunk);
      return;
    }

    response.writeHead(200, { ...baseHeaders, 'Content-Length': data.length });
    response.end(data);
  } catch {
    sendJson(response, 404, { error: 'Arquivo nao encontrado' });
  }
}

const DEMO_VIDEO_FILES = new Set(['demo-guarda.mp4', 'demo-passagem.mp4', 'demo-kids.mp4']);

function generateDemoClip(requestUrl, request, response) {
  const source = requestUrl.searchParams.get('source') || '';
  const startText = requestUrl.searchParams.get('start') || '';
  const endText = requestUrl.searchParams.get('end') || '';
  const start = Number(startText);
  const end = Number(endText);

  if (!DEMO_VIDEO_FILES.has(source) || !/^\d+$/.test(startText) || !/^\d+$/.test(endText) || start < 0 || end <= start || end > 16) {
    sendJson(response, 400, { error: 'Intervalo de corte invalido' });
    return;
  }

  const outputName = `${source.slice(0, -4)}-${start}-${end}.mp4`;
  const outputPath = join(CLIPS_DIR, outputName);
  if (existsSync(outputPath)) {
    serveFile(request, response, CLIPS_DIR, outputName);
    return;
  }

  const temporaryName = `${outputName}.${process.pid}-${Date.now()}.part.mp4`;
  const temporaryPath = join(CLIPS_DIR, temporaryName);
  const clipProcess = spawn('ffmpeg', [
    '-hide_banner', '-loglevel', 'error',
    '-ss', String(start), '-i', join(UPLOADS_DIR, source),
    '-t', String(end - start), '-map', '0:v:0', '-an',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24',
    '-movflags', '+faststart', '-y', temporaryPath
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let clipError = '';
  clipProcess.stderr.setEncoding('utf8');
  clipProcess.stderr.on('data', chunk => { clipError = safeError(chunk); });
  clipProcess.on('error', error => {
    clipError = safeError(error.message);
  });
  clipProcess.on('close', code => {
    if (code !== 0 || !existsSync(temporaryPath)) {
      sendJson(response, 500, { error: 'Nao foi possivel gerar o corte', detail: clipError });
      return;
    }
    try {
      renameSync(temporaryPath, outputPath);
      serveFile(request, response, CLIPS_DIR, outputName);
    } catch {
      sendJson(response, 500, { error: 'Nao foi possivel finalizar o corte' });
    }
  });
}

const server = createHttpServer((request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    sendJson(response, 400, { error: 'URL invalida' });
    return;
  }

  if (pathname === '/api/camera-status') {
    sendJson(response, 200, bridgeStatus());
    return;
  }

  if (pathname === '/api/demo-clip') {
    generateDemoClip(requestUrl, request, response);
    return;
  }

  if (pathname.startsWith('/hls/')) {
    serveFile(request, response, HLS_DIR, pathname.slice('/hls/'.length), true);
    return;
  }

  if (pathname.startsWith('/uploads/')) {
    serveFile(request, response, UPLOADS_DIR, pathname.slice('/uploads/'.length));
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/ceconi' || pathname === '/ceconi/') pathname = '/ceconi/index.html';
  if (pathname.split('/').some(part => part.startsWith('.'))) {
    sendJson(response, 404, { error: 'Arquivo nao encontrado' });
    return;
  }
  serveFile(request, response, DIST_DIR, pathname.slice(1));
});

startCameraBridge();
server.listen(config.httpPort, '0.0.0.0', () => {
  console.log(`MatCast ${development ? '(React dev)' : '(producao)'}: http://localhost:${config.httpPort}`);
  console.log(`Camera configurada em ${config.host}:${config.port} (${config.rtspPath === 'auto' ? 'descoberta RTSP automatica' : config.rtspPath})`);
});

function shutdown() {
  clearTimeout(restartTimer);
  if (ffmpeg) ffmpeg.kill('SIGTERM');
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

const PLAYLIST_URL = '/hls/camera.m3u8';

export function useCameraStatus() {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const response = await fetch('/api/camera-status', { cache: 'no-store' });
        const data = await response.json();
        if (active) setStatus(data.status === 'online' ? 'online' : data.status === 'connecting' ? 'connecting' : 'offline');
      } catch {
        if (active) setStatus('offline');
      }
    };

    check();
    const poll = window.setInterval(check, 3000);
    return () => {
      active = false;
      window.clearInterval(poll);
    };
  }, []);

  return { status, online: status === 'online' };
}

export function useHlsVideo(online, muted = true) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !online) return undefined;

    video.muted = muted;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = PLAYLIST_URL;
      video.play().catch(() => {});
      return () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }

    if (!Hls.isSupported()) return undefined;
    const hls = new Hls({
      lowLatencyMode: true,
      liveSyncDurationCount: 2,
      liveMaxLatencyDurationCount: 5
    });
    hls.loadSource(PLAYLIST_URL);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (!data.fatal) return;
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
      else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
      else hls.destroy();
    });

    return () => hls.destroy();
  }, [online]);

  return videoRef;
}

export function useElapsedTime(running) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

import { useState } from 'react';
import { LiveBadge, PrimaryLink, SecondaryLink, SectionHeading } from '../common/Brand.jsx';
import { useHlsVideo } from '../../hooks/useCameraStream.js';

function statusText(status) {
  if (status === 'online') return 'AO VIVO AGORA · TATAME 1';
  if (status === 'connecting') return 'CARREGANDO · MODO DEMONSTRAÇÃO';
  return 'MODO DEMONSTRAÇÃO · VÍDEO DE EXEMPLO';
}

export function LiveHero({ online, status, elapsed }) {
  const videoRef = useHlsVideo(online, true);
  return (
    <header id="topo" className="ceconi-hero">
      <video ref={videoRef} src={online ? undefined : '/uploads/demo-passagem.mp4'} autoPlay muted loop={!online} playsInline />
      <div className="ceconi-hero__shade" />
      <div className="ceconi-hero__copy">
        <LiveBadge online={online} label={`${statusText(status)} · ${elapsed}`} />
        <h1>O tatame<br />nunca <em>fecha.</em></h1>
        <p>Câmera ao vivo no tatame da Ceconi BJJ. Assista aos treinos em tempo real, reveja cada aula gravada e corte seus melhores momentos.</p>
        <div className="button-row"><PrimaryLink href="#aovivo">▶ ASSISTIR AO VIVO</PrimaryLink><SecondaryLink href="#replays">VER REPLAYS</SecondaryLink></div>
      </div>
      <div className="hero-stats"><span><b>02</b> TATAMES PROFISSIONAIS</span><span><b>01</b> CÂMERA IP CONFIGURADA</span><span><b>R$10</b> POR AULA</span><span><b>R$30</b> POR MÊS</span></div>
    </header>
  );
}

export function LiveTicker() {
  const copy = 'BE A LION ✦ AO VIVO 24/7 ✦ AULA AVULSA R$ 10 ✦ ASSINATURA R$ 30/MÊS ✦ REPLAYS COMPLETOS ✦ CORTES ILIMITADOS ✦';
  return <div className="ticker"><div><span>{copy}</span><span>{copy}</span></div></div>;
}

function CameraRail({ online }) {
  const cameras = [
    { name: 'TATAME 1 · CÂMERA A', label: online ? 'NO AR' : 'DEMO', active: true },
    { name: 'TATAME 1 · CÂMERA B', label: 'EXEMPLO' },
    { name: 'TATAME 2 · CÂMERA A', label: 'EXEMPLO' },
    { name: 'TATAME 2 · CÂMERA B', label: 'EXEMPLO' }
  ];
  return <div className="camera-rail">{cameras.map(camera => <div className={`camera-card ${camera.active ? 'is-active' : ''}`} key={camera.name}><span>{camera.name}</span><b>{camera.label}</b></div>)}</div>;
}

export function LiveSection({ online, status, elapsed }) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useHlsVideo(online, muted);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => {});
    else { video.pause(); setPlaying(false); }
  };

  const toggleMute = () => setMuted(value => !value);

  return (
    <section id="aovivo" className="section-shell content-section live-section">
      <div className="section-heading-row"><SectionHeading eyebrow="01 / TRANSMISSÃO" muted="do tatame">Ao vivo</SectionHeading>{online && <span className="viewers"><i />247 assistindo agora</span>}</div>
      <div className="live-grid">
        <div className="live-player">
          <video ref={videoRef} src={online ? undefined : '/uploads/demo-guarda.mp4'} autoPlay muted={muted} loop={!online} playsInline onClick={togglePlay} />
          <div className="player-top"><span>TATAME 1 · {online ? 'CÂMERA IP' : 'VÍDEO DE EXEMPLO'}</span><div><LiveBadge online={online} label={online ? 'AO VIVO' : 'DEMONSTRAÇÃO'} /><span className="timecode">{online ? elapsed : '00:16'}</span></div></div>
          <div className="player-controls"><div className="live-progress"><span /></div><div><button onClick={togglePlay}>{playing ? '❚❚ PAUSAR' : '▶ REPRODUZIR'}</button><button onClick={toggleMute}>{muted ? 'SOM OFF' : 'SOM ON'}</button><span>{online ? '● AO VIVO — baixa latência' : '● REPLAY DE DEMONSTRAÇÃO'}</span><span className="quality">{online ? '720p · 25fps · HLS' : '540p · MP4 · DEMO'}</span></div></div>
        </div>
        <CameraRail online={online} status={status} />
      </div>
      <p className="section-note">{online ? 'A câmera real está conectada por uma ponte RTSP segura.' : 'Você está vendo o modo demonstração. A câmera real assume automaticamente quando estiver disponível na rede da academia.'}</p>
    </section>
  );
}

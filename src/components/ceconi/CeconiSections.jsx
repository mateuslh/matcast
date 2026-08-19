import { useState } from 'react';
import { CeconiLogo, PrimaryLink, SectionHeading } from '../common/Brand.jsx';
import { replayCategories, replays, schedules } from '../../data/ceconi.js';

export function ReplaySection({ access, hasAccess, onOpenLesson }) {
  const [category, setCategory] = useState('Todas');
  const visible = category === 'Todas' ? replays : replays.filter(replay => replay.category === category);
  return (
    <section id="replays" className="section-tinted"><div className="section-shell content-section">
      <div className="section-heading-row"><SectionHeading eyebrow="02 / BIBLIOTECA" muted="de cada aula">Replays</SectionHeading><span className="section-meta">R$ 10 POR AULA · R$ 30/MÊS TODAS AS AULAS</span></div>
      <div className="filter-chips">{replayCategories.map(item => <button className={category === item ? 'is-active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="replay-grid">{visible.map(replay => {
        const unlocked = hasAccess(replay);
        return <article className={`replay-card ${unlocked ? 'is-unlocked' : ''}`} key={replay.id}>
          <button className="replay-open" onClick={() => onOpenLesson(replay)} aria-label={`${unlocked ? 'Assistir' : 'Comprar'} ${replay.title}`}>
            <div className="replay-media"><video src={replay.src} preload="metadata" autoPlay muted loop playsInline /><span className="replay-camera">{replay.camera}</span><span className="replay-duration">{replay.duration}</span><i className="play-icon">{unlocked ? '▶' : '⌾'}</i></div>
            <div className="replay-copy"><h3>{replay.title}</h3><p>{replay.meta}</p><div><span>{unlocked ? '✓ LIBERADA' : access.subscribed ? 'INCLUSA NO PLANO' : 'AULA COMPLETA'}</span><b>{unlocked ? 'ASSISTIR →' : 'R$ 10 · LIBERAR →'}</b></div></div>
          </button>
        </article>;
      })}</div>
    </div></section>
  );
}

export function ClipsSection({ clips = [] }) {
  return (
    <section id="cortes" className="section-shell content-section clips-grid">
      <div><SectionHeading eyebrow="03 / CORTES" muted="Corta.">Pegou a finalização?</SectionHeading><p>Marque o início, marque o fim. O corte sai em segundos, pronto para o celular e para o Instagram.</p><ol className="numbered-list"><li><b>01</b> Abra o replay e ache o momento</li><li><b>02</b> Arraste as alças de início e fim</li><li><b>03</b> Baixe ou compartilhe o corte</li></ol></div>
      <div className="clip-editor"><div className="clip-video"><video src="/uploads/demo-guarda.mp4#t=2,10" preload="metadata" autoPlay loop muted playsInline /><span>{clips.length ? `${String(clips.length).padStart(2, '0')} CORTES SALVOS` : 'CORTE · 00:08'}</span></div><div className="timeline"><i /><i /></div><div className="timeline-labels"><span>00:00</span><b>IN 00:02</b><b>OUT 00:10</b><span>00:16</span></div><div className="clip-actions"><a href="#replays">ESCOLHER UMA AULA</a><button type="button">COMPARTILHAR</button></div></div>
    </section>
  );
}

export function ScheduleSection({ online }) {
  return (
    <section id="horarios" className="section-tinted"><div className="section-shell content-section">
      <SectionHeading eyebrow="04 / HORÁRIOS" muted="câmera ligada">Toda aula,</SectionHeading><p>A transmissão entra no ar automaticamente no início de cada turma.</p>
      <div className="schedule-list">{schedules.map(item => <div key={item.name}><h3>{item.name}</h3><p>{item.times}</p><span className={item.live && online ? 'is-live' : ''}>{item.live && online ? '● AGORA' : item.location}</span></div>)}</div>
    </div></section>
  );
}

export function AboutSection() {
  return (
    <section className="about-section"><div className="section-shell content-section about-grid"><img src="https://ceconibjjcriciuma.com.br/wp-content/uploads/2025/04/TOPO_SOBRE.png" alt="Henrique Ceconi" /><div><SectionHeading eyebrow="CRICIÚMA · SC">Treine com o campeão mundial <em>Henrique Ceconi</em></SectionHeading><p>Faixa-preta desde 2016, Henrique Ceconi voltou às raízes para fundar em Criciúma uma academia de alto padrão. Agora, pais acompanham os filhos, alunos revisam a técnica e ninguém perde um treino.</p><strong className="be-a-lion">BE A LION</strong></div></div></section>
  );
}

export function CeconiFooter() {
  const whatsapp = 'https://api.whatsapp.com/send/?phone=5548988144545&text=Olá%2C+gostaria+de+mais+informações+sobre+a+Ceconi+BJJ.';
  return <footer className="ceconi-footer section-shell"><div><div><CeconiLogo /><p>R. Anita Garibaldi, 375 – Centro, Criciúma – SC<br />Anexo ao Combo Atacadista</p></div><div className="footer-links"><div><b>PLATAFORMA</b><a href="#aovivo">Ao vivo</a><a href="#replays">Replays</a><a href="#cortes">Cortes</a></div><div><b>ACADEMIA</b><a href="#horarios">Horários</a><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div></div><PrimaryLink href={whatsapp}>FALAR NO WHATSAPP</PrimaryLink></div><small>© 2026 CECONI BJJ · BE A LION</small></footer>;
}

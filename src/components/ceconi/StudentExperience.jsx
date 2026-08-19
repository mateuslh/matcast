import { useEffect, useMemo, useState } from 'react';
import { SectionHeading } from '../common/Brand.jsx';

const STORAGE_KEY = 'ceconi-student-demo-v1';
const EMPTY_ACCESS = { subscribed: false, purchased: [], clips: [] };

function readAccess() {
  try {
    return { ...EMPTY_ACCESS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return EMPTY_ACCESS;
  }
}

export function useStudentAccess() {
  const [access, setAccess] = useState(readAccess);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
  }, [access]);

  return {
    access,
    hasAccess: lesson => Boolean(lesson && (access.subscribed || access.purchased.includes(lesson.id))),
    buyLesson: lessonId => setAccess(current => ({
      ...current,
      purchased: current.purchased.includes(lessonId) ? current.purchased : [...current.purchased, lessonId]
    })),
    subscribe: () => setAccess(current => ({ ...current, subscribed: true })),
    addClip: clip => setAccess(current => ({ ...current, clips: [clip, ...current.clips] }))
  };
}

export function StudentDashboard({ access, lessons, hasAccess, onOpenLesson, onSubscribe }) {
  const available = lessons.filter(hasAccess);
  const featured = available[0] || lessons[0];
  const status = access.subscribed ? 'ASSINATURA ATIVA' : available.length ? 'ACESSO AVULSO' : 'CONTA GRATUITA';

  return (
    <section id="aluno" className="student-section">
      <div className="section-shell content-section">
        <div className="student-heading">
          <SectionHeading eyebrow="ÁREA DO ALUNO · DEMONSTRAÇÃO" muted="é seu.">Seu treino</SectionHeading>
          <div className={`student-status ${access.subscribed ? 'is-active' : ''}`}><i />{status}</div>
        </div>
        <div className="student-dashboard">
          <div className="student-welcome">
            <span className="student-kicker">BOA NOITE, RAFAEL</span>
            <h3>Continue evoluindo<br />fora do tatame.</h3>
            <p>Reveja os detalhes da aula, salve seus momentos e volte para o próximo treino mais preparado.</p>
            <div className="student-numbers">
              <div><b>{available.length}</b><span>AULAS LIBERADAS</span></div>
              <div><b>{access.clips.length}</b><span>CORTES CRIADOS</span></div>
              <div><b>03</b><span>TREINOS NA SEMANA</span></div>
            </div>
          </div>
          <button className="continue-card" onClick={() => onOpenLesson(featured)}>
            <video src={featured.src} autoPlay muted loop playsInline preload="metadata" />
            <span className="continue-shade" />
            <span className="continue-copy">
              <small>{available.length ? 'CONTINUAR ASSISTINDO · 24%' : 'AULA EM DESTAQUE'}</small>
              <strong>{featured.title}</strong>
              <span>{available.length ? '▶ RETOMAR AULA' : '🔒 VER ACESSO'}</span>
            </span>
          </button>
          <aside className="membership-card">
            <span className="membership-label">PLANO DO ALUNO</span>
            <h3>{access.subscribed ? 'Tatame sem limite.' : 'Todas as aulas. Todo mês.'}</h3>
            <div className="membership-price"><b>R$ 30</b><span>/ MÊS</span></div>
            <ul><li>✓ Aulas completas</li><li>✓ Replays dos últimos 30 dias</li><li>✓ Cortes ilimitados</li></ul>
            {access.subscribed
              ? <span className="membership-active">✓ SUA ASSINATURA ESTÁ ATIVA</span>
              : <button onClick={onSubscribe}>ASSINAR AGORA</button>}
            <small>Ou compre uma aula por R$ 10 e assista para sempre.</small>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function CheckoutModal({ lesson, defaultMode = 'single', onClose, onComplete }) {
  const [mode, setMode] = useState(defaultMode);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const closeOnEscape = event => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  const finish = () => {
    setProcessing(true);
    window.setTimeout(() => onComplete(mode), 700);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Escolher acesso à aula">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <div className="checkout-intro">
          <span className="eyebrow">ACESSO AO MATCAST</span>
          <h2>Não perca<br /><em>nenhum detalhe.</em></h2>
          <p>{lesson ? lesson.title : 'Assinatura Ceconi BJJ'}</p>
          <div className="demo-warning">DEMONSTRAÇÃO · NENHUMA COBRANÇA REAL SERÁ FEITA</div>
        </div>
        <div className="checkout-options">
          {lesson && <button className={`checkout-option ${mode === 'single' ? 'is-selected' : ''}`} onClick={() => setMode('single')}>
            <span className="option-check">{mode === 'single' ? '✓' : ''}</span>
            <span><small>COMPRAR ESTA AULA</small><strong>R$ 10 <i>pagamento único</i></strong><p>Aula completa para sempre + cortes ilimitados.</p></span>
          </button>}
          <button className={`checkout-option ${mode === 'monthly' ? 'is-selected' : ''}`} onClick={() => setMode('monthly')}>
            <span className="option-check">{mode === 'monthly' ? '✓' : ''}</span>
            <span><small>MAIS VANTAJOSO</small><strong>R$ 30 <i>por mês</i></strong><p>Todas as aulas, todos os replays e cortes ilimitados.</p></span>
          </button>
          <div className="payment-preview"><span>PIX</span><span>•••• 4242</span><b>PAGAMENTO SEGURO</b></div>
          <button className="checkout-submit" onClick={finish} disabled={processing}>{processing ? 'LIBERANDO ACESSO…' : `LIBERAR ${mode === 'monthly' ? 'ASSINATURA' : 'ESTA AULA'}`}</button>
          <small className="checkout-note">Ao continuar, você confirma que esta é uma simulação visual do fluxo de compra.</small>
        </div>
      </div>
    </div>
  );
}

function formatSeconds(value) {
  const seconds = Math.max(0, Math.round(value));
  return `00:${String(seconds).padStart(2, '0')}`;
}

export function LessonModal({ lesson, clips, onClose, onCreateClip }) {
  const sampleDuration = lesson.sampleDuration || 16;
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(Math.min(9, sampleDuration));
  const [created, setCreated] = useState(false);
  const lessonClips = useMemo(() => clips.filter(clip => clip.lessonId === lesson.id), [clips, lesson.id]);

  useEffect(() => {
    const closeOnEscape = event => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  const createClip = () => {
    onCreateClip({
      id: `${lesson.id}-${Date.now()}`,
      lessonId: lesson.id,
      title: `Corte ${lessonClips.length + 1} · ${lesson.category}`,
      start,
      end,
      src: `/api/demo-clip?source=${encodeURIComponent(lesson.src.split('/').pop())}&start=${start}&end=${end}`
    });
    setCreated(true);
    window.setTimeout(() => setCreated(false), 2200);
  };

  return (
    <div className="lesson-modal" role="dialog" aria-modal="true" aria-label={lesson.title}>
      <header className="lesson-topbar">
        <button onClick={onClose}>← VOLTAR PARA AS AULAS</button>
        <span className="lesson-access">✓ ACESSO LIBERADO · CORTES ILIMITADOS</span>
        <button className="lesson-close" onClick={onClose} aria-label="Fechar">×</button>
      </header>
      <div className="lesson-layout">
        <main className="lesson-main">
          <div className="lesson-player"><video key={lesson.id} src={lesson.src} controls autoPlay playsInline /><span>VÍDEO DEMONSTRATIVO</span></div>
          <div className="lesson-title-row"><div><span className="eyebrow">{lesson.category} · {lesson.level}</span><h2>{lesson.title}</h2><p>{lesson.description}</p></div><div className="lesson-duration"><span>DURAÇÃO DA AULA</span><b>{lesson.duration}</b></div></div>
          <section className="real-clip-editor">
            <div className="clip-editor-heading"><div><span className="eyebrow">CRIAR NOVO CORTE</span><h3>Escolha o melhor momento.</h3></div><span>∞ SEM LIMITE</span></div>
            <div className="range-preview">
              <div className="range-track"><span style={{ left: `${start / sampleDuration * 100}%`, right: `${100 - end / sampleDuration * 100}%` }} /></div>
              <label>INÍCIO <b>{formatSeconds(start)}</b><input type="range" min="0" max={sampleDuration - 2} value={start} onChange={event => setStart(Math.min(Number(event.target.value), end - 1))} /></label>
              <label>FIM <b>{formatSeconds(end)}</b><input type="range" min="2" max={sampleDuration} value={end} onChange={event => setEnd(Math.max(Number(event.target.value), start + 1))} /></label>
            </div>
            <div className="clip-create-row"><p>Seu corte terá <b>{end - start}s</b> e ficará salvo na área do aluno.</p><button onClick={createClip}>{created ? '✓ CORTE CRIADO' : '✂ GERAR CORTE'}</button></div>
          </section>
        </main>
        <aside className="lesson-sidebar">
          <span className="eyebrow">CONTEÚDO DA AULA</span>
          <ol><li className="is-playing"><b>01</b><span>Aquecimento específico<small>00:00 — 08:12</small></span></li><li><b>02</b><span>Conceito principal<small>08:12 — 21:40</small></span></li><li><b>03</b><span>Detalhes e variações<small>21:40 — 38:05</small></span></li><li><b>04</b><span>Treino situacional<small>38:05 — {lesson.duration}</small></span></li></ol>
          <div className="saved-clips"><div><span>MEUS CORTES</span><b>{lessonClips.length}</b></div>{lessonClips.length === 0 ? <p>Seus cortes desta aula aparecerão aqui.</p> : lessonClips.map(clip => <div className="saved-clip" key={clip.id}><a href={clip.src} download title="Baixar corte">↓</a><div><b>{clip.title}</b><small>{formatSeconds(clip.start)} — {formatSeconds(clip.end)}</small></div></div>)}</div>
        </aside>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { CeconiLogo, MatcastLogo, PrimaryLink, SecondaryLink, SectionHeading } from '../common/Brand.jsx';
import { audiences, brandColors, features, plans, steps } from '../../data/marketing.js';

const DEMO_A = '/uploads/demo-guarda.mp4';
const DEMO_B = '/uploads/demo-passagem.mp4';

function DemoBrowser({ compact = false }) {
  return (
    <div className={`browser-frame ${compact ? 'browser-frame--compact' : ''}`}>
      <div className="browser-bar">
        <span /><span /><span />
        <div>suaacademia.com.br/<b>aovivo</b></div>
      </div>
      <div className="browser-video">
        <video src={DEMO_A} autoPlay muted loop playsInline />
        <span className="video-live"><i /> AO VIVO</span>
        <span className="video-label">TATAME 1 · CAM A</span>
      </div>
      {!compact && (
        <div className="thumbnail-row">
          <video src={DEMO_A} muted playsInline />
          <video src={`${DEMO_B}#t=2`} muted playsInline />
          <span /><span />
        </div>
      )}
    </div>
  );
}

export function MarketingHero() {
  return (
    <header id="topo" className="marketing-hero section-shell">
      <div className="marketing-hero__copy">
        <div className="pill">CÂMERAS + PLATAFORMA PARA ACADEMIAS E ALUNOS DE BJJ</div>
        <h1>Coloque seus tatames <em>no ar.</em></h1>
        <p>Instalamos as câmeras e você ganha um hub com a sua marca: transmissão ao vivo, replay de todas as aulas e cortes prontos para o Instagram.</p>
        <div className="button-row">
          <PrimaryLink href="#cta">AGENDAR DEMO</PrimaryLink>
          <SecondaryLink href="/ceconi.html">VER NO AR: CECONI BJJ ↗</SecondaryLink>
        </div>
        <div className="hero-facts"><span><b>7 DIAS</b> DA VISITA AO AR</span><span><b>ZERO</b> OBRA NO TATAME</span><span><b>100%</b> SUA MARCA</span></div>
      </div>
      <div><DemoBrowser /><div className="frame-caption">O HUB QUE SEUS ALUNOS ABREM TODO DIA</div></div>
    </header>
  );
}

export function TrustStrip() {
  return (
    <div className="trust-strip"><div>
      <span>NO AR COM MATCAST</span><CeconiLogo />
      {Array.from({ length: 3 }).map((_, index) => <span className="placeholder-brand" key={index}>SUA ACADEMIA</span>)}
    </div></div>
  );
}

export function HowItWorks() {
  return (
    <section id="como" className="section-shell content-section">
      <SectionHeading eyebrow="01 / COMO FUNCIONA" muted="em 7 dias">Da visita ao ar</SectionHeading>
      <div className="card-grid card-grid--three">
        {steps.map(step => <article className="info-card" key={step.number}><b className="step-number">{step.number}</b><h3>{step.title}</h3><p>{step.description}</p></article>)}
      </div>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <section id="recursos" className="section-tinted"><div className="section-shell content-section">
      <SectionHeading eyebrow="02 / RECURSOS" muted="produz">Tudo que o tatame</SectionHeading>
      <div className="feature-grid">
        {features.map(feature => <article key={feature.tag}><span>{feature.tag}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>)}
      </div>
    </div></section>
  );
}

export function BrandDemo() {
  const [brandName, setBrandName] = useState('Sua Academia BJJ');
  const [brandColor, setBrandColor] = useState(brandColors[0]);
  const domain = useMemo(() => {
    const slug = brandName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 22);
    return `${slug || 'suaacademia'}.com.br/aovivo`;
  }, [brandName]);

  return (
    <section id="marca" className="section-shell content-section split-section">
      <div>
        <SectionHeading eyebrow="03 / WHITE LABEL" muted="não a nossa">Sua marca,</SectionHeading>
        <p>O hub inteiro veste as cores da sua academia. O MatCast fica invisível — quem brilha é o seu tatame. Experimente:</p>
        <label className="field-label">NOME DA ACADEMIA<input value={brandName} onChange={event => setBrandName(event.target.value)} /></label>
        <div className="field-label">COR DA MARCA<div className="color-swatches">{brandColors.map(color => <button aria-label={`Usar a cor ${color}`} className={brandColor === color ? 'is-selected' : ''} key={color} style={{ background: color }} onClick={() => setBrandColor(color)} />)}</div></div>
      </div>
      <div className="brand-preview" style={{ '--brand-color': brandColor }}>
        <div className="browser-bar"><span /><span /><span /><div>{domain}</div></div>
        <div className="brand-preview__nav"><strong>{brandName}</strong><span>AO VIVO</span><span>REPLAYS</span><span>CORTES</span><b>ÁREA DO ALUNO</b></div>
        <div className="brand-preview__video"><video src={DEMO_B} autoPlay muted loop playsInline /><span className="video-live"><i /> AO VIVO</span><h3>Treino das 19h30 · <em>Tatame 1</em></h3></div>
      </div>
    </section>
  );
}

export function CaseStudy() {
  return (
    <section id="case" className="section-tinted"><div className="section-shell content-section case-grid">
      <div><div className="eyebrow">04 / CASE · CRICIÚMA SC</div><CeconiLogo className="case-logo" /><blockquote>“A arquibancada virou o mundo inteiro. Aluno que viaja não perde aula, <em>pai assiste o filho do trabalho.</em>”</blockquote><p>Henrique Ceconi — Campeão Mundial, fundador da Ceconi BJJ</p><div className="hero-facts"><span><b>01</b> CÂMERA IP</span><span><b>02</b> TATAMES</span><span><b>30D</b> DE REPLAY</span></div><PrimaryLink href="/ceconi.html">VER O HUB DA CECONI AO VIVO ↗</PrimaryLink></div>
      <div className="portrait-video"><video src={`${DEMO_A}#t=3`} muted playsInline /><span>CECONI BJJ · TATAME 1 · CAM A</span></div>
    </div></section>
  );
}

export function AudienceSection() {
  return (
    <section id="paravoce" className="section-shell content-section">
      <SectionHeading eyebrow="05 / PARA ALUNOS, PAIS E FÃS" muted="para você">Também direto</SectionHeading>
      <p className="section-intro">Não é dono de academia? O MatCast também funciona no B2C: quem treina, acompanha ou torce pode assinar individualmente.</p>
      <div className="card-grid card-grid--three">{audiences.map(item => <article className="info-card" key={item.tag}><span className="eyebrow">{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="precos" className="section-shell content-section pricing-section">
      <SectionHeading eyebrow="06 / PLANOS">Um plano por tatame</SectionHeading>
      <p>Instalação inclusa em contratos anuais. Sem taxa por aluno.</p>
      <div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>{plan.tag && <span className="price-tag">{plan.tag}</span>}<h3>{plan.name}</h3><small>{plan.spec}</small><div className="price"><b>{plan.price}</b> {plan.period}</div><ul>{plan.items.map(item => <li key={item}>✓ <span>{item}</span></li>)}</ul><PrimaryLink href="#cta">{plan.cta}</PrimaryLink></article>)}</div>
    </section>
  );
}

export function MarketingCTA() {
  return <section id="cta" className="final-cta"><div><div className="eyebrow">PRONTO PARA COLOCAR O TATAME NO AR?</div><h2>Seu primeiro treino ao vivo <em>em 7 dias.</em></h2><p>Conte quantos tatames e câmeras você precisa. A gente cuida do resto.</p><PrimaryLink href="mailto:contato@matcast.com.br">AGENDAR DEMONSTRAÇÃO</PrimaryLink></div></section>;
}

export function MarketingFooter() {
  return <footer className="simple-footer"><MatcastLogo /><span>CÂMERAS + PLATAFORMA PARA ACADEMIAS E ALUNOS DE BJJ · BRASIL</span><span>© 2026 MATCAST</span></footer>;
}

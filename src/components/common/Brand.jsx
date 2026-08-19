const CECONI_LOGO = 'https://ceconibjjcriciuma.com.br/wp-content/uploads/2025/04/CeconiBJJ-branco.png';

export function MatcastLogo() {
  return (
    <span className="matcast-logo">
      <span className="matcast-logo__mark" />
      <span>MATCAST</span>
    </span>
  );
}

export function CeconiLogo({ className = '' }) {
  return <img className={`ceconi-logo ${className}`} src={CECONI_LOGO} alt="Ceconi BJJ" />;
}

export function SectionHeading({ eyebrow, children, muted }) {
  return (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{children} {muted && <span>{muted}</span>}</h2>
    </div>
  );
}

export function LiveBadge({ online, label }) {
  return (
    <span className={`live-badge ${online ? 'is-live' : ''}`}>
      <span className="status-dot" />
      {label ?? (online ? 'AO VIVO' : 'SEM SINAL')}
    </span>
  );
}

export function PrimaryLink({ href, children, className = '' }) {
  return <a className={`button button--primary ${className}`} href={href}>{children}</a>;
}

export function SecondaryLink({ href, children, className = '' }) {
  return <a className={`button button--secondary ${className}`} href={href}>{children}</a>;
}


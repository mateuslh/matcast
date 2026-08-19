import { MatcastLogo, PrimaryLink } from '../common/Brand.jsx';

const links = [
  ['#como', 'COMO FUNCIONA'],
  ['#recursos', 'RECURSOS'],
  ['#marca', 'SUA MARCA'],
  ['#case', 'CASE'],
  ['#precos', 'PREÇOS']
];

export function MarketingNav() {
  return (
    <nav className="site-nav">
      <a href="#topo" className="brand-link"><MatcastLogo /></a>
      <div className="nav-links">
        {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </div>
      <div className="nav-actions">
        <a className="nav-demo" href="/ceconi">VER DEMO AO VIVO ↗</a>
        <PrimaryLink href="#cta">AGENDAR DEMO</PrimaryLink>
      </div>
    </nav>
  );
}

import { CeconiLogo, LiveBadge, PrimaryLink } from '../common/Brand.jsx';

export function CeconiNav({ online, status, subscribed }) {
  const label = online ? 'AO VIVO' : status === 'connecting' ? 'CARREGANDO DEMO' : 'MODO DEMO';
  return (
    <nav className="site-nav ceconi-nav">
      <a href="#topo" className="brand-link"><CeconiLogo /></a>
      <div className="nav-links">
        <a href="#aovivo">AO VIVO</a><a href="#aluno">MINHA ÁREA</a><a href="#replays">AULAS</a><a href="#cortes">CORTES</a><a href="#horarios">HORÁRIOS</a>
      </div>
      <div className="nav-actions"><LiveBadge online={online} label={label} /><PrimaryLink href="#aluno">{subscribed ? 'MEU PLANO ✓' : 'ÁREA DO ALUNO'}</PrimaryLink></div>
    </nav>
  );
}

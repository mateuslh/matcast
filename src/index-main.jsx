import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MarketingPage } from './pages/MarketingPage.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketingPage />
  </StrictMode>
);

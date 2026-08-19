import { MarketingNav } from '../components/marketing/MarketingNav.jsx';
import { AudienceSection, BrandDemo, CaseStudy, FeatureGrid, HowItWorks, MarketingCTA, MarketingFooter, MarketingHero, PricingSection, TrustStrip } from '../components/marketing/MarketingSections.jsx';

export function MarketingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        <MarketingHero />
        <TrustStrip />
        <HowItWorks />
        <FeatureGrid />
        <BrandDemo />
        <CaseStudy />
        <AudienceSection />
        <PricingSection />
        <MarketingCTA />
      </main>
      <MarketingFooter />
    </>
  );
}

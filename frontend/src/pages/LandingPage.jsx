import Footer from '../components/layout/Footer.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import FeatureStrip from '../components/landing/FeatureStrip.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import JerseyShowcase from '../components/landing/JerseyShowcase.jsx';
import StatisticsSection from '../components/landing/StatisticsSection.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import TrustedTeams from '../components/landing/TrustedTeams.jsx';

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-vestro-page text-vestro-text">
      <Navbar />
      <HeroSection />
      <JerseyShowcase />
      <FeatureStrip />
      <HowItWorks />
      <TrustedTeams />
      <StatisticsSection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}

export default LandingPage;

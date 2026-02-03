import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import SocialsBar from '../components/layout/SocialsBar';
import AboutUsSection from '../components/sections/AboutUsSection';
import ServicesSection from '../components/sections/ServicesSection';
import Footer from '../components/layout/Footer';
import styles from "./page.module.css";

/**
 * Home Page Component
 * Main landing page featuring service showcase, company information, and call-to-action elements
 * Implements responsive layout with conditional social bar rendering for mobile/desktop experiences
 */
export default function Home() {
  return (
    <div className={styles.page}>
      {/* Desktop-only social bar positioned fixed on screen edge */}
      <div className={styles.desktopSocialsBar}>
        <SocialsBar />
      </div>
      
      {/* Global navigation header with scroll-responsive behavior */}
      <Header />
      
      {/* Hero section with background imagery and primary call-to-action */}
      <section id="home" className={styles.header}>
        <HeroSection />
      </section>
      
      {/* Mobile-only social bar displayed inline between sections */}
      <div className={styles.mobileSocialsBar}>
        <SocialsBar />
      </div>
      
      {/* Company differentiators and founder story section */}
      <section id="our-difference">
        <AboutUsSection />
      </section>
      
      {/* Service offerings with pricing and detailed descriptions */}
      <section id="services">
        <ServicesSection />
      </section>
      
      {/* Global footer with contact information and links */}
      <Footer />
    </div>
  );
}

import EmailForm from '../forms/EmailForm';
import styles from './HeroSection.module.css';

/**
 * Hero Section Component
 * Primary landing section featuring brand messaging and email capture form
 * Uses parallax background styling with overlay for text readability
 */
export default function HeroSection() {
  return (
    <main className={styles.hero}>
      {/* Semi-transparent overlay for text contrast over background image */}
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContent}>
        {/* Primary brand message with emotional appeal */}
        <h1 className={styles.heroTitle}>
          "A Clean Home is a Happy Home"
        </h1>
        
        {/* Supporting tagline emphasizing value proposition */}
        <p className={styles.heroSubtitle}>
          Inviting Cleanliness, Delivering Peace of Mind
        </p>
        
        {/* Email capture form for lead generation */}
        <EmailForm />
      </div>
    </main>
  );
}

import Image from 'next/image';
import styles from './AboutUsSection.module.css';

/**
 * About Us Section Component
 * Company story and value proposition section featuring founder introduction
 * Displays key differentiators with icon-based feature cards and personal branding
 */
export default function AboutUsSection() {
  return (
    <div className={styles.aboutUsWrapper}>
      {/* Welcome Section with branded header design */}
      <section className={styles.welcomeSection}>
        <div className={styles.topLine}></div>
        <div className={styles.container}>
          <h1 className={styles.welcomeHeading}>
            Welcome to Angi's Cleaning Service,<br />
            Your Eco-Friendly Cleaning Partner
          </h1>
        </div>
        <div className={styles.bottomLine}></div>
      </section>

      {/* Company Differentiators Section with feature cards */}
      <section className={styles.differenceSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>OUR DIFFERENCE</h2>
          
          <div className={styles.featuresGrid}>
            {/* Eco-friendly and affordability value proposition */}
            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <Image
                  src="/icons/left_icon.png"
                  alt="Eco-Friendly Icon"
                  width={80}
                  height={80}
                  className={styles.featureIcon}
                />
              </div>
              <h3 className={styles.featureTitle}>
                We are<br />
                <span className={styles.highlight}>Eco-Friendly</span><br />
                + Affordable
              </h3>
              <p className={styles.featureDescription}>
                We offer eco-friendly, affordable solutions using non-toxic 
                products. We prioritise your health and the planet while 
                delivering top-quality cleanliness that fits any budget.
              </p>
            </div>

            {/* Reliability and professionalism messaging */}
            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <Image
                  src="/icons/middle_icon.png"
                  alt="Save Time & Money Icon"
                  width={80}
                  height={80}
                  className={styles.featureIcon}
                />
              </div>
              <h3 className={styles.featureTitle}>
                We<br />
                <span className={styles.highlight}>Save Time &</span><br />
                Money
              </h3>
              <p className={styles.featureDescription}>
                We save you time and money by handling all necessary tasks – 
                simply reliable, efficient cleaning tailored to your needs.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <Image
                  src="/icons/right_icon.png"
                  alt="Passionate Staff Icon"
                  width={80}
                  height={80}
                  className={styles.featureIcon}
                />
              </div>
              <h3 className={styles.featureTitle}>
                We have<br />
                <span className={styles.highlight}>Empowered,</span><br />
                Passionate Staff
              </h3>
              <p className={styles.featureDescription}>
                Our staff are empowered, passionate and committed to excellence, 
                our incredible & motivated team members take pride in every job 
                while delivering the highest care and attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section id="our-heart" className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>MEET THE HEART OF THE TEAM</h2>
          
          <div className={styles.teamContent}>
            <div className={styles.profileContainer}>
              <div className={styles.profileImageWrapper}>
                <Image
                  src="/images/founder_angie.jpg"
                  alt="Angi - Founder"
                  width={300}
                  height={300}
                  className={styles.profileImage}
                />
              </div>
            </div>
            
            <div className={styles.textContent}>
              <p className={styles.introduction}>
                <strong>Hi, I'm Angi</strong> — founder of Angi's Cleaning Service. 
                I am deeply committed to creating healthier, cleaner home environments 
                using eco-friendly methods that are safe for people, pets, and the planet.
              </p>
              
              <p className={styles.mission}>
                Caring for others is at the heart of everything I do, and it brings me 
                joy to know that my work makes homes feel fresh, calm, and truly cared for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className={styles.informationSection}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <p className={styles.infoText}>
              We are an owner managed cleaning company providing residential and business 
              cleaning services.
            </p>
            
            <p className={styles.infoText}>
              <strong>Delivering spotless results in Randburg and Greater Johannesburg.</strong>
            </p>
            
            <p className={styles.infoText}>
              Our supervised team provides all necessary equipment and eco-friendly cleaning 
              products to ensure your environment is exceptionally clean and healthy for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Do This Section */}
      <section id="why-we-do-this" className={styles.whySection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle2}>WHY WE DO THIS</h2>
          
          <div className={styles.contentWrapper}>
            <p className={styles.whyText}>
              Because we know what it feels like to be overwhelmed by mess, by life, 
              by the never-ending list of things to do. We clean not just for the shine – 
              but for the peace it brings. Every space we touch, we treat with care, 
              respect, and heart. That's why we do this.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

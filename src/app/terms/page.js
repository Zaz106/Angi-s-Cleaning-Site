"use client";

import Header from '../../components/layout/Header';
import SocialsBar from '../../components/layout/SocialsBar';
import Footer from '../../components/layout/Footer';
import styles from './page.module.css';

/**
 * Terms of Service Page Component
 * Static page displaying comprehensive terms and conditions for cleaning services
 * Features full-width header design and structured content sections for legal clarity
 */
export default function TermsPage() {
  return (
    <div className={styles.page}>
      {/* Desktop-only social bar positioned fixed on screen edge */}
      <div className={styles.desktopSocialsBar}>
        <SocialsBar />
      </div>
      
      {/* Global navigation header */}
      <Header />
      
      <div className={styles.termsPageWrapper}>
        {/* Hero-style header section with branded styling */}
        <div className={styles.headerSection}>
          <div className={styles.headerOverlay}></div>
          <div className={styles.headerContent}>
            <div className={styles.topLine}></div>
            <h1 className={styles.mainHeading}>TERMS OF SERVICE</h1>
            <div className={styles.bottomLine}></div>
          </div>
        </div>

        {/* Main content area with structured terms layout */}
        <div className={styles.contentSection}>
          <div className={styles.container}>

             {/* Terms and Conditions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Terms and Conditions</h2>
              
              <div className={styles.termsCard}>
                <div className={styles.termItem}>
                  <h4 className={styles.termTitle}>We do not offer cleaning for the following:</h4>
                  <ul className={styles.termList}>
                    <li>Extreme, hardened soap scum in bathrooms, due to a lack of regular cleaning maintenance.</li>
                    <li>Extreme, hardened grease in kitchens, due to a lack of regular cleaning maintenance.</li>
                  </ul>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ Unreasonably dirty and cluttered homes will be subject to an additional fee.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ We are able to assist with a vacuum cleaner. As an extra precaution, we request 
                    Clients to have their personal vacuum cleaner on hand for our use, to prevent cross-contamination 
                    between properties and spreading allergens. Please kindly advise.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ We provide all necessary equipment and Eco-friendly and Biodegradable products.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ No travel charged within a 5km radius.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ 50% deposit required on acceptance of booking. Balance paid on completion of work.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ Cleaning service can continue during load shedding. Appointments cannot be 
                    cancelled due to load shedding.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <p className={styles.termText}>
                    ✓ Further T&Cs apply, available upon request.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Residential Cleaning Services */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Residential Cleaning Services</h2>
              <p className={styles.introText}>
                Should you find a particular cleaning need that is not in this list feel free to get in touch with us.
              </p>
              
              {/* Standard Clean */}
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Standard Clean (Maintenance clean)</h3>
                <p className={styles.serviceDescription}>
                  Perfect for regular upkeep of your home or workspace.
                </p>
                <p className={styles.includesLabel}>Includes:</p>
                <ul className={styles.serviceList}>
                  <li>Making beds and light tidying up throughout</li>
                  <li>Dusting and wiping all surfaces</li>
                  <li>Vacuuming and mopping floors</li>
                  <li>Cleaning bathrooms (toilets, sinks, mirrors, tubs, showers - light scrub)</li>
                  <li>Cleaning kitchens (counters, exterior of appliances, sink)</li>
                  <li>Emptying bins</li>
                </ul>
              </div>

              {/* Deep Clean */}
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Deep Clean (Detailed initial clean)</h3>
                <p className={styles.serviceDescription}>
                  A more intensive clean to reach the areas often missed in regular maintenance.
                </p>
                <p className={styles.includesLabel}>Includes everything in the Standard Clean, plus:</p>
                <ul className={styles.serviceList}>
                  <li>Hand-wiping doors, door frames, baseboards, light switches and spot cleaning walls</li>
                  <li>Scrubbing grout and tiles in bathrooms and kitchens</li>
                  <li>Cleaning inside kitchen appliances (ovens, fridges and microwaves)</li>
                </ul>
              </div>

              {/* Pre-Tenancy Clean */}
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Pre and Post Tenancy Clean</h3>
                <p className={styles.serviceDescription}>
                  Get your property ready for new tenants with a fresh, high-standard clean.
                </p>
                <p className={styles.includesLabel}>Includes:</p>
                <ul className={styles.serviceList}>
                  <li>Dusting and wiping of all rooms and surfaces</li>
                  <li>Hand-wiping doors, door frames, baseboards, light switches and spot cleaning walls</li>
                  <li>Vacuuming and mopping floors</li>
                  <li>Deep clean bedrooms including internal cleaning of wardrobes</li>
                  <li>Deep clean bathrooms including internal cleaning of cupboards</li>
                  <li>Deep clean kitchens including internal cleaning of appliances and cupboards</li>
                </ul>
              </div>
            </section>

            {/* Optional Service Add-ons */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Optional Service Add-ons</h2>
              
              <div className={styles.addOnCard}>
                <h3 className={styles.addOnTitle}>Ironing per standard basket 5-7kg/25-30 items</h3>
                <p className={styles.addOnNote}>Steam-iron only</p>
              </div>

              <div className={styles.addOnCard}>
                <h3 className={styles.addOnTitle}>Int/Ext Window Clean</h3>
                <p className={styles.addOnNote}>
                  Reachable with a two-step ladder only. Window cleaning does not include outer 
                  windows on second floors or out of reach windows
                </p>
              </div>

              <div className={styles.addOnCard}>
                <h3 className={styles.addOnTitle}>Patio or Balcony Clean</h3>
                <ul className={styles.addOnList}>
                  <li>Small 10-20 square meter</li>
                  <li>Medium 20-40 square meter</li>
                  <li>Large 40+ square meter</li>
                </ul>
              </div>

              <div className={styles.addOnCard}>
                <h3 className={styles.addOnTitle}>Cupboard Sorting and Repacking charged per hour</h3>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Call to Action Section */}
            <section className={styles.ctaSection}>
              <div className={styles.ctaCard}>
                <h2 className={styles.ctaTitle}>Ready to experience the difference?</h2>
                <p className={styles.ctaText}>
                  Get your personalised quote today and let us transform your space with our professional, eco-friendly cleaning services.
                </p>
                <a href="/quote" className={styles.ctaButton}>
                  BUILD YOUR QUOTE
                </a>
              </div>
            </section>
      
      <Footer />
    </div>
  );
}

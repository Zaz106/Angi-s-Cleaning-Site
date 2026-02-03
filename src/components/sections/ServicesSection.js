import Image from 'next/image';
import styles from './ServicesSection.module.css';

/**
 * Services Section Component
 * Comprehensive display of cleaning service offerings with pricing and detailed descriptions
 * Features alternating image/content layout for visual interest and information hierarchy
 */
export default function ServicesSection() {
  return (
    <div className={styles.servicesWrapper}>
      {/* Section Header with branded styling */}
      <section className={styles.headerSection}>
        <div className={styles.topLine}></div>
        <div className={styles.container}>
          <h1 className={styles.mainHeading}>
            OUR RESIDENTIAL AND BUSINESS<br />
            CLEANING SERVICES
          </h1>
        </div>
        <div className={styles.bottomLine}></div>
      </section>

      {/* Services Display Grid with alternating layouts */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            
            {/* Standard Clean Service - Layout: Image Left, Content Right */}
            <div className={`${styles.serviceCard} ${styles.imageLeft}`}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/service_1.png"
                  alt="Standard Clean Service"
                  width={400}
                  height={300}
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.contentContainer}>
                <h3 className={styles.serviceTitle}>
                  STANDARD CLEAN <span className={styles.subtitle}>(Maintenance Clean)</span>
                </h3>
                <p className={styles.serviceDescription}>
                  Perfect for regular upkeep of your home or workspace.
                </p>
                <div className={styles.includesSection}>
                  <h4 className={styles.includesTitle}>Includes:</h4>
                  <ul className={styles.serviceList}>
                    <li>Making beds and light tidying up throughout.</li>
                    <li>Dusting and wiping all surfaces.</li>
                    <li>Vacuuming and mopping floors.</li>
                    <li>Cleaning bathrooms (toilets, sinks, mirrors, tubs, showers - light scrub).</li>
                    <li>Cleaning kitchens (counters, exterior of appliances, sink).</li>
                    <li>Emptying bins.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deep Clean */}
            <div className={`${styles.serviceCard} ${styles.imageRight}`}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/service_2.png"
                  alt="Deep Clean Service"
                  width={400}
                  height={300}
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.contentContainer}>
                <h3 className={styles.serviceTitle}>
                  DEEP CLEAN <span className={styles.subtitle}>(Detailed Initial Clean)</span>
                </h3>
                <p className={styles.serviceDescription}>
                  More intensive clean to reach the areas often missed in regular maintenance.
                </p>
                <div className={styles.includesSection}>
                  <h4 className={styles.includesTitle}>Includes everything in the Standard Clean, plus:</h4>
                  <ul className={styles.serviceList}>
                    <li>Hand-wiping doors, door frames, baseboards, light switches and spot cleaning walls.</li>
                    <li>Scrubbing grout and tiles in bathrooms and kitchens.</li>
                    <li>Cleaning inside kitchen appliances (ovens and microwaves).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pre and Post Tenancy Clean */}
            <div className={`${styles.serviceCard} ${styles.imageLeft}`}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/service_3.png"
                  alt="Pre and Post Tenancy Clean Service"
                  width={400}
                  height={300}
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.contentContainer}>
                <h3 className={styles.serviceTitle}>
                  PRE AND POST TENANCY CLEAN
                </h3>
                <p className={styles.serviceDescription}>
                  Get your property ready for new tenants with a fresh, high-standard clean or a thorough clean to help secure deposit returns or meet agency requirements.
                </p>
                <div className={styles.includesSection}>
                  <h4 className={styles.includesTitle}>Includes:</h4>
                  <ul className={styles.serviceList}>
                    <li>Dusting and wiping of all rooms and surfaces.</li>
                    <li>Hand-wiping doors, door frames, baseboards, light switches and spot cleaning walls.</li>
                    <li>Vacuuming and mopping floors.</li>
                    <li>Deep clean bedrooms including internal cleaning of wardrobes.</li>
                    <li>Deep clean bathrooms including internal cleaning of cupboards.</li>
                    <li>Deep clean kitchens including internal cleaning of appliances and cupboards.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div className={`${styles.serviceCard} ${styles.imageRight}`}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/service_4.png"
                  alt="Optional Add-ons Services"
                  width={400}
                  height={300}
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.contentContainer}>
                <h3 className={styles.serviceTitle}>
                  OPTIONAL ADD-ONS
                </h3>
                <div className={styles.includesSection}>
                  <ul className={styles.serviceList}>
                    <li>
                      <strong>Ironing per standard basket 5-7kg/25-30 items.</strong><br />
                      Steam-iron only.
                    </li>
                    <li>
                      <strong>Int/Ext Window Clean</strong><br />
                      Reachable with a two-step ladder only. Window cleaning does not include outer windows on second floors or out of reach windows.
                    </li>
                    <li>
                      <strong>Patio or Balcony Clean</strong>
                      <ul className={styles.subList}>
                        <li>Small 10-20 square meter</li>
                        <li>Medium 20-40 square meter</li>
                        <li>Large 40+ square meter</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Cupboard Sorting and Repacking</strong> charged per hour.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="quote" className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaHeading}>Ready to experience the difference?</h2>
            <p className={styles.ctaText}>
              Get your personalised quote today and let us transform your space with our professional, eco-friendly cleaning services.
            </p>
            <a href="/quote" className={styles.ctaButton}>
              <span className={styles.buttonText}>BUILD YOUR QUOTE</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

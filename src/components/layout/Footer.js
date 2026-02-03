import Image from 'next/image';
import styles from './Footer.module.css';

/**
 * Footer Component
 * Global footer with comprehensive contact information, social links, and branding
 * Features structured contact details with interactive icons and external links
 */
export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          
          {/* Contact Information Section with icon-based display */}
          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>CONTACT US</h3>
            
            <div className={styles.contactInfo}>
              {/* Location with Google Maps integration */}
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="https://www.google.com/maps/place/East+Town,+Randburg,+2195,+South+Africa" target="_blank" rel="noopener noreferrer">
                    <span>East Town Randburg, 2195</span>
                  </a>
                </div>
              </div>

              {/* Phone number with tel: protocol for mobile dialing */}
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="tel:+27795358607">
                    <span>079 535 8607</span>
                  </a>
                </div>
              </div>

              {/* Email with mailto: protocol */}
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="mailto:info@angicleans.co.za">
                    <span>info@angicleans.co.za</span>
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="https://www.angicleans.co.za" target="_blank" rel="noopener noreferrer">
                    <span>www.angicleans.co.za</span>
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="https://www.facebook.com/people/Angis-Cleaning-Service/61569794301279/?rdid=tHAFkbG3hiyOPaYK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14JC5BgNNN3%2F" target="_blank" rel="noopener noreferrer">
                    <span>Angi's Cleaning Service</span>
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <a href="https://wa.me/+27795358607" target="_blank" rel="noopener noreferrer">
                    <span>Whats App Us Directly</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className={styles.linksSection}>
            <nav className={styles.navigationLinks}>
              <a href="#" className={styles.navLink}>Home</a>
              <a href="#our-difference" className={styles.navLink}>Our Difference</a>
              <a href="#our-heart" className={styles.navLink}>Our Heart</a>
              <a href="#why-we-do-this" className={styles.navLink}>Why We Do This</a>
              <a href="#services" className={styles.navLink}>Services</a>
              <a href="#contact" className={styles.navLink}>Contact Us</a>
              <a href="#quote" className={styles.navLink}>Build a Quote</a>
            </nav>
          </div>

          {/* Map Section */}
          <div className={styles.mapSection}>
            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114639.38185700634!2d27.940872933817108!3d-26.115865764345077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9574b0839fe795%3A0x4443ba51b0acaf0d!2sRandburg!5e0!3m2!1sen!2sza!4v1752668640961!5m2!1sen!2sza" 
                width="100%" 
                height="250" 
                style={{border:0, borderRadius: '8px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Angi's Cleaning Service Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>Copyright © 2025 Angi's Cleaning Service (Pty) Ltd</p>
            <a href="./terms" className={styles.termsLink}>Terms of Use and Privacy Policy</a>
          </div>
          
          <div className={styles.designCredit}>
            <Image
              src="/images/sixfoot_footer.png"
              alt="Site Designed and Developed by Six Foot Design Co"
              width={200}
              height={40}
              className={styles.designLogo}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

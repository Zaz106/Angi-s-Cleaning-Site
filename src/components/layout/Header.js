"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from './Header.module.css';

/**
 * Header Component with Advanced Navigation Logic
 * Features responsive mobile menu, scroll-based visibility controls, and smooth navigation
 * Implements different behaviors for mobile vs desktop viewports
 */
export default function Header() {
  // Menu state management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [disableHideOnScroll, setDisableHideOnScroll] = useState(false);
  const [menuJustOpened, setMenuJustOpened] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const headerRef = useRef(null);

  /**
   * Mobile Menu Toggle Handler
   * Controls menu visibility and manages scroll-hide behavior interactions
   */
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    // Disable hide-on-scroll when menu is open to prevent unexpected behavior
    setDisableHideOnScroll(newMenuState);
    
    // Prevent immediate menu closing on scroll by setting grace period
    if (newMenuState) {
      setMenuJustOpened(true);
      setLastScrollPos(window.scrollY);
      // Clear the flag after delay to allow normal scroll behavior
      setTimeout(() => {
        setMenuJustOpened(false);
      }, 500); // 500ms grace period
    }
    
    // Reset header visibility when closing menu
    if (!newMenuState) {
      setHidden(false);
    }
  };

  /**
   * Manual Menu Close Handler
   * Used for programmatic menu closing (e.g., navigation link clicks)
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
    setDisableHideOnScroll(false);
    setHidden(false);
    setLastScrollPos(window.scrollY);
  };

  /**
   * Advanced Scroll Behavior Effect
   * Handles header visibility, sticky positioning, and menu auto-close on scroll
   * Different behaviors for mobile vs desktop viewports
   */
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-close mobile menu on scroll (with grace period)
      if (isMenuOpen && !menuJustOpened && Math.abs(currentScrollY - lastScrollPos) > 1) {
        setIsMenuOpen(false);
        setDisableHideOnScroll(false);
      }
      
      // Enhanced styling trigger for scroll-based visual changes
      setScrolled(currentScrollY > 50);
      
      // Respect menu-open state - don't hide header when menu is active
      if (disableHideOnScroll) {
        setHidden(false);
        return;
      }
      
      // Responsive behavior detection
      const isMobile = window.innerWidth <= 1024;
      
      if (isMobile) {
        // Mobile: Hide/show header based on scroll direction
        if (currentScrollY > 300) {
          if (currentScrollY > lastScrollY) {
            setHidden(true);
          } else {
            setHidden(false);
          }
        } else {
          setHidden(false);
        }
        setIsSticky(false); // No sticky behavior on mobile
      } else {
        // Desktop: Immediate sticky positioning with hide/show logic
        if (currentScrollY > 50) {
          setIsSticky(true);
          
          // Hide/show logic for desktop when sticky
          if (currentScrollY > 300) {
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
              // Scrolling down - hide header
              setHidden(true);
            } else if (currentScrollY < lastScrollY) {
              // Scrolling up - show header
              setHidden(false);
            }
          } else {
            // Always show when near top
            setHidden(false);
          }
        } else {
          setIsSticky(false);
          setHidden(false);
        }
      }
      
      lastScrollY = currentScrollY;
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also trigger once on mount to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disableHideOnScroll, isMenuOpen, menuJustOpened, lastScrollPos]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''} ${isSticky ? styles.sticky : ''}`} 
      ref={headerRef}
    >
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <a href="/">
            <Image
              src="/images/logo.png"
              alt="Angi's Cleaning Service Logo"
              width={1400}
              height={700}
              priority
              style={{
                width: '180px',
                height: '105px',
                objectFit: 'contain'
              }}
            />
          </a>
        </div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>HOME</a>
          <a href="/#our-difference" className={styles.navLink}>OUR DIFFERENCE</a>
          <a href="/#our-heart" className={styles.navLink}>OUR HEART</a>
          <a href="/#why-we-do-this" className={styles.navLink}>WHY WE DO THIS</a>
          <a href="/#services" className={styles.navLink}>SERVICES</a>
          <a href="/#contact" className={styles.navLink}>CONTACT US</a>
        </nav>
        <button 
          className={`${styles.burger} ${isMenuOpen ? styles.burgerActive : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.1s'}}>
            <a href="/" onClick={closeMenu}>HOME</a>
          </div>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.2s'}}>
            <a href="/#our-difference" onClick={closeMenu}>OUR DIFFERENCE</a>
          </div>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.3s'}}>
            <a href="/#our-heart" onClick={closeMenu}>OUR HEART</a>
          </div>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.4s'}}>
            <a href="/#why-we-do-this" onClick={closeMenu}>WHY WE DO THIS</a>
          </div>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.5s'}}>
            <a href="/#services" onClick={closeMenu}>SERVICES</a>
          </div>
          <div className={`${styles.mobileNavLink} ${isMenuOpen ? styles.rollOut : ''}`} style={{'--delay': '0.6s'}}>
            <a href="/#contact" onClick={closeMenu}>CONTACT US</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EmailForm.module.css';

/**
 * Email Capture Form Component
 * Lead generation form that collects email and redirects to quote page
 * Implements client-side navigation with email parameter passing
 */
export default function EmailForm() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  /**
   * Form Submission Handler
   * Validates email input and navigates to quote page with pre-filled email
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Navigate to quote page with email as URL parameter for seamless UX
      router.push(`/quote?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <form className={styles.emailForm} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Build Your Quote Enter Email Address"
        className={styles.emailInput}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Submit button with arrow icon for visual call-to-action */}
      <button type="submit" className={styles.submitBtn}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </form>
  );
}

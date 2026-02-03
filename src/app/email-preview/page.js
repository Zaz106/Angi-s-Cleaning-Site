"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function EmailPreviewPage() {
  // Sample data for preview
  const sampleData = {
    name: 'John Smith',
    businessName: 'Smith Enterprises',
    phone: '079 635 8907',
    email: 'john.smith@example.com',
    address: '123 Main Street, East Town, Randburg, 2194',
    selectedDate: new Date('2025-08-15'),
    serviceType: 'Deep Clean',
    propertySize: '3-bed/2-bath',
    addOns: [
      'Ironing Standard Basket',
      'Int/Ext Window Cleaning',
      'Small Patio/Balcony (10-20 sqm)'
    ],
    addOnQuantities: {
      'Ironing Standard Basket': 2,
      'Int/Ext Window Cleaning': 5,
      'Small Patio/Balcony (10-20 sqm)': 1
    },
    estimatedPrice: 2200,
    additionalNotes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    basePrice: 1600
  };

  const addOnPrices = {
    'Ironing Standard Basket': 150,
    'Int/Ext Window Cleaning': 50,
    'Small Patio/Balcony (10-20 sqm)': 200,
    'Medium Patio/Balcony (20-40 sqm)': 500,
    'Large Patio/Balcony (40+ sqm)': 800,
    'Cupboard Sorting and Repacking': 250
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format add-ons for display
  const formatAddOns = () => {
    if (!sampleData.addOns || sampleData.addOns.length === 0) return [];
    
    return sampleData.addOns.map(addOn => {
      const quantity = sampleData.addOnQuantities[addOn] || 1;
      const price = addOnPrices[addOn] || 0;
      const total = quantity * price;
      return {
        name: addOn,
        quantity,
        price,
        total
      };
    });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Email Preview</h2>
      
      {/* Email Preview */}
      <div className={styles.emailContainer}>
        {/* Single Email Design for both business and customer */}
        <div className={styles.emailContent}>
          <div className={styles.emailHeader}>
            <div className={styles.contactInfo}>
              <p>East Town</p>
              <p>Randburg, 2194</p>
              <p>079 635 8907</p>
              <p>info@angiescare.co.za</p>
            </div>
            <div className={styles.logoContainer}>
              <img src="/images/logo.png" alt="Angie's Cleaning Service" className={styles.logo} />
            </div>
          </div>

          <div className={styles.quotationTitleContainer}>
            <div className={styles.topLine}></div>
            <h1 className={styles.quotationTitle}>QUOTATION</h1>
            <div className={styles.bottomLine}></div>
          </div>

          <div className={styles.quotationContent}>
            {/* Customer Info Section */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Customer Information</h3>
              <div className={styles.modalGrid}>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Name:</span>
                  <span className={styles.modalValue}>{sampleData.name}</span>
                </div>
                {sampleData.businessName && (
                  <div className={styles.modalItem}>
                    <span className={styles.modalLabel}>Business:</span>
                    <span className={styles.modalValue}>{sampleData.businessName}</span>
                  </div>
                )}
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Phone:</span>
                  <span className={styles.modalValue}>{sampleData.phone}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Email:</span>
                  <span className={styles.modalValue}>{sampleData.email}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Address:</span>
                  <span className={styles.modalValue}>{sampleData.address}</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Service Details</h3>
              <div className={styles.modalGrid}>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Service Type:</span>
                  <span className={styles.modalValue}>{sampleData.serviceType}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Property Size:</span>
                  <span className={styles.modalValue}>{sampleData.propertySize}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Preferred Date:</span>
                  <span className={styles.modalValue}>{formatDate(sampleData.selectedDate)}</span>
                </div>
              </div>
            </div>

            {/* Quotation Lines */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Quotation</h3>
              <div className={styles.modalPriceSummary}>
                <div className={styles.modalPriceBreakdown}>
                  <div className={styles.modalPriceItem}>
                    <span>Base Service - {sampleData.serviceType}</span>
                    <span>R {sampleData.basePrice.toFixed(2)}</span>
                  </div>
                  
                  {formatAddOns().map((addOn, index) => (
                    <div key={index} className={styles.modalPriceItem}>
                      <span>{addOn.name} (Qty: {addOn.quantity})</span>
                      <span>R {addOn.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.modalTotalPrice}>
                  <span>Total</span>
                  <span>R {sampleData.estimatedPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {sampleData.additionalNotes && (
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Additional Notes</h3>
                <p className={styles.modalValue}>{sampleData.additionalNotes}</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Terms and Conditions</h3>
              <div className={styles.termsText}>
                <ul>
                  <li>We do not offer cleaning for the following:</li>
                  <ul>
                    <li>Extreme, hardened soap scum in bathrooms, due to a lack of regular cleaning maintenance.</li>
                    <li>Extreme, hardened grease in kitchens, due to a lack of regular cleaning maintenance.</li>
                  </ul>
                  <li>Unreasonably dirty and cluttered homes will be subject to an additional fee.</li>
                  <li>We are able to assist with a vacuum cleaner. As an extra precaution, we request Clients to have their personal vacuum cleaner on hand for our use, to prevent cross-contamination between properties and spreading allergens. Please kindly advise.</li>
                  <li>We provide all necessary equipment and Eco-friendly and Biodegradable products.</li>
                  <li>No travel charged within a 5km radius.</li>
                  <li>50% deposit required on acceptance of booking. Balance paid on completion of work.</li>
                  <li>Cleaning service can continue during load shedding. Appointments cannot be cancelled due to load shedding.</li>
                  <li>Further T&Cs apply, available upon request.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

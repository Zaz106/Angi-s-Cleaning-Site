"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/layout/Header";
import SocialsBar from "../../components/layout/SocialsBar";
import Footer from "../../components/layout/Footer";
import CustomCalendar from "../../components/ui/CustomCalendar";
import CustomNumberInput from "../../components/ui/CustomNumberInput";
import styles from "./page.module.css";

/**
 * Quote Page Content Component
 * Interactive form for service quote requests with real-time pricing calculation
 * Features multi-step validation, email integration, and confirmation modals
 */
function QuotePageContent() {
  const searchParams = useSearchParams();

  // Modal and submission state management
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { status: 'success'|'error', message: '' }

  // Main form data state with complete customer and service information
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    address: "",
    selectedDate: null,
    serviceType: "",
    propertySize: "",
    squareMeters: "",
    addOns: [],
    addOnQuantities: {},
    estimatedPrice: 0,
  });

  /**
   * Pricing Structure Configuration
   * Organized by service type and property size for accurate quote generation
   * Prices in South African Rand (ZAR)
   */
  // Pricing keys must match the service option labels used in the form
  const pricingStructure = {
    "Standard Clean (FURNISHED)": {
      "1-bed/1-bath": 450,
      "2-bed/1-bath": 600,
      "3-bed/2-bath": 800,
      "4-bed/2+-bath": 1000,
      "5-bed/2+-bath": 1200,
    },
    "Deep Clean (FURNISHED)": {
      "1-bed/1-bath": 800,
      "2-bed/1-bath": 1200,
      "3-bed/2-bath": 1600,
      "4-bed/2+-bath": 2000,
      "5-bed/2+-bath": 2400,
    },
    "Pre and Post Tenancy Deposit Clean (UNFURNISHED)": {
      "1-bed/1-bath": 1000,
      "2-bed/1-bath": 1500,
      "3-bed/2-bath": 2000,
      "4-bed/2+-bath": 2500,
      "5-bed/2+-bath": 3000,
    },
  };

  /**
   * Add-on Services Pricing
   * Additional services with per-unit pricing for flexible customization
   */
  const addOnPrices = {
    "Ironing Standard Basket": 150,
    "Int/Ext Window Cleaning": 50, // per window
    "Small Patio/Balcony (10-20 sqm)": 200,
    "Medium Patio/Balcony (20-40 sqm)": 500,
    "Large Patio/Balcony (40+ sqm)": 800,
    "Cupboard Sorting and Repacking": 250, // per hour
  };

  /**
   * Service Descriptions
   * Detailed explanations for customer understanding and transparency
   */
  const serviceDescriptions = {
    "Standard Clean (FURNISHED)": {
      description:
        "Regular maintenance cleaning including dusting, vacuuming, mopping, and basic bathroom/kitchen cleaning. Perfect for furnished properties.",
    },
    "Deep Clean (FURNISHED)": {
      description:
        "Thorough cleaning including inside appliances, detailed scrubbing, and areas not covered in standard cleaning. Ideal for furnished properties needing intensive cleaning.",
    },
    "Pre and Post Tenancy Clean (UNFURNISHED)": {
      description:
        "Comprehensive end-of-lease or pre-tenancy cleaning to ensure property standards. Includes all areas, detailed cleaning, and internal cupboard/appliance cleaning for unfurnished properties.",
    },
  };

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  // Calculate estimated price
  useEffect(() => {
    let basePrice = 0;

    // Get base price from service type and property size
    if (
      formData.serviceType &&
      formData.propertySize &&
      pricingStructure[formData.serviceType]
    ) {
      basePrice =
        pricingStructure[formData.serviceType][formData.propertySize] || 0;
    }

    // Add addon prices with quantities
    let addOnTotal = 0;
    formData.addOns.forEach((addOn) => {
      if (addOnPrices[addOn]) {
        const quantity = formData.addOnQuantities[addOn] || 1;
        addOnTotal += addOnPrices[addOn] * quantity;
      }
    });

    setFormData((prev) => ({
      ...prev,
      estimatedPrice: basePrice + addOnTotal,
    }));
  }, [
    formData.serviceType,
    formData.propertySize,
    formData.addOns,
    formData.addOnQuantities,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "addOns") {
        setFormData((prev) => ({
          ...prev,
          addOns: checked
            ? [...prev.addOns, value]
            : prev.addOns.filter((item) => item !== value),
          // Initialize quantity to 1 when adding, remove when unchecking
          addOnQuantities: checked
            ? {
                ...prev.addOnQuantities,
                [value]: prev.addOnQuantities[value] || 1,
              }
            : { ...prev.addOnQuantities, [value]: undefined },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (addOnName, quantity) => {
    setFormData((prev) => ({
      ...prev,
      addOnQuantities: {
        ...prev.addOnQuantities,
        [addOnName]: Math.max(1, parseInt(quantity) || 1),
      },
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({ ...prev, selectedDate: newDate }));
  };

  // Get today's date for minimum date validation
  const getTodayDate = () => {
    return new Date();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmQuote = async () => {
    setIsSubmitting(true);

    try {
      // Prepare necessary email data only
      // Backend calculates pricing and add-ons using authoritative data
      const emailData = {
        name: formData.name,
        businessName: formData.businessName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        selectedDate: formData.selectedDate,
        serviceType: formData.serviceType,
        propertySize: formData.propertySize,
        squareMeters: formData.squareMeters,
        addOns: formData.addOns,
        addOnQuantities: formData.addOnQuantities,
        additionalNotes: additionalNotes,
      };

      // Send email
      const response = await fetch("/api/send-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      // Close the confirmation modal first
      setShowConfirmation(false);

      if (response.ok) {
        // Show success modal
        setSubmitResult({
          status: "success",
          message:
            "Your quote request has been sent successfully! Our team has received your request and will get back to you within 24 hours.",
        });
        setShowResultModal(true);

        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: "",
            businessName: "",
            phone: "",
            email: "",
            address: "",
            selectedDate: null,
            serviceType: "",
            propertySize: "",
            squareMeters: "",
            addOns: [],
            addOnQuantities: {},
            estimatedPrice: 0,
          });
          setAdditionalNotes("");
        }, 100);
      } else {
        const errorData = await response.json();
        console.error("Email send error:", errorData);
        // Show error modal
        setSubmitResult({
          status: "error",
          message:
            "Sorry, there was an error sending your quote. Please try again or contact us directly at info@angicleans.co.za.",
        });
        setShowResultModal(true);
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      // Close confirmation modal and show error
      setShowConfirmation(false);
      setSubmitResult({
        status: "error",
        message:
          "Sorry, there was an error sending your quote. Please try again or contact us directly at info@angicleans.co.za.",
      });
      setShowResultModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    setShowConfirmation(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Result modal component
  const renderResultModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.resultModalContainer}>
        <div className={styles.resultModalContent}>
          {submitResult?.status === "success" ? (
            <>
              {submitResult.status === "success" ? (
                <div className={styles.successIcon}></div>
              ) : (
                <div className={styles.errorIcon}></div>
              )}
              <h2 className={styles.resultTitle}>Quote Sent Successfully!</h2>
              <p className={styles.resultMessage}>{submitResult.message}</p>
            </>
          ) : (
            <>
              <div className={styles.errorIcon}>X</div>
              <h2 className={styles.resultTitle}>Error Sending Quote</h2>
              <p className={styles.resultMessage}>{submitResult.message}</p>
            </>
          )}

          <div className={styles.resultActions}>
            {submitResult?.status === "success" ? (
              <button
                type="button"
                className={styles.resultButton}
                onClick={() => {
                  setShowResultModal(false);
                  setSubmitResult(null);
                }}
              >
                Continue
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.resultButtonSecondary}
                  onClick={() => {
                    setShowResultModal(false);
                    setSubmitResult(null);
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={styles.resultButton}
                  onClick={() => {
                    setShowResultModal(false);
                    setSubmitResult(null);
                    setShowConfirmation(true);
                  }}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Confirmation component
  const renderConfirmation = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirm Your Quote</h2>
          <button
            className={styles.modalCloseButton}
            onClick={handleBackToForm}
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalSubtitle}>
            Review your details below and add any additional notes before
            confirming.
          </p>

          <div className={styles.modalSections}>
            {/* Personal Information */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Personal Information</h3>
              <div className={styles.modalGrid}>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Name:</span>
                  <span className={styles.modalValue}>{formData.name}</span>
                </div>
                {formData.businessName && (
                  <div className={styles.modalItem}>
                    <span className={styles.modalLabel}>Business:</span>
                    <span className={styles.modalValue}>
                      {formData.businessName}
                    </span>
                  </div>
                )}
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Phone:</span>
                  <span className={styles.modalValue}>{formData.phone}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Email:</span>
                  <span className={styles.modalValue}>{formData.email}</span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Address:</span>
                  <span className={styles.modalValue}>{formData.address}</span>
                </div>
              </div>
            </div>

            {/* Service Summary */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Service Summary</h3>
              <div className={styles.modalGrid}>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Service Type:</span>
                  <span className={styles.modalValue}>
                    {formData.serviceType}
                  </span>
                </div>
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Property Size:</span>
                  <span className={styles.modalValue}>
                    {formData.propertySize}
                  </span>
                </div>
                {formData.squareMeters && (
                  <div className={styles.modalItem}>
                    <span className={styles.modalLabel}>Square Meters:</span>
                    <span className={styles.modalValue}>
                      {formData.squareMeters} m²
                    </span>
                  </div>
                )}
                <div className={styles.modalItem}>
                  <span className={styles.modalLabel}>Preferred Date:</span>
                  <span className={styles.modalValue}>
                    {formatDate(formData.selectedDate)}
                  </span>
                </div>
              </div>

              {/* Add-ons within same section */}
              {formData.addOns.length > 0 && (
                <div className={styles.modalAddOnsContainer}>
                  <h4 className={styles.modalSubsectionTitle}>
                    Add-on Services
                  </h4>
                  <div className={styles.modalAddOnsList}>
                    {formData.addOns.map((addOn, index) => (
                      <div key={index} className={styles.modalAddOn}>
                        <span className={styles.modalAddOnName}>{addOn}</span>
                        <span className={styles.modalAddOnDetails}>
                          Qty: {formData.addOnQuantities[addOn] || 1} × R
                          {addOnPrices[addOn]} = R
                          {(formData.addOnQuantities[addOn] || 1) *
                            addOnPrices[addOn]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                Additional Notes or Questions
              </h3>
              <textarea
                className={styles.modalNotesTextarea}
                placeholder="Is there anything else you'd like us to know about your cleaning requirements?"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows="4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.modalBackButton}
              onClick={handleBackToForm}
              disabled={isSubmitting}
            >
              Back to Edit
            </button>
            <button
              type="button"
              className={styles.modalConfirmButton}
              onClick={handleConfirmQuote}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  Sending
                  <span className={styles.loadingDots}>
                    <span className={styles.dot1}>.</span>
                    <span className={styles.dot2}>.</span>
                    <span className={styles.dot3}>.</span>
                  </span>
                </>
              ) : (
                "Confirm & Send Quote"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.desktopSocialsBar}>
        <SocialsBar />
      </div>
      <Header />

      <div className={styles.quotePageWrapper}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerOverlay}></div>
          <div className={styles.headerContent}>
            <div className={styles.topLine}></div>
            <h1 className={styles.mainHeading}>BUILD YOUR QUOTE</h1>
            <div className={styles.bottomLine}></div>
          </div>
        </div>

        {/* Quote Form Section */}
        <div className={styles.formSection}>
          <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.quoteForm}>
              {/* Step 1 - Personal Information */}
              <div className={styles.formStep}>
                <h2 className={styles.stepNumber}>1</h2>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name and Surname"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name (if company)"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Cellphone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (required to send you a quote via email)"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Step 2 - Date Selection */}
              <div className={styles.formStep}>
                <h2 className={styles.stepNumber}>2</h2>
                <p className={styles.stepLabel}>
                  Select your preferred cleaning date:
                </p>
                <div className={styles.customCalendarWrapper}>
                  <CustomCalendar
                    value={formData.selectedDate}
                    onChange={handleDateChange}
                    minDate={getTodayDate()}
                  />
                </div>
              </div>

              {/* Step 3 - Service Type */}
              <div className={styles.formStep}>
                <h2 className={styles.stepNumber}>3</h2>
                <p className={styles.stepLabel}>
                  Select required cleaning service:
                </p>
                <div className={styles.serviceOptions}>
                  {[
                    "Standard Clean (FURNISHED)",
                    "Deep Clean (FURNISHED)",
                    "Pre and Post Tenancy Clean (UNFURNISHED)",
                  ].map((option) => (
                    <div key={option} className={styles.serviceOption}>
                      <label className={styles.serviceLabel}>
                        <input
                          type="radio"
                          name="serviceType"
                          value={option}
                          checked={formData.serviceType === option}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <div className={styles.serviceContent}>
                          <div className={styles.serviceHeader}>
                            <span className={styles.serviceName}>{option}</span>
                          </div>
                          <p className={styles.serviceDescription}>
                            {serviceDescriptions[option].description}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4 - Property Size */}
              <div className={styles.formStep}>
                <h2 className={styles.stepNumber}>4</h2>
                <p className={styles.stepLabel}>Select your home size:</p>
                <div className={styles.propertySizeOptions}>
                  {[
                    "1-bed/1-bath",
                    "2-bed/1-bath",
                    "3-bed/2-bath",
                    "4-bed/2+-bath",
                    "5-bed/2+-bath",
                  ].map((option) => {
                    const price =
                      formData.serviceType &&
                      pricingStructure[formData.serviceType]
                        ? pricingStructure[formData.serviceType][option]
                        : 0;

                    return (
                      <label key={option} className={styles.propertySizeLabel}>
                        <input
                          type="radio"
                          name="propertySize"
                          value={option}
                          checked={formData.propertySize === option}
                          onChange={handleInputChange}
                          className={styles.radioInput}
                        />
                        <div className={styles.propertySizeContent}>
                          <span className={styles.propertyName}>
                            {option === "1-bed/1-bath" &&
                              "Apartment (1 bed/1 bath)"}
                            {option === "2-bed/1-bath" &&
                              "House (2 bed/1 bath)"}
                            {option === "3-bed/2-bath" &&
                              "House (3 bed/2 bath)"}
                            {option === "4-bed/2+-bath" &&
                              "House (4 bed/2+ bath)"}
                            {option === "5-bed/2+-bath" &&
                              "House (5 bed/2+ bath)"}
                          </span>
                          {/* Price intentionally hidden here — calculations are done server-side */}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Square Meters Input */}
                <div className={styles.squareMetersSection}>
                  <p className={styles.stepLabel}>Property size in square meters (optional):</p>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      name="squareMeters"
                      value={formData.squareMeters}
                      onChange={handleInputChange}
                      placeholder="Enter square meters"
                      className={styles.formInput}
                      min="0"
                      step="1"
                    />
                    <span className={styles.inputSuffix}>m²</span>
                  </div>
                </div>
              </div>

              {/* Step 5 - Add-on Services */}
              <div className={styles.formStep}>
                <h2 className={styles.stepNumber}>5</h2>
                <p className={styles.stepLabel}>Select your Add-ons:</p>
                <div className={styles.addOnOptions}>
                  {[
                    {
                      id: "ironing",
                      label: "Ironing Standard Basket",
                      price: "R150 per basket",
                      hasQuantity: true,
                    },
                    {
                      id: "window-cleaning",
                      label: "Int/Ext Window Cleaning",
                      price: "R50 per window",
                      hasQuantity: true,
                    },
                    {
                      id: "small-patio",
                      label: "Small Patio/Balcony (10-20 sqm)",
                      price: "R200",
                      hasQuantity: false,
                    },
                    {
                      id: "medium-patio",
                      label: "Medium Patio/Balcony (20-40 sqm)",
                      price: "R500",
                      hasQuantity: false,
                    },
                    {
                      id: "large-patio",
                      label: "Large Patio/Balcony (40+ sqm)",
                      price: "R800",
                      hasQuantity: false,
                    },
                    {
                      id: "cupboard-sorting",
                      label: "Cupboard Sorting and Repacking",
                      price: "R250 per hour",
                      hasQuantity: true,
                    },
                  ].map((option) => (
                    <div key={option.id} className={styles.addOnItem}>
                      <label className={styles.addOnLabel}>
                        <input
                          type="checkbox"
                          name="addOns"
                          value={option.label}
                          checked={formData.addOns.includes(option.label)}
                          onChange={handleInputChange}
                          className={styles.checkboxInput}
                        />
                        <div className={styles.addOnContent}>
                          <div className={styles.addOnInfo}>
                            <span className={styles.addOnName}>
                              {option.label}
                            </span>
                            <span className={styles.addOnPrice}>
                              ({option.price})
                            </span>
                          </div>
                        </div>
                      </label>

                      {/* Quantity selector for selected items */}
                      {formData.addOns.includes(option.label) &&
                        option.hasQuantity && (
                          <div className={styles.quantitySelector}>
                            <div className={styles.sliderContainer}>
                              <label className={styles.sliderLabel}>
                                Quantity:
                              </label>
                              <CustomNumberInput
                                value={
                                  formData.addOnQuantities[option.label] || 1
                                }
                                onChange={(value) =>
                                  handleQuantityChange(option.label, value)
                                }
                                min={1}
                                max={20}
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Estimate */}
              {/* {formData.estimatedPrice > 0 && (
                              <div className={styles.formStep}>
                                <h2 className={styles.stepNumber}>6</h2>
                                <p className={styles.stepLabel}>Estimated Price:</p>
                                <div className={styles.priceDisplay}>
                                <span className={styles.priceAmount}>R{formData.estimatedPrice}</span>
                                <span className={styles.priceNote}>
                                  *Base price for {formData.serviceType} service. Final quote may vary based on specific requirements.
                                </span>
                                </div>
                              </div>
                              )} */}

              {/* Submit Button */}
              <div className={styles.submitSection}>
                <button type="submit" className={styles.submitButton}>
                  EMAIL YOUR QUOTE
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Overlays */}
        {showConfirmation && renderConfirmation()}
        {showResultModal && renderResultModal()}
      </div>

      <Footer />
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
        </div>
      }
    >
      <QuotePageContent />
    </Suspense>
  );
}

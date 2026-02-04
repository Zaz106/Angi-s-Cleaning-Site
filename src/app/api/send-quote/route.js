import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// --- Security & Protection ---

/**
 * Basic In-memory Rate Limiter
 * Limits requests based on IP address to prevent abuse.
 * In production serverless environments, this will reset when the worker restarts.
 * For persistent servers like Plesk, this will persist in memory.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // 3 requests per 15 mins

function isRateLimited(ip) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip);

  if (!userData) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  // Check if window has expired
  if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (userData.count >= MAX_REQUESTS) {
    return true;
  }

  userData.count += 1;
  return false;
}

// Memory cleanup for rate limiter (runs once an hour if called)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 60 * 1000).unref(); // unref prevents this from keeping node alive

/**
 * Escapes HTML characters to prevent XSS in email content
 */
function escapeHtml(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Route Handler ---

/**
 * Quote Email API Route Handler
 * Processes quote requests and sends professional email notifications
 * Integrates with Gmail SMTP for reliable email delivery
 */
export async function POST(request) {
  try {
    // 1. Rate Limiting Check
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               'unknown-ip';
    
    if (isRateLimited(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.', success: false },
        { status: 429 }
      );
    }

    const body = await request.json();
    let { 
      name, 
      businessName, 
      phone, 
      email, 
      address, 
      selectedDate, 
      serviceType, 
      propertySize, 
      squareMeters,
      addOns, 
      addOnQuantities, 
      additionalNotes
    } = body;

    // 2. Input Sanitization & Basic Validation
    name = escapeHtml(name).substring(0, 100);
    businessName = escapeHtml(businessName).substring(0, 100);
    phone = escapeHtml(phone).substring(0, 50);
    email = escapeHtml(email).substring(0, 100); 
    address = escapeHtml(address).substring(0, 255);
    serviceType = escapeHtml(serviceType).substring(0, 100);
    propertySize = escapeHtml(propertySize).substring(0, 100);
    additionalNotes = escapeHtml(additionalNotes).substring(0, 1000);
    squareMeters = parseInt(squareMeters) || 0;

    // Basic required fields validation
    if (!name || !email || !serviceType || !propertySize) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Email format validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address', success: false },
        { status: 400 }
      );
    }

    // Backend-side pricing structure for reliability
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

    // Normalize serviceType labels (client and server labels may differ slightly)
    const serviceTypeAliases = {
      // client uses this label in the form; server pricingStructure used 'Deposit' word
      "Pre and Post Tenancy Clean (UNFURNISHED)": "Pre and Post Tenancy Deposit Clean (UNFURNISHED)",
    };

    const normalizedServiceType = serviceTypeAliases[serviceType] || serviceType;

    // Calculate base price on backend for reliability
    let basePrice = 0;
    if (normalizedServiceType && propertySize && pricingStructure[normalizedServiceType]) {
      basePrice = pricingStructure[normalizedServiceType][propertySize] || 0;
    } else {
      console.warn('Base price lookup failed for serviceType:', serviceType, 'normalized:', normalizedServiceType);
    }

    // Backend add-on prices (authoritative)
    const addOnPrices = {
      "Ironing Standard Basket": 150,
      "Int/Ext Window Cleaning": 50,
      "Small Patio/Balcony (10-20 sqm)": 200,
      "Medium Patio/Balcony (20-40 sqm)": 500,
      "Large Patio/Balcony (40+ sqm)": 800,
      "Cupboard Sorting and Repacking": 250,
    };

    /**
     * Gmail SMTP Configuration
     * Uses environment variables for secure authentication
     */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Gmail app password
      }
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      return NextResponse.json(
        { 
          error: 'Email service currently unavailable', 
          success: false 
        },
        { status: 503 }
      );
    }

    // Calculate total price and format add-ons
    const calculatePricing = () => {
      let total = basePrice;
      const formattedAddOns = [];

      if (addOns && addOns.length > 0) {
        addOns.forEach(addOn => {
          const quantity = addOnQuantities && addOnQuantities[addOn] ? addOnQuantities[addOn] : 1;
          const price = addOnPrices[addOn] || 0;
          const addonTotal = quantity * price;
          total += addonTotal;

          formattedAddOns.push({
            name: escapeHtml(addOn),
            quantity,
            price,
            total: addonTotal
          });
        });
      }

      return { total, formattedAddOns };
    };

    const { total: finalTotal, formattedAddOns } = calculatePricing();

    // Get logo for email embedding
    const fs = require('fs');
    const path = require('path');
    let logoAttachment = null;
    let hasLogo = false;
    
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
      
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        hasLogo = true;
        
        // Prepare as attachment with Content-ID (CID) for inline display
        logoAttachment = {
          filename: 'logo.png',
          content: logoBuffer,
          contentType: 'image/png',
          cid: 'logo@angiescare'
        };
      }
    } catch (logoError) {
      console.error('Error loading logo:', logoError.message);
    }

    // Format date
    const formatDate = (date) => {
      if (!date) return 'Not selected';
      return new Date(date).toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

  // finalize pricing already calculated via calculatePricing() above

  // Table-based email design for cross-client compatibility
  // (footer social links will use inline SVG icons below)

    const emailHtml = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--<![endif]-->
        <title>Angie's Cleaning Service Quotation</title>
        <style type="text/css">
          /* Reset styles */
          #outlook a { padding: 0; }
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
          
          /* Force light mode */
          * { color-scheme: light !important; }
          
          /* Base styles */
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #231F20;
            background-color: #f5f5f5;
          }
          
          .email-wrapper {
            background-color: #f5f5f5;
            padding: 20px 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }
          
          /* Logo row */
          .logo-row {
            background-color: #ffffff;
            padding: 30px 0 20px 0;
          }
          
          .logo-cell {
            text-align: center;
            padding: 0 20px;
          }
          
          .logo-img {
            max-height: 80px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          
          /* Contact info row */
          .contact-row {
            background-color: #ffffff;
            padding: 0 0 10px 0;
          }
          
          .contact-cell {
            text-align: center;
            padding: 0 20px;
            font-size: 14px;
            color: #231F20;
            line-height: 1.4;
          }
          
          /* Title section */
          .title-row {
            background-color: #ffffff;
            padding: 30px 0;
          }
          
          .title-cell {
            text-align: center;
            padding: 0 20px;
          }
          
          .title-line {
            width: 150px;
            height: 2px;
            background-color: #000000;
            margin: 10px auto;
            display: block;
          }
          
          .title-text {
            font-family: Arial, sans-serif;
            font-size: 32px;
            font-weight: bold;
            color: #000000;
            margin: 0;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          /* Content sections */
          .section-row {
            background-color: #ffffff;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .section-cell {
            padding: 20px 30px;
          }
          
          .section-title {
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          /* Info items */
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .info-row {
            border: none;
          }
          
          .info-label {
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            padding: 8px 0;
            width: 40%;
            vertical-align: top;
          }
          
          .info-value {
            font-size: 14px;
            color: #231F20;
            padding: 8px 0;
            width: 60%;
            text-align: right;
            vertical-align: top;
          }
          
          /* Price summary */
          .price-summary {
            background-color: #f8fdf8;
            border: 2px solid #568E4A;
            border-radius: 8px;
            padding: 25px;
            margin-top: 20px;
          }
          
          .price-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .price-item {
            border: none;
            padding: 8px 0;
          }
          
          .price-label {
            font-size: 14px;
            color: #000000;
            padding: 8px 0;
            text-align: left;
            line-height: 1.4;
          }
          
          .price-amount {
            font-size: 14px;
            color: #000000;
            padding: 8px 0;
            text-align: right;
            line-height: 1.4;
          }
          
          .separator-line {
            width: 85%;
            height: 2px;
            background-color: #568E4A;
            margin: 20px auto 15px auto;
            display: block;
          }
          
          .total-row {
            padding-top: 10px;
            margin-top: 0;
          }
          
          .total-label {
            font-family: Arial, sans-serif;
            font-size: 18px;
            font-weight: bold;
            color: #568E4A;
            padding: 10px 0;
          }
          
          .total-amount {
            font-family: Arial, sans-serif;
            font-size: 18px;
            font-weight: bold;
            color: #568E4A;
            padding: 10px 0;
            text-align: right;
          }
          
          /* Terms list */
          .terms-text {
            font-size: 13px;
            color: #000000;
            line-height: 1.5;
          }
          
          .terms-list {
            margin: 0;
            padding-left: 20px;
          }
          
          .terms-item {
            margin-bottom: 8px;
            color: #000000;
          }
          
          .terms-sublist {
            margin: 5px 0 10px 0;
            padding-left: 20px;
          }
          
          /* Mobile styles */
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100% !important;
              border-radius: 0 !important;
              margin: 0 !important;
            }
            
            .email-wrapper {
              padding: 0 !important;
            }
            
            .logo-row,
            .contact-row,
            .title-row {
              padding-left: 10px !important;
              padding-right: 10px !important;
            }
            
            .section-cell {
              padding: 15px 20px !important;
            }
            
            .title-text {
              font-size: 24px !important;
            }
            
            .title-line {
              width: 100px !important;
            }
            
            .info-label,
            .info-value {
              display: block !important;
              width: 100% !important;
              text-align: left !important;
              padding: 4px 0 !important;
            }
            
            .info-value {
              font-weight: bold;
              margin-bottom: 12px;
            }
          }
        </style>
        <!--[if mso]>
        <style type="text/css">
          .email-container {
            width: 600px !important;
          }
          .title-text {
            font-family: Arial, sans-serif !important;
          }
          .section-title {
            font-family: Arial, sans-serif !important;
          }
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <!--[if mso]>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
        <td align="center" style="background-color: #f5f5f5; padding: 20px 0;">
        <![endif]-->
        
        <div class="email-wrapper" style="background-color: #f5f5f5; padding: 20px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            
            <!-- Logo Row -->
            <tr>
              <td class="logo-row" style="background-color: #ffffff; padding: 30px 0 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="logo-cell" style="text-align: center; padding: 0 20px;">
                      ${hasLogo ? `<img src="cid:logo@angiescare" alt="Angie's Cleaning Service" class="logo-img" style="max-height: 80px; width: auto; height: auto; display: block; margin: 0 auto; border: 0; -ms-interpolation-mode: bicubic;" />` : '<div style="height: 80px; text-align: center; color: #568E4A; font-weight: bold; line-height: 80px;">Angie\'s Cleaning Service</div>'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Contact Info Row -->
            <tr>
              <td class="contact-row" style="background-color: #ffffff; padding: 0 0 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="contact-cell" style="text-align: center; padding: 0 20px; font-size: 14px; color: #231F20; line-height: 1.4;">
                      East Town<br>
                      Randburg, 2195<br>
                      079 535 8607<br>
                      info@angicleans.co.za
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Title Section -->
            <tr>
              <td class="title-row" style="background-color: #ffffff; padding: 30px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="title-cell" style="text-align: center; padding: 0 20px;">
                      <!--[if mso]>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="150" align="center">
                      <tr><td height="2" style="background-color: #000000; line-height: 1px; font-size: 1px;">&nbsp;</td></tr>
                      </table>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <div class="title-line" style="width: 150px; height: 2px; background-color: #000000; margin: 10px auto; display: block;"></div>
                      <!--<![endif]-->
                      
                      <h1 class="title-text" style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; color: #000000; margin: 0; text-align: center; text-transform: uppercase; letter-spacing: 2px;">QUOTATION</h1>
                      
                      <!--[if mso]>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="150" align="center">
                      <tr><td height="2" style="background-color: #000000; line-height: 1px; font-size: 1px;">&nbsp;</td></tr>
                      </table>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <div class="title-line" style="width: 150px; height: 2px; background-color: #000000; margin: 10px auto; display: block;"></div>
                      <!--<![endif]-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Customer Information Section -->
            <tr>
              <td class="section-row" style="background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="section-cell" style="padding: 20px 30px;">
                      <h3 class="section-title" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #000000; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">Customer Information</h3>
                      
                      <table class="info-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Name:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${name}</td>
                        </tr>
                        ${businessName ? `
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Business:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${businessName}</td>
                        </tr>
                        ` : ''}
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Phone:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${phone}</td>
                        </tr>
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Email:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${email}</td>
                        </tr>
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Address:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${address}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Service Details Section -->
            <tr>
              <td class="section-row" style="background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="section-cell" style="padding: 20px 30px;">
                      <h3 class="section-title" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #000000; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">Service Details</h3>
                      
                      <table class="info-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Service Type:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${serviceType}</td>
                        </tr>
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Property Size:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${propertySize}</td>
                        </tr>
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Square Meters:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${squareMeters ? squareMeters + ' m²' : 'Not specified'}</td>
                        </tr>
                        <tr class="info-row">
                          <td class="info-label" style="font-size: 14px; font-weight: 500; color: #666666; padding: 8px 0; width: 40%; vertical-align: top;">Preferred Date:</td>
                          <td class="info-value" style="font-size: 14px; color: #231F20; padding: 8px 0; width: 60%; text-align: right; vertical-align: top;">${formatDate(selectedDate)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Quotation Section -->
            <tr>
              <td class="section-row" style="background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="section-cell" style="padding: 20px 40px;">
                      <h3 class="section-title" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #000000; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Summary</h3>
                      
                      <!--[if mso]>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fdf8;">
                        <tr>
                          <td style="border: 1px solid #568E4A; padding: 25px;">
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <div style="border: 1px solid #568E4A; border-radius: 8px; background-color: #f8fdf8; padding: 25px; margin-top: 15px;">
                      <!--<![endif]-->
                      
                            <table class="price-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                              <tr class="price-item">
                                <td class="price-label" style="font-size: 14px; color: #000000; padding: 8px 0; text-align: left; line-height: 1.4;">Base Service - ${serviceType}</td>
                                <td class="price-amount" style="font-size: 14px; color: #000000; padding: 8px 0; text-align: right; line-height: 1.4;">R ${basePrice.toFixed(2)}</td>
                              </tr>
                              ${formattedAddOns.map(addOn => `
                              <tr class="price-item">
                                <td class="price-label" style="font-size: 14px; color: #000000; padding: 8px 0; text-align: left; line-height: 1.4;">${addOn.name} (Qty: ${addOn.quantity})</td>
                                <td class="price-amount" style="font-size: 14px; color: #000000; padding: 8px 0; text-align: right; line-height: 1.4;">R ${addOn.total.toFixed(2)}</td>
                              </tr>
                              `).join('')}
                            </table>
                            
                            <!-- Separator line with limited width -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0 15px 0;">
                              <tr>
                                <td style="text-align: center;">
                                  <!--[if mso]>
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80%" align="center">
                                    <tr><td height="2" style="background-color: #568E4A; line-height: 1px; font-size: 1px;">&nbsp;</td></tr>
                                  </table>
                                  <![endif]-->
                                  <!--[if !mso]><!-->
                                  <div style="width: 80%; height: 2px; background-color: #568E4A; margin: 0 auto; display: block;"></div>
                                  <!--<![endif]-->
                                </td>
                              </tr>
                            </table>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td class="total-label" style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #568E4A; padding: 10px 0; text-align: left;">Total</td>
                                <td class="total-amount" style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #568E4A; padding: 10px 0; text-align: right;">R ${finalTotal.toFixed(2)}</td>
                              </tr>
                            </table>
                            
                      <!--[if mso]>
                          </td>
                        </tr>
                      </table>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      </div>
                      <!--<![endif]-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            ${additionalNotes ? `
            <!-- Additional Notes Section -->
            <tr>
              <td class="section-row" style="background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="section-cell" style="padding: 20px 30px;">
                      <h3 class="section-title" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #000000; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">Additional Notes</h3>
                      <p style="font-size: 14px; color: #231F20; margin: 0; line-height: 1.6;">${additionalNotes}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ` : ''}
            
            <!-- Terms and Conditions Section -->
            <tr>
              <td class="section-row" style="background-color: #ffffff;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="section-cell" style="padding: 20px 30px;">
                      <h3 class="section-title" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #000000; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">Terms and Conditions</h3>
                      <div class="terms-text" style="font-size: 13px; color: #000000; line-height: 1.5;">
                        <ul class="terms-list" style="margin: 0; padding-left: 20px;">
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">We do not offer cleaning for the following:</li>
                          <ul class="terms-sublist" style="margin: 5px 0 10px 0; padding-left: 20px;">
                            <li style="margin-bottom: 5px; color: #000000;">Extreme, hardened soap scum in bathrooms, due to a lack of regular cleaning maintenance.</li>
                            <li style="margin-bottom: 5px; color: #000000;">Extreme, hardened grease in kitchens, due to a lack of regular cleaning maintenance.</li>
                          </ul>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">Unreasonably dirty and cluttered homes will be subject to an additional fee.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">We are able to assist with a vacuum cleaner. As an extra precaution, we request Clients to have their personal vacuum cleaner on hand for our use, to prevent cross-contamination between properties and spreading allergens. Please kindly advise.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">We provide all necessary equipment and Eco-friendly and Biodegradable products.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">No travel charged within a 5km radius.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">50% deposit required on acceptance of booking. Balance paid on completion of work.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">Cleaning service can continue during load shedding. Appointments cannot be cancelled due to load shedding.</li>
                          <li class="terms-item" style="margin-bottom: 8px; color: #000000;">Further T&Cs apply, available upon request.</li>
                        </ul>
                      </div>
                      <p style="font-size:12px; color:#8a8a8a; margin-top:20px; text-align:center;">Copyright © 2025 Angi's Cleaning Service (Pty) Ltd</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
          </table>
        </div>
        
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </body>
      </html>
    `;


  // No footer insertion — keep the logo at the top only
  const finalEmailHtml = emailHtml;

    // Send email using Gmail SMTP
    console.log('Attempting to send email...');
    console.log('To:', email);
    console.log('CC:', process.env.BUSINESS_EMAIL || 'info@angicleans.co.za');
    
  const attachments = [];
  if (logoAttachment) attachments.push(logoAttachment);

    const emailResult = await transporter.sendMail({
      from: `"Angie's Cleaning Service" <${process.env.GMAIL_USER}>`,
      to: email, // Send to client's email address
      cc: process.env.BUSINESS_EMAIL || 'info@angicleans.co.za', // CC the business
      subject: `Your Quote from Angie's Cleaning Service`,
      html: finalEmailHtml,
      attachments
    });

    console.log('Email sent successfully:', emailResult.messageId);

    return NextResponse.json({ 
      message: 'Email sent successfully',
      messageId: emailResult.messageId,
      success: true
    });

  } catch (error) {
    // Log the full error on the server for debugging
    console.error('Error in send-quote API:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Return a more generic error to the client in production to avoid leaking info
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please try again later.', 
        details: isDev ? error.message : undefined,
        success: false 
      },
      { status: 500 }
    );
  }
}

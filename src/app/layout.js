import { Montserrat_Alternates, Roboto } from "next/font/google";
import "./globals.css";

/**
 * Font Configuration
 * Montserrat Alternates: Used for headings and brand elements - provides modern, professional typography
 * Roboto: Used for body text - ensures excellent readability across all devices
 */
const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-header",
  display: "swap", // Improves performance by preventing invisible text during font load
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body", 
  display: "swap",
});

/**
 * Global Metadata Configuration
 * Applied to all pages unless overridden at page level
 */
export const metadata = {
  title: "Angies Cleaning Services",
  description: "Professional Cleaning Services",
};

/**
 * Root Layout Component
 * Establishes the base HTML structure and font loading for the entire application
 * Wraps all pages with consistent typography and styling foundation
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for improved loading performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${montserratAlternates.variable} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}

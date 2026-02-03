# Angie's Cleaning Services Website 🧼

This is a professional cleaning services website built for **Angie's Cleaning Services**, featuring modern responsive design, interactive quote system, and seamless email integration. Built with **Next.js 13 App Router** and advanced UI components.

## 🚀 Live Site
Visit the live site: [Angie's Cleaning Services](https://www.angicleans.co.za)

---

## 📁 Project Structure

Built with **Next.js 13 App Router**, **CSS Modules**, and **client-side interactions** for dynamic functionality.

```
/src
├── app/
│   ├── layout.js → Global layout with font configuration
│   ├── page.js → Homepage with hero, services, and CTA
│   ├── quote/page.js → Interactive quote request form
│   ├── terms/page.js → Terms & conditions page
│   └── api/
│       └── send-quote/route.js → Email API for quote processing
└── components/
    ├── layout/
    │   ├── Header.js → Responsive header with scroll behavior
    │   ├── Footer.js → Global footer
    │   └── SocialsBar.js → Contact carousel with social links
    ├── sections/
    │   ├── HeroSection.js → Main landing section
    │   ├── AboutUsSection.js → Company story and differentiators
    │   └── ServicesSection.js → Service offerings display
    ├── forms/
    │   └── EmailForm.js → Lead capture form
    └── ui/
        ├── CustomCalendar.js → Date picker component
        ├── CustomNumberInput.js → Quantity selectors
        └── Input.js → Styled input components
```

---

## ✨ Features

- 🎯 **Dynamic Quote System**  
  - Real-time pricing calculation based on service type and property size
  - Add-on services with quantity selection
  - Professional email quotes with branded templates

- ⚙️ **Responsive Navigation**  
  - Mobile burger menu with smooth animations
  - Scroll-responsive header visibility (hide on scroll down, show on scroll up)
  - Auto-close menu on scroll with grace period

- 🌐 **Smart Page Navigation**  
  - Cross-page section linking (navigate to Home sections from any page)
  - Smooth scroll behavior with proper URL handling
  - Email parameter passing between pages

- 📱 **Mobile-Optimized Design**  
  - Carousel social bar on mobile, fixed positioning on desktop
  - Responsive breakpoints for all screen sizes
  - Touch-friendly interface elements

- 💌 **Professional Email Integration**  
  - Gmail SMTP integration for reliable delivery
  - Branded email templates with embedded logos
  - Quote confirmation system with detailed pricing breakdown

- 🎨 **Advanced UI Components**  
  - Custom calendar with date validation
  - Animated form interactions
  - Conditional rendering based on viewport and page context

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/joshuahuisman/angies-cleaning-website.git
cd angies-cleaning-website
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BUSINESS_EMAIL=business@example.com
```

**Note:** You'll need to generate an App Password for Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings → Security → App passwords
3. Generate a new app password for "Mail"

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🏗️ Technical Implementation

### Architecture Highlights

- **App Router Structure**: Utilizes Next.js 13's latest routing paradigm
- **Component Modularity**: Reusable components with CSS Modules for scoped styling
- **Email Processing**: Server-side API routes for secure email handling
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Key Components

**Header.js**: Advanced scroll behavior with different mobile/desktop logic
- Hide/show on scroll direction
- Menu auto-close with grace period
- Sticky positioning on desktop only

**Quote System**: Multi-step form with real-time calculations
- Dynamic pricing based on service selection
- Add-on quantity management
- Professional email generation

**SocialsBar.js**: Context-aware contact display
- Carousel behavior on mobile
- Fixed positioning on desktop
- Conditional rendering per page

---

## 📊 Performance Features

- **Font Optimization**: Next.js font loading with `display: swap`
- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic route-based splitting
- **Client-Side Navigation**: Fast page transitions

---

## 🎨 Design System

### Typography
- **Headers**: Montserrat Alternates (400-800 weights)
- **Body**: Roboto (300-700 weights)
- **Color Scheme**: Professional green (#568E4A) with neutral grays

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

---

## 🚀 Deployment

The site is optimized for deployment on **Vercel** (recommended) or any platform supporting Next.js.

### Deploy on Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```env
GMAIL_USER=production-email@gmail.com
GMAIL_APP_PASSWORD=production-app-password
BUSINESS_EMAIL=info@angiescare.co.za
```

---

## 🎯 Portfolio Highlights

This project demonstrates:

- **Modern React/Next.js Development**: App Router, Server Components, API Routes
- **Professional Email Integration**: Nodemailer with Gmail SMTP
- **Advanced UI/UX**: Responsive design with complex interaction patterns
- **Business Logic Implementation**: Quote calculations, form validation, state management
- **Performance Optimization**: Font loading, image optimization, code splitting

---

## 📝 License

This project is proprietary and built for Angie's Cleaning Services by Joshua Huisman.

---

## 👨‍💻 Developer

**Joshua Huisman**  
Software Engineer specializing in modern web applications

- Portfolio: [joshuahuisman.dev](https://joshuahuisman.dev)
- Email: joshua.huisman06@gmail.com
- LinkedIn: [Joshua Huisman](https://linkedin.com/in/joshuahuisman)

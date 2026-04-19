# 🌟 Skint Help

<div align="center">

**A premium food rescue platform connecting restaurants with surplus food to people in need through collection centers and delivery volunteers.**

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.9-ff0055?style=flat-square&logo=framer)](https://www.framer.com/motion)


</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Design Highlights](#design-highlights)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Pages Overview](#pages-overview)
- [Implementation Status](#implementation-status)
- [Standout Features](#standout-features)
- [Deployment](#deployment)
- [Development Notes](#development-notes)
- [Credits](#credits)

---

## Overview

Skint Help is a complete redesign and rebuild featuring a **modern dark-mode glassmorphism UI** with 3D effects, smooth animations, and an intuitive user experience. This platform enables seamless food rescue operations with dedicated portals for restaurants, volunteers, and collection centers.

### Mission
Fight food waste while feeding communities in need through innovative technology and seamless user experiences.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**The app will run on `http://localhost:5173`**

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🎨 Design Highlights

### Visual Design
- **Dark glassmorphism UI** with backdrop blur and neon accents
- **3D depth cards** with interactive hover tilt animations
- **Gradient text effects** using green → cyan → orange spectrum
- **RGB ring animations** on primary action buttons
- **Custom typography** - Space Grotesk (headings) + Inter (body)

### Animation & Motion
- **Framer Motion** powered page transitions and scroll animations
- **Animated counters** that count up on scroll
- **Particle backgrounds** with flowing elements
- **Micro-interactions** on all interactive elements
- **60fps smooth animations** with GPU acceleration

### Accessibility & Performance
- **Built with accessibility in mind** (ARIA labels and semantic HTML)
- **Mobile-first** responsive design approach
- **GPU-accelerated** animations for optimal performance
- **SEO-optimized** with meta tags and semantic structure

---

## 🏗️ Key Features

### 🔐 Authentication System
Next-generation login/signup experience with:
- 3D floating input fields with depth effects
- RGB rotating light ring on submit button
- Card tilt on mouse movement
- Success animation morphing into dashboard redirect

### 📊 Live Food Heat Map
Interactive map showing real-time food availability:
- Pulsing location markers
- Color-coded availability indicators (high/medium/low)
- Tooltips with meal counts
- Live stats sidebar

### 🎯 Animated Pipeline Visualization
Visual representation of the food journey:
- **Restaurant → Collection Center → People in Need**
- Flowing particles showing movement
- Real-time impact indicators
- Animated counters (50,000+ meals saved)

### 🚪 Multi-Portal System
Dedicated dashboards for different user roles:
- **Restaurant Portal** — Manage food donations and schedule pickups
- **Volunteer Portal** — Route optimization and delivery tracking
- **Collection Center Portal** — Inventory and distribution management

### 📈 Impact Analytics
Real-time metrics and visualizations:
- Animated counters for key statistics
- Progress bars with shimmer effects
- Environmental impact highlights
- 6 impact metrics with gradient icons

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Language** | TypeScript | 5.5 |
| **Styling** | Tailwind CSS | 3.4 |
| **Animation** | Framer Motion | 12.9 |
| **Routing** | React Router | 6.26 |
| **UI Components** | Radix UI | Latest |
| **Icons** | Lucide React | Latest |
| **Build Tool** | Vite | 5.4 |

---

## 📁 Project Structure

```
skint-help/
├── src/
│   ├── components/
│   │   ├── ui/                      # Shadcn UI components
│   │   ├── hero-section.tsx         # Animated hero with pipeline
│   │   ├── how-it-works.tsx         # 4-step process cards
│   │   ├── impact-section.tsx       # Metrics & statistics
│   │   ├── map-section.tsx          # Live heat map
│   │   ├── testimonials-section.tsx # User testimonials
│   │   ├── portal-section.tsx       # Role-based portals
│   │   ├── navbar.tsx               # Glassmorphic navigation
│   │   └── footer.tsx               # Premium footer
│   │
│   ├── pages/
│   │   ├── Index.tsx                # Home page
│   │   ├── Auth.tsx                 # Login/Signup
│   │   ├── JoinUs.tsx               # Role selection & forms
│   │   ├── Contact.tsx              # Contact form
│   │   ├── HowItWorks.tsx           # Detailed process
│   │   └── Impact.tsx               # Impact metrics
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication state
│   │
│   ├── index.css                    # Global styles & design system
│   └── App.tsx                      # Main app component
│
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 🎨 Design System

### Color Palette

```css
--neon-green:  hsl(142 76% 36%)    /* Primary green #22c55e */
--neon-orange: hsl(30 100% 50%)    /* Secondary orange */
--neon-cyan:   hsl(189 94% 43%)    /* Accent cyan */
--dark-bg:     #0a0a0a             /* Primary background */
--glass-bg:    rgba(255, 255, 255, 0.05)  /* Glass effect */
```

### Typography

- **Headings** — Space Grotesk (bold, modern, distinctive)
- **Body** — Inter (clean, readable, professional)

---

## 📄 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Hero section, features showcase, impact metrics, testimonials |
| **How It Works** | Detailed 4-step process explanation with animations |
| **Join Us** | Role selection and comprehensive registration forms |
| **Contact** | Contact form with info cards and interactive map |
| **Impact** | Detailed analytics dashboard with key statistics |
| **Auth** | Login and signup with 3D effects and validations |

---

### 🚧 Future Enhancements

- [ ] Backend integration with Supabase
- [ ] Real-time route optimization algorithm
- [ ] QR code generation and scanning
- [ ] Push notifications for urgent requests
- [ ] Advanced analytics with AI insights
- [ ] Mobile app (React Native)
- [ ] Blockchain transparency layer

---

## 🌟 Standout Features

1. **Animated Pipeline** — Visual food journey from restaurant to people
2. **3D Card Tilt** — Mouse-responsive card rotation for depth
3. **Live Heat Map** — Real-time availability with pulsing markers
4. **Scroll Counters** — Numbers animate on scroll into view
5. **Particle Effects** — Subtle floating background elements
6. **Glassmorphism** — Modern frosted glass aesthetic throughout
7. **Success Morphing** — Smooth transition animations on form submission

---

## 🚀 Deployment

Ready to deploy to any static hosting platform:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### AWS Amplify
```bash
npm install -g @aws-amplify/cli
amplify init
amplify publish
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Other Platforms
- **GitHub Pages** — Static deployment
- **Cloudflare Pages** — Edge deployment
- **Railway** — Easy deployment

---

## 📝 Development Notes

- All animations are **GPU-accelerated** for optimal performance
- **Mobile-first** responsive design approach
- **Zero dependencies** on no-code platforms
- **Production-ready** with proper error handling
- **SEO-optimized** with meta tags and semantic HTML
- **WCAG compliant** accessibility standards
- Code follows best practices with TypeScript strict mode enabled

---

## 🧪 Code Quality

### Linting & Formatting
```bash
# Run ESLint
npm run lint

# Format with Prettier
npm run format
```

### Commit Message Convention
```
feat: Add new feature
fix: Resolve bug
docs: Update documentation
style: Format code
refactor: Restructure code
test: Add tests
chore: Update dependencies
```

---

## 🔒 Security

- Environment variables for sensitive data (use `.env.local`)
- No authentication details in version control
- Input validation on all forms
- XSS protection with React's built-in escaping
- CSRF protection (server-side) — ensure your backend issues and validates tokens

### Environment Setup
```bash
# Create .env.local file
cp .env.example .env.local

# Update with your values
VITE_API_URL=your_api_url
VITE_AUTH_TOKEN=your_token
```

---

## 🤝 Contributing

We welcome internal contributions! However, this is a proprietary project.

If you are an external contributor, please note that we do not accept open community contributions. All external contributions must go through a closed PR process, subject to company permission requirements.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Failures
```bash
npm cache clean --force
npm run build
```

### Animations Not Smooth
- Check GPU acceleration is enabled
- Disable browser extensions
- Clear browser cache
- Check performance in DevTools

---

## 📚 Additional Resources

- **[React Documentation](https://react.dev)**
- **[Tailwind CSS Docs](https://tailwindcss.com)**
- **[Framer Motion Docs](https://www.framer.com/motion)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs)**

---

## 🙏 Credits

**Design & Development:** Full-Stack UI/UX Engineering Team  
**Design System:** Custom glassmorphic dark theme  
**Animations:** Framer Motion + Custom CSS  
**Icons:** Lucide React  
**UI Components:** Radix UI + Custom components  

---

## 📄 License

This is a proprietary project for Skint Help. All rights reserved.

---

## 📞 Contact & Support

- **Email:** [arpitsaraswat80@gmail.com](mailto:support@skinthelp.com)
- **LinkedIn:** [arpit saraswat](https://www.linkedin.com/in/arpit-saraswat-a12730288)

---

<div align="center">

**Built with love to fight food waste and feed communities**

[⬆ Back to Top](#-skint-help)

</div>
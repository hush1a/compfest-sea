# 🍽️ SEA Catering

A modern, professional meal delivery platform inspired by HelloFresh, built with cutting-edge technologies and beautiful UI/UX design. SEA Catering offers a seamless experience for discovering, customizing, and ordering premium meal plans.

## ✨ Features

- **🎨 Modern Design System**: Glass-morphism effects, smooth animations, and professional green color palette
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **⚡ Performance Optimized**: Built with Next.js 15 and Turbopack for lightning-fast development and builds
- **🎭 Rich Animations**: Framer Motion powered animations and micro-interactions
- **🔐 Authentication System**: Complete login/register flow with form validation
- **🍕 Interactive Menu**: Dynamic meal browsing with filtering and search capabilities
- **📊 User Dashboard**: Personalized experience with order tracking and meal management
- **💳 Subscription Plans**: Flexible meal plan options with pricing tiers
- **💬 Testimonials**: Social proof with customer reviews and ratings
- **📞 Contact System**: Easy communication with support team
- **🔍 Advanced UI Components**: Skeleton loading, modal overlays, and interactive cards

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Styling & Design
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility

### Form Management
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and quality assurance
- **[Turbopack](https://turbo.build/pack)** - Fast development server

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sea-catering
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
sea-catering/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── contact/           # Contact page
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/            # Authentication - Login
│   │   ├── menu/             # Menu browsing
│   │   ├── register/         # Authentication - Register
│   │   ├── subscription/     # Subscription plans
│   │   ├── testimonials/     # Customer reviews
│   │   ├── globals.css       # Global styles and theme
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   └── components/           # Reusable components
│       ├── auth/            # Authentication components
│       ├── Features.tsx     # Features showcase
│       ├── Footer.tsx       # Site footer
│       ├── MealPlanCard.tsx # Meal plan card component
│       └── Navigation.tsx   # Main navigation
├── public/                  # Static assets
└── ...config files
```

## 🎨 Design System

### Color Palette
- **Primary Green**: Modern, fresh green tones inspired by nature
- **Glass-morphism**: Translucent backgrounds with backdrop blur
- **Dark Mode Ready**: Consistent design across light and dark themes

### Typography
- **Geist Font Family**: Modern, clean typography from Vercel
- **Responsive Text**: Fluid typography that scales across devices

### Components
- **Interactive Cards**: Hover effects and smooth transitions
- **Modern Forms**: Clean inputs with validation states
- **Loading States**: Skeleton loaders for better UX
- **Modals & Overlays**: Contextual information display

## 🚢 Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Connect your repository to Vercel
2. Configure environment variables (if any)
3. Deploy with automatic CI/CD

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Responsive design principles
- Accessibility best practices

### Performance
- Next.js automatic optimizations
- Image optimization
- Code splitting
- Tree shaking

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Framer Motion Documentation](https://www.framer.com/motion/) - Animation library
- [React Hook Form Documentation](https://react-hook-form.com/) - Form management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using modern web technologies for an exceptional user experience.

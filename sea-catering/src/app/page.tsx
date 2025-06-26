import Hero from '../components/Hero'
import Features from '../components/Features'
import TestimonialsSection from '../components/TestimonialsSection'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <div className="pt-16">
        <Hero />
        <Features />
        <TestimonialsSection />
      </div>
      <Footer />
    </>
  )
}

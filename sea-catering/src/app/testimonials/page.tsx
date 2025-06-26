import TestimonialsSection from '../../components/TestimonialsSection'
import PageHeader from '../../components/PageHeader'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function TestimonialsPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16">
        <PageHeader 
          title="Customer Testimonials"
          description="Read what our customers have to say about their SEA Catering experience and share your own story."
        />
        <TestimonialsSection />
      </div>
      <Footer />
    </>
  )
}

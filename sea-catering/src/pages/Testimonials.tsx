import TestimonialsSection from '../components/TestimonialsSection'
import PageHeader from '../components/PageHeader'

const Testimonials = () => {
  return (
    <div className="pt-16">
      <PageHeader 
        title="Customer Testimonials"
        description="Read what our customers have to say about their SEA Catering experience and share your own story."
      />
      <TestimonialsSection />
    </div>
  )
}

export default Testimonials

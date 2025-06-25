import Hero from '../components/Hero'
import Features from '../components/Features'
import TestimonialsSection from '../components/TestimonialsSection'
import Subscription from '../components/Subscription'

const Home = () => {
  return (
    <div className="pt-16">
      <Hero />
      <Features />
      <TestimonialsSection />
      <Subscription />
    </div>
  )
}

export default Home

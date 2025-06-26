'use client'

import { useState, useEffect } from 'react'
import TestimonialForm from './TestimonialForm'
import TestimonialCarousel, { Testimonial } from './TestimonialCarousel'
import { testimonialsApi } from '../services/api'

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await testimonialsApi.getApproved({ limit: 20 })
        
        if (response.success && response.data) {
          // Transform API data to match component interface
          const transformedTestimonials: Testimonial[] = response.data.map((testimonial: any, index: number) => ({
            id: index + 1, // Use index as ID since the component expects number
            name: testimonial.name,
            message: testimonial.message,
            rating: testimonial.rating,
            date: formatDate(testimonial.createdAt),
            plan: testimonial.plan,
            location: testimonial.location
          }))
          
          setTestimonials(transformedTestimonials)
        } else {
          throw new Error('Failed to fetch testimonials')
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setError(err instanceof Error ? err.message : 'Failed to load testimonials')
        
        // Fallback to sample data if API fails
        setTestimonials([
          {
            id: 1,
            name: "Sarah Johnson",
            message: "The Diet Plan has been amazing for my weight loss journey. The portions are perfect and the taste is incredible!",
            rating: 5,
            date: "2 weeks ago"
          },
          {
            id: 2,
            name: "Mike Chen",
            message: "As a fitness enthusiast, the Protein Plan gives me exactly what I need. High quality meals that support my training.",
            rating: 5,
            date: "1 month ago"
          },
          {
            id: 3,
            name: "Lisa Rodriguez",
            message: "The Royal Plan is pure luxury! Every meal feels like dining at a 5-star restaurant. Worth every penny.",
            rating: 5,
            date: "3 weeks ago"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 60) return '1 month ago'
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const handleNewTestimonial = async (testimonialData: { 
    name: string; 
    message: string; 
    rating: number;
    plan?: string;
    location?: string;
  }) => {
    try {
      // Submit to API
      const response = await testimonialsApi.create({
        name: testimonialData.name,
        message: testimonialData.message,
        rating: testimonialData.rating,
        plan: testimonialData.plan as 'diet' | 'protein' | 'royal' | undefined,
        location: testimonialData.location
      })

      if (response.success) {
        // Show success message
        alert('Thank you for your testimonial! It has been submitted for review and will appear once approved.')
        
        // Optionally add to local state with pending status
        const newTestimonial: Testimonial = {
          id: testimonials.length + 1,
          name: testimonialData.name,
          message: testimonialData.message,
          rating: testimonialData.rating,
          date: "Pending approval"
        }
        
        // Note: Don't add to testimonials array since it needs approval first
        // setTestimonials(prev => [newTestimonial, ...prev])
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      alert('Sorry, there was an error submitting your testimonial. Please try again later.')
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real customers are saying about their SEA Catering experience.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="text-sm">⚠️ Using sample data - API connection unavailable</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        ) : (
          <>
            {/* Testimonials Carousel */}
            <div className="mb-16">
              <TestimonialCarousel testimonials={testimonials} />
            </div>

            {/* Testimonial Form */}
            <div className="max-w-2xl mx-auto">
              <TestimonialForm onSubmit={handleNewTestimonial} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default TestimonialsSection

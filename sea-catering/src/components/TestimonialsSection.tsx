import { useState } from 'react'
import TestimonialForm from './TestimonialForm'
import TestimonialCarousel, { Testimonial } from './TestimonialCarousel'

const TestimonialsSection = () => {
  // Sample testimonials data
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      rating: 5,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      message: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      rating: 5,
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.",
      rating: 4,
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "David Thompson",
      message: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      rating: 5,
      date: "1 week ago"
    },
    {
      id: 5,
      name: "Lisa Patel",
      message: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      rating: 5,
      date: "2 months ago"
    },
    {
      id: 6,
      name: "James Wilson",
      message: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.",
      rating: 4,
      date: "1 month ago"
    }
  ])

  const handleNewTestimonial = (testimonialData: { name: string; message: string; rating: number }) => {
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: testimonialData.name,
      message: testimonialData.message,
      rating: testimonialData.rating,
      date: "Just now"
    }

    setTestimonials(prev => [newTestimonial, ...prev])
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
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <TestimonialCarousel testimonials={testimonials} />
        </div>

        {/* Testimonial Form */}
        <div className="max-w-2xl mx-auto">
          <TestimonialForm onSubmit={handleNewTestimonial} />
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

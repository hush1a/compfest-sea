import { useState, useEffect } from 'react'

export interface Testimonial {
  id: number
  name: string
  message: string
  rating: number
  date: string
  avatar?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">No testimonials yet. Be the first to share your experience!</p>
      </div>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 md:p-12">
        {/* Quote Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-12 h-12 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
          </svg>
        </div>

        {/* Testimonial Content */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
            "{currentTestimonial.message}"
          </p>

          {/* Customer Info */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentTestimonial.avatar ? (
                <img 
                  src={currentTestimonial.avatar} 
                  alt={currentTestimonial.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(currentTestimonial.name)
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{currentTestimonial.name}</h4>
              <p className="text-sm text-gray-500">{currentTestimonial.date}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex justify-center mb-8">
            {renderStars(currentTestimonial.rating)}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {testimonials.length > 1 && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isAutoPlaying ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
            }`}
            title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isAutoPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default TestimonialCarousel

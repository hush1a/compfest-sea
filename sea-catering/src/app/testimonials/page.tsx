'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Heart, 
  Users, 
  TrendingUp, 
  Award,
  CheckCircle,
  Utensils,
  Calendar,
  MapPin,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { testimonialsApi } from '../../services/api';

interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  date: string;
  plan?: string;
  location?: string;
  avatar?: string;
}

interface TestimonialFormData {
  name: string;
  message: string;
  rating: number;
  plan?: string;
  location?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    message: '',
    rating: 5,
    plan: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await testimonialsApi.getApproved({ limit: 20 });
        
        if (response.success && response.data) {
          const transformedTestimonials: Testimonial[] = response.data.map((testimonial: any, index: number) => ({
            id: index + 1,
            name: testimonial.name,
            message: testimonial.message,
            rating: testimonial.rating,
            date: formatDate(testimonial.createdAt),
            plan: testimonial.plan,
            location: testimonial.location,
            avatar: generateAvatar(testimonial.name)
          }));
          
          setTestimonials(transformedTestimonials);
        } else {
          throw new Error('Failed to fetch testimonials');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to load testimonials');
        
        // Fallback to sample data
        setTestimonials([
          {
            id: 1,
            name: "Sarah Johnson",
            message: "SEA Catering completely transformed my relationship with food. The Diet Plan helped me lose 15 pounds while actually enjoying every meal. The variety is incredible and I never feel deprived!",
            rating: 5,
            date: "2 weeks ago",
            plan: "Diet Plan",
            location: "Jakarta",
            avatar: generateAvatar("Sarah Johnson")
          },
          {
            id: 2,
            name: "Mike Chen",
            message: "As a fitness enthusiast, the Protein Plan is exactly what I needed. Every meal is perfectly balanced with high-quality proteins that support my training goals. Game changer!",
            rating: 5,
            date: "1 month ago",
            plan: "Protein Plan",
            location: "Surabaya",
            avatar: generateAvatar("Mike Chen")
          },
          {
            id: 3,
            name: "Lisa Rodriguez",
            message: "The Royal Plan is pure luxury! Each meal feels like fine dining at home. The presentation, taste, and quality are absolutely exceptional. Worth every rupiah!",
            rating: 5,
            date: "3 weeks ago",
            plan: "Royal Plan",
            location: "Bandung",
            avatar: generateAvatar("Lisa Rodriguez")
          },
          {
            id: 4,
            name: "Ahmad Pratama",
            message: "Pelayanan luar biasa dan makanannya selalu fresh! Delivery tepat waktu dan customer service sangat responsif. Highly recommended untuk yang mau hidup sehat!",
            rating: 5,
            date: "1 week ago",
            plan: "Diet Plan",
            location: "Yogyakarta",
            avatar: generateAvatar("Ahmad Pratama")
          },
          {
            id: 5,
            name: "Emma Thompson",
            message: "I've tried many meal delivery services, but SEA Catering stands out. The attention to detail, freshness, and customer care is unmatched. My family loves it!",
            rating: 5,
            date: "2 months ago",
            plan: "Royal Plan",
            location: "Medan",
            avatar: generateAvatar("Emma Thompson")
          },
          {
            id: 6,
            name: "Dewi Sari",
            message: "Sebagai working mom, SEA Catering sangat membantu. Tidak perlu ribet masak, keluarga tetap makan sehat dan enak. Anak-anak juga suka!",
            rating: 5,
            date: "5 days ago",
            plan: "Protein Plan",
            location: "Semarang",
            avatar: generateAvatar("Dewi Sari")
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Generate avatar based on name
  function generateAvatar(name: string): string {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colorIndex = name.length % colors.length;
    return `${colors[colorIndex]} ${initials}`;
  }

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await testimonialsApi.create({
        name: formData.name,
        message: formData.message,
        rating: formData.rating,
        plan: formData.plan as 'diet' | 'protein' | 'royal' | undefined,
        location: formData.location
      });

      if (response.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          message: '',
          rating: 5,
          plan: '',
          location: ''
        });
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Sorry, there was an error submitting your testimonial. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { icon: Users, value: '5,000+', label: 'Happy Customers' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' },
    { icon: Utensils, value: '50,000+', label: 'Meals Delivered' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Heart className="w-4 h-4" />
                Loved by Thousands
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Stories from Our
                <span className="text-emerald-600 block">Happy Customers</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Real experiences from real people who've transformed their eating habits with SEA Catering. Read their journeys and share your own.
              </p>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Carousel */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative"
                  >
                    {/* Quote Icon */}
                    <div className="absolute -top-6 left-8">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 items-center">
                      {/* Avatar */}
                      <div className="md:col-span-3 text-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 ${testimonials[currentIndex]?.avatar?.split(' ')[0] || 'bg-emerald-500'}`}>
                          {testimonials[currentIndex]?.avatar?.split(' ')[1] || 'SA'}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {testimonials[currentIndex]?.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (testimonials[currentIndex]?.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          {testimonials[currentIndex]?.plan && (
                            <div className="flex items-center justify-center gap-1">
                              <Utensils className="w-3 h-3" />
                              {testimonials[currentIndex].plan}
                            </div>
                          )}
                          {testimonials[currentIndex]?.location && (
                            <div className="flex items-center justify-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {testimonials[currentIndex].location}
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {testimonials[currentIndex]?.date}
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Content */}
                      <div className="md:col-span-9">
                        <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-6">
                          "{testimonials[currentIndex]?.message}"
                        </blockquote>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                      <button
                        onClick={prevTestimonial}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={testimonials.length <= 1}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentIndex ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextTestimonial}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={testimonials.length <= 1}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Share Your Story */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Share Your Story
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-600">
                  We'd love to hear about your experience with SEA Catering
                </motion.p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your testimonial has been submitted for review and will appear once approved.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setShowForm(false);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                ) : !showForm ? (
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Have a great experience to share?
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Help others discover the joy of healthy eating by sharing your SEA Catering journey.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Write a Testimonial
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="Your city"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Meal Plan (Optional)
                        </label>
                        <select
                          value={formData.plan}
                          onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        >
                          <option value="">Select a plan</option>
                          <option value="diet">Diet Plan</option>
                          <option value="protein">Protein Plan</option>
                          <option value="royal">Royal Plan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating *
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, rating }))}
                              className="p-2"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  rating <= formData.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Experience *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="Tell us about your experience with SEA Catering..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Testimonial
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

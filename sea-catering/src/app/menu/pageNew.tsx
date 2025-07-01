'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, ChefHat, Star, Clock } from 'lucide-react'
import MealPlanCard from '../../components/MealPlanCard'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { mealPlansApi } from '../../services/api'

interface MealPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  image: string
  features: string[]
  detailedDescription: string
  nutritionInfo: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
  sampleMeals: string[]
  dietaryInfo: string[]
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Plans', color: 'bg-gray-100 text-gray-700' },
  { value: 'diet', label: 'Diet Plans', color: 'bg-blue-100 text-blue-700' },
  { value: 'protein', label: 'Protein Plans', color: 'bg-orange-100 text-orange-700' },
  { value: 'royal', label: 'Royal Plans', color: 'bg-purple-100 text-purple-700' },
]

export default function MenuPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await mealPlansApi.getAll({ active: true })
        
        if (response.success && response.data) {
          const transformedPlans = response.data.map((plan: any) => ({
            id: plan._id,
            name: plan.name,
            price: `Rp ${plan.price.toLocaleString('id-ID')}`,
            period: plan.duration,
            description: plan.description,
            image: plan.image,
            features: plan.features || [],
            detailedDescription: plan.detailedDescription || plan.description,
            nutritionInfo: {
              calories: plan.nutritionInfo?.calories || '500-800',
              protein: plan.nutritionInfo?.protein || '25-40g',
              carbs: plan.nutritionInfo?.carbs || '45-65g',
              fat: plan.nutritionInfo?.fat || '20-35g'
            },
            sampleMeals: plan.sampleMeals || [],
            dietaryInfo: plan.dietaryInfo || []
          }))
          setMealPlans(transformedPlans)
          setFilteredPlans(transformedPlans)
        } else {
          setError('Failed to fetch meal plans')
        }
      } catch (err) {
        console.error('Error fetching meal plans:', err)
        setError('An error occurred while fetching meal plans')
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlans()
  }, [])

  useEffect(() => {
    let filtered = mealPlans

    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(plan => 
        plan.name.toLowerCase().includes(selectedFilter.toLowerCase())
      )
    }

    setFilteredPlans(filtered)
  }, [mealPlans, searchTerm, selectedFilter])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-20 pt-32">
          <div className="container mx-auto px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <ChefHat size={48} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Choose Your Perfect
                <span className="block text-yellow-300">Meal Plan</span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                Discover nutritious, delicious meals crafted by expert chefs and delivered fresh to your door
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-green-100">
                <div className="flex items-center space-x-2">
                  <Star size={20} className="text-yellow-300 fill-current" />
                  <span className="font-semibold">4.8/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={20} />
                  <span className="font-semibold">Daily Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChefHat size={20} />
                  <span className="font-semibold">Chef Crafted</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meal plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </button>
                
                <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-wrap gap-2`}>
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedFilter === option.value
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredPlans.length}</span> meal plan{filteredPlans.length !== 1 ? 's' : ''}
              {searchTerm && (
                <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>
              )}
            </div>
          </div>
        </section>

        {/* Meal Plans Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden">
                    <div className="h-56 bg-gray-200 skeleton"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded skeleton"></div>
                      <div className="h-4 bg-gray-200 rounded skeleton w-3/4"></div>
                      <div className="h-8 bg-gray-200 rounded skeleton w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded skeleton"></div>
                        <div className="h-3 bg-gray-200 rounded skeleton w-5/6"></div>
                      </div>
                      <div className="h-12 bg-gray-200 rounded skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Meal Plans</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            ) : filteredPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meal Plans Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedFilter('all')
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPlans.map((mealPlan) => (
                  <motion.div key={mealPlan.id} variants={itemVariants}>
                    <MealPlanCard mealPlan={mealPlan} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-500 to-green-600">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Healthy Journey?
              </h2>
              <p className="text-green-100 text-lg mb-8">
                Join thousands of satisfied customers who have transformed their lifestyle with our meal plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Browse All Plans
                </button>
                <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 border-2 border-green-400">
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

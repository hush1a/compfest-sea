'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Star, Clock, Users, ArrowRight, Info, Heart } from 'lucide-react'
import Modal from './Modal'
import { useAuth } from '@/contexts/AuthContext'

interface MealPlan {
  id: string | number
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

interface MealPlanCardProps {
  mealPlan: MealPlan
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      router.push('/subscription')
    }
  }

  const getBadgeColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'diet plan':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'protein plan':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'royal plan':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={mealPlan.image} 
            alt={mealPlan.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Heart 
              size={18} 
              className={`transition-colors duration-200 ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
            />
          </button>

          {/* Plan Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getBadgeColor(mealPlan.name)}`}>
              {mealPlan.name}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-gray-800">4.8</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
              {mealPlan.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {mealPlan.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">{mealPlan.price}</span>
              <span className="text-gray-500 text-sm font-medium">/{mealPlan.period}</span>
            </div>
            <div className="flex items-center space-x-1 mt-1 text-gray-500 text-xs">
              <Clock size={12} />
              <span>Delivered daily</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-2">
              {mealPlan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
            
            {mealPlan.features.length > 3 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 text-green-600 text-sm font-medium hover:text-green-700 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>View all features</span>
                <Info size={14} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.calories}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.protein}</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubscribeClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>Subscribe Now</span>
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white hover:bg-gray-50 text-green-600 font-semibold py-3 px-6 rounded-xl border-2 border-green-500 transition-all duration-200 hover:shadow-md"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Popular Badge for Royal Plan */}
        {mealPlan.name.toLowerCase().includes('royal') && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-lg">
            Most Popular
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-2xl mx-auto">
          {/* Modal Header */}
          <div className="relative mb-6">
            <img 
              src={mealPlan.image} 
              alt={mealPlan.name}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getBadgeColor(mealPlan.name)}`}>
                {mealPlan.name}
              </span>
            </div>
          </div>

          <div className="px-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{mealPlan.name}</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{mealPlan.detailedDescription}</p>
              </div>

              {/* Nutrition Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.calories}</div>
                    <div className="text-sm text-gray-500">Calories</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.protein}</div>
                    <div className="text-sm text-gray-500">Protein</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.carbs}</div>
                    <div className="text-sm text-gray-500">Carbs</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{mealPlan.nutritionInfo.fat}</div>
                    <div className="text-sm text-gray-500">Fat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {mealPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Meals */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Meals</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {mealPlan.sampleMeals.map((meal, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-700">{meal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {mealPlan.dietaryInfo.map((info, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {info}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubscribeClick}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Subscribe to {mealPlan.name}</span>
                <ArrowRight size={16} />
              </motion.button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MealPlanCard

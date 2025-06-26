'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import { MealPlan } from '../data/mealPlans'

interface MealPlanCardProps {
  mealPlan: MealPlan
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={mealPlan.image} 
            alt={mealPlan.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {mealPlan.period}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800">{mealPlan.name}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-500">{mealPlan.price}</div>
              <div className="text-sm text-gray-500">{mealPlan.period}</div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{mealPlan.description}</p>
          
          <div className="space-y-2 mb-6">
            {mealPlan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
            {mealPlan.features.length > 3 && (
              <div className="text-sm text-gray-500">
                + {mealPlan.features.length - 3} more features
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              See More Details
            </button>
            <Link 
              to="/subscription"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{mealPlan.name}</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-500">{mealPlan.price}</div>
                <div className="text-sm text-gray-500">{mealPlan.period}</div>
              </div>
            </div>
            <img 
              src={mealPlan.image} 
              alt={mealPlan.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">About This Plan</h3>
              <p className="text-gray-600 leading-relaxed">{mealPlan.detailedDescription}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Nutrition Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600">{mealPlan.nutritionInfo.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{mealPlan.nutritionInfo.protein}</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{mealPlan.nutritionInfo.carbs}</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{mealPlan.nutritionInfo.fat}</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
            </div>

            {mealPlan.sampleMeals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Sample Meals</h3>
                <div className="grid gap-2">
                  {mealPlan.sampleMeals.map((meal, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {meal}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">What's Included</h3>
              <div className="grid gap-2">
                {mealPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {mealPlan.dietaryInfo.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {mealPlan.dietaryInfo.map((info, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                      {info}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t">
              <Link 
                to="/subscription"
                className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-center"
              >
                Subscribe to This Plan
              </Link>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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

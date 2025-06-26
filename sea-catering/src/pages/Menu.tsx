'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MealPlanCard from '../components/MealPlanCard'
import PageHeader from '../components/PageHeader'
import { mealPlansData } from '../data/mealPlans'
import { mealPlansApi } from '../services/api'

const Menu = () => {
  const [mealPlans, setMealPlans] = useState(mealPlansData) // Fallback to static data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await mealPlansApi.getAll({ active: true })
        
        if (response.success && response.data) {
          // Transform API data to match component interface
          const transformedPlans = response.data.map((plan: any) => ({
            id: plan._id,
            name: plan.name,
            price: `Rp ${plan.price.toLocaleString('id-ID')}`,
            period: 'per meal',
            description: plan.description,
            detailedDescription: plan.detailedDescription,
            features: plan.features,
            nutritionInfo: plan.nutritionInfo,
            sampleMeals: [], // API doesn't have sample meals yet
            dietaryInfo: [], // API doesn't have dietary info yet
            image: '/api/placeholder/400/300', // Placeholder image
            planType: plan.planType
          }))
          
          setMealPlans(transformedPlans)
        }
      } catch (err) {
        console.error('Error fetching meal plans:', err)
        setError(err instanceof Error ? err.message : 'Failed to load meal plans')
        // Keep using fallback static data
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlans()
  }, [])
  return (
    <div className="pt-16">
      <PageHeader 
        title="Our Meal Plans"
        description="Choose from our carefully crafted meal plans designed to meet your nutritional needs and taste preferences. Order individual meals or create a subscription."
      />
      
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {error && (
            <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-center">
              <p>⚠️ Using sample data - API connection unavailable</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading meal plans...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mealPlans.map((plan) => (
                <MealPlanCard key={plan.id} mealPlan={plan} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Create your personalized subscription and get delicious, nutritious meals delivered to your door.
          </p>
          <Link 
            to="/subscription"
            className="inline-block bg-white text-emerald-600 py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Subscription
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Menu

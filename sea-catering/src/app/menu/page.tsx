'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MealPlanCard from '../../components/MealPlanCard'
import PageHeader from '../../components/PageHeader'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { mealPlansData } from '../../data/mealPlans'
import { mealPlansApi } from '../../services/api'

export default function MenuPage() {
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
          const transformedPlans = response.data.map((plan: unknown) => {
            const apiPlan = plan as Record<string, unknown>
            return {
              id: apiPlan._id,
              name: apiPlan.name,
              price: `Rp ${(apiPlan.price as number).toLocaleString('id-ID')}`,
              period: 'per meal',
              description: apiPlan.description,
              detailedDescription: apiPlan.detailedDescription,
              features: apiPlan.features,
              nutritionInfo: apiPlan.nutritionInfo,
              sampleMeals: [], // API doesn't have sample meals yet
              dietaryInfo: [], // API doesn't have dietary info yet
              image: '/api/placeholder/400/300', // Placeholder image
              planType: apiPlan.planType
            }
          })
          
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

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading meal plans...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="pt-16">
        <PageHeader
          title="Our Meal Plans"
          description="Choose from our variety of healthy and delicious meal plans tailored to your dietary needs and preferences"
        />
        
        {error && (
          <div className="container mx-auto px-6 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Warning: {error}. Showing sample meal plans instead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fresh, Healthy Meals Delivered
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                All our meal plans are crafted by nutritionists and prepared by professional chefs using the finest ingredients.
              </p>
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-emerald-800 text-sm">
                  <strong>Note:</strong> Browsing meal plans is open to everyone. To place an order, please{' '}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline">
                    sign in
                  </Link>{' '}
                  or{' '}
                  <Link href="/register" className="text-emerald-600 hover:text-emerald-700 underline">
                    create an account
                  </Link>.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealPlans.map((plan) => (
                <MealPlanCard key={plan.id} mealPlan={plan} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

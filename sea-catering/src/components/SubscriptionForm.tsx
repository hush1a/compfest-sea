'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { subscriptionApi } from '../services/api'

interface SubscriptionFormData {
  name: string
  phone: string
  plan: 'diet' | 'protein' | 'royal'
  mealTypes: string[]
  deliveryDays: string[]
  allergies: string
}

const planPrices = {
  diet: 30000,
  protein: 40000,
  royal: 60000
}

const planNames = {
  diet: 'Diet Plan',
  protein: 'Protein Plan',
  royal: 'Royal Plan'
}

const mealOptions = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' }
]

const dayOptions = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
]

const SubscriptionForm = () => {
  const [selectedPlan, setSelectedPlan] = useState<'diet' | 'protein' | 'royal'>('diet')
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      name: '',
      phone: '',
      plan: 'diet',
      mealTypes: [],
      deliveryDays: [],
      allergies: ''
    }
  })

  // Calculate total price
  const calculatePrice = () => {
    if (selectedMealTypes.length === 0 || selectedDays.length === 0) {
      return 0
    }
    
    const planPrice = planPrices[selectedPlan]
    const mealTypesCount = selectedMealTypes.length
    const deliveryDaysCount = selectedDays.length
    const multiplier = 4.3
    
    return planPrice * mealTypesCount * deliveryDaysCount * multiplier
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handlePlanChange = (plan: 'diet' | 'protein' | 'royal') => {
    setSelectedPlan(plan)
    setValue('plan', plan)
  }

  const handleMealTypeToggle = (mealType: string) => {
    const updatedMealTypes = selectedMealTypes.includes(mealType)
      ? selectedMealTypes.filter(type => type !== mealType)
      : [...selectedMealTypes, mealType]
    
    setSelectedMealTypes(updatedMealTypes)
    setValue('mealTypes', updatedMealTypes)
  }

  const handleDayToggle = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day]
    
    setSelectedDays(updatedDays)
    setValue('deliveryDays', updatedDays)
  }

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true)
    
    try {
      const subscriptionData = {
        name: data.name,
        phone: data.phone,
        plan: selectedPlan,
        mealTypes: selectedMealTypes,
        deliveryDays: selectedDays,
        allergies: data.allergies || ''
      }

      const response = await subscriptionApi.create(subscriptionData)
      
      if (response.success) {
        alert(`Subscription Created Successfully!
        
Name: ${data.name}
Phone: ${data.phone}
Plan: ${planNames[selectedPlan]}
Meal Types: ${selectedMealTypes.join(', ')}
Delivery Days: ${selectedDays.join(', ')}
Allergies: ${data.allergies || 'None'}
Total Price: ${response.formattedPrice}

Your subscription has been saved to our database and will be processed shortly.`)
        
        // Reset form
        setSelectedMealTypes([])
        setSelectedDays([])
        setSelectedPlan('diet')
      } else {
        throw new Error('Failed to create subscription')
      }
    } catch (error) {
      console.error('Subscription creation error:', error)
      alert(`Error creating subscription: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = calculatePrice()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription Details</h3>
          <p className="text-gray-600">Customize your meal plan and get healthy meals delivered to your door</p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Active Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^(\+62|62|0)[0-9]{9,13}$/,
                  message: 'Please enter a valid Indonesian phone number'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 08123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Plan *
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(planPrices).map(([planKey, price]) => (
              <div
                key={planKey}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === planKey
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePlanChange(planKey as 'diet' | 'protein' | 'royal')}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {planNames[planKey as keyof typeof planNames]}
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPrice(price)}
                  </p>
                  <p className="text-sm text-gray-500">per meal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Meal Types * (at least one required)
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {mealOptions.map((meal) => (
              <div
                key={meal.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMealTypes.includes(meal.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTypeToggle(meal.id)}
              >
                <div className="text-center">
                  <div className="w-6 h-6 mx-auto mb-2">
                    {selectedMealTypes.includes(meal.id) && (
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{meal.label}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedMealTypes.length === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select at least one meal type</p>
          )}
        </div>

        {/* Delivery Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Delivery Days * (at least one required)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {dayOptions.map((day) => (
              <div
                key={day.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
                  selectedDays.includes(day.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleDayToggle(day.id)}
              >
                <div className="w-4 h-4 mx-auto mb-1">
                  {selectedDays.includes(day.id) && (
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">{day.label}</p>
              </div>
            ))}
          </div>
          {selectedDays.length === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select at least one delivery day</p>
          )}
        </div>

        {/* Allergies */}
        <div>
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
            Allergies / Dietary Restrictions (Optional)
          </label>
          <textarea
            id="allergies"
            {...register('allergies')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Please list any allergies or dietary restrictions..."
          />
        </div>

        {/* Price Summary */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
          
          {totalPrice > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Plan: {planNames[selectedPlan]}</span>
                <span>{formatPrice(planPrices[selectedPlan])} per meal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Meal Types:</span>
                <span>{selectedMealTypes.length} type{selectedMealTypes.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Days:</span>
                <span>{selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Multiplier:</span>
                <span>4.3 weeks</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Monthly Price:</span>
                <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Calculation: {formatPrice(planPrices[selectedPlan])} × {selectedMealTypes.length} × {selectedDays.length} × 4.3
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Select your plan, meal types, and delivery days to see the price</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={
              isSubmitting || 
              selectedMealTypes.length === 0 || 
              selectedDays.length === 0 || 
              totalPrice === 0
            }
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isSubmitting || selectedMealTypes.length === 0 || selectedDays.length === 0 || totalPrice === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Subscription...
              </span>
            ) : (
              `Create Subscription - ${totalPrice > 0 ? formatPrice(totalPrice) : 'Select Options'}`
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default SubscriptionForm
